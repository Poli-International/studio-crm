import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure single local SQLite database file in ./data/
const defaultDataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(defaultDataDir)) {
  try {
    fs.mkdirSync(defaultDataDir, { recursive: true });
  } catch (e) {
    console.warn('[SQLite] Notice creating data directory:', e?.message || e);
  }
}

const sqliteDbPath = process.env.SQLITE_DB_PATH || path.join(defaultDataDir, 'studio_crm.sqlite');

export const sqlite = new Database(sqliteDbPath);

// Enable WAL mode for high-concurrency reading/writing and durability
try {
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
} catch (e) {
  // Pragma settings applied where supported
}

// Columns added after a database may already exist. CREATE TABLE IF NOT
// EXISTS will not add them, so each is applied here when missing.
const columnMigrations = [['documents', 'content', 'TEXT']];

// Auto-initialize all schema tables on startup
const tableInitStatements = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'manager',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    action TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    user TEXT DEFAULT 'Admin Manager',
    badge_color TEXT DEFAULT 'blue',
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS inventory_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    item_id INTEGER,
    quantity INTEGER NOT NULL,
    change_type TEXT DEFAULT 'adjustment',
    logged_by TEXT DEFAULT 'Staff Lead',
    notes TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    client_id INTEGER,
    service_type TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    staff_id INTEGER,
    status TEXT DEFAULT 'Confirmed',
    date TEXT,
    time TEXT,
    duration INTEGER DEFAULT 60,
    deposit REAL DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS financial_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    staff_id INTEGER,
    client_name TEXT,
    amount REAL,
    method TEXT,
    payment_method TEXT,
    category TEXT,
    type TEXT DEFAULT 'payment',
    status TEXT DEFAULT 'completed',
    source TEXT DEFAULT 'in-studio',
    description TEXT,
    artist_name TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active',
    medical_alerts TEXT,
    allergies TEXT,
    emergency_contact TEXT,
    avatar TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'artist',
    title TEXT,
    active INTEGER DEFAULT 1,
    specialties TEXT,
    phone TEXT,
    bio TEXT,
    notes TEXT,
    linkedin TEXT,
    twitter TEXT,
    facebook TEXT,
    whatsapp TEXT,
    telegram TEXT,
    instagram TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    expiry_date TEXT,
    cert_number TEXT,
    file_name TEXT,
    file_data TEXT,
    status TEXT DEFAULT 'active'
  )`,
  `CREATE TABLE IF NOT EXISTS compliance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER,
    type TEXT NOT NULL,
    log_date TEXT,
    status TEXT DEFAULT 'pass',
    details TEXT,
    cycle_number TEXT,
    autoclave_id TEXT,
    temperature REAL,
    pressure REAL,
    duration INTEGER,
    spore_test_result TEXT,
    operator_name TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT,
    entity_id INTEGER,
    type TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size INTEGER,
    content TEXT,
    uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    category TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    min_threshold INTEGER DEFAULT 5,
    unit_price REAL DEFAULT 0,
    cost_price REAL DEFAULT 0,
    supplier TEXT,
    location TEXT,
    last_restocked TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS client_tattoo_work (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    style TEXT,
    artist TEXT,
    status TEXT DEFAULT 'completed',
    date TEXT,
    notes TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS team_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    recipient TEXT,
    station TEXT,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0
  )`
];

tableInitStatements.forEach(stmt => {
  try {
    sqlite.exec(stmt);
  } catch (err) {
    console.warn('[SQLite] Table init warning:', err?.message || err);
  }
});

for (const [table, column, type] of columnMigrations) {
  try {
    const cols = sqlite.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
    if (cols.length && !cols.includes(column)) {
      sqlite.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run();
      console.log(`[SQLite] Added missing column ${table}.${column}`);
    }
  } catch (e) {
    console.warn(`[SQLite] Could not add ${table}.${column}:`, e?.message || e);
  }
}

export const db = drizzle(sqlite, { schema });

/**
 * Execute a database query with safe fallback handling.
 * @template T
 * @param {() => Promise<T>|T} queryFn
 * @param {T} fallback
 * @param {number} [timeoutMs=2000]
 * @returns {Promise<T>}
 */
export async function safeDbQuery(queryFn, fallback, timeoutMs = 2000) {
  try {
    const resultOrPromise = queryFn();
    if (resultOrPromise && typeof resultOrPromise.then === 'function') {
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`Query timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      });
      const res = await Promise.race([resultOrPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      return res;
    }
    return resultOrPromise;
  } catch (err) {
    console.warn('[Database safeDbQuery notice]:', err?.message || err);
    return fallback;
  }
}
