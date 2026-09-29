import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('manager'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const activityLogs = sqliteTable('activity_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category').notNull(),
  action: text('action').notNull(),
  title: text('title').notNull(),
  details: text('details').notNull(),
  user: text('user').default('Admin Manager'),
  badgeColor: text('badge_color').default('blue'),
  timestamp: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`),
});

export const inventoryLogs = sqliteTable('inventory_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemName: text('item_name').notNull(),
  itemId: integer('item_id'),
  quantity: integer('quantity').notNull(),
  changeType: text('change_type').default('adjustment'),
  loggedBy: text('logged_by').default('Staff Lead'),
  notes: text('notes'),
  timestamp: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`),
});

export const appointments = sqliteTable('appointments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientName: text('client_name').notNull(),
  clientId: integer('client_id'),
  serviceType: text('service_type').notNull(),
  artistName: text('artist_name').notNull(),
  staffId: integer('staff_id'),
  status: text('status').default('Confirmed'),
  date: text('date'),
  time: text('time'),
  duration: integer('duration').default(60),
  deposit: real('deposit').default(0),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const financialTransactions = sqliteTable('financial_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientId: integer('client_id'),
  staffId: integer('staff_id'),
  clientName: text('client_name'),
  amount: real('amount'),
  method: text('method'),
  paymentMethod: text('payment_method'),
  category: text('category'),
  type: text('type').default('payment'),
  status: text('status').default('completed'),
  source: text('source').default('in-studio'),
  description: text('description'),
  artistName: text('artist_name'),
  date: text('date').default(sql`(CURRENT_TIMESTAMP)`),
});

export const clients = sqliteTable('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  notes: text('notes'),
  status: text('status').default('active'),
  medicalAlerts: text('medical_alerts'),
  allergies: text('allergies'),
  emergencyContact: text('emergency_contact'),
  avatar: text('avatar'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const staff = sqliteTable('staff', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').default('artist'),
  title: text('title'),
  active: integer('active').default(1),
  specialties: text('specialties'),
  phone: text('phone'),
  bio: text('bio'),
  notes: text('notes'),
  linkedin: text('linkedin'),
  twitter: text('twitter'),
  facebook: text('facebook'),
  whatsapp: text('whatsapp'),
  telegram: text('telegram'),
  instagram: text('instagram'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const certifications = sqliteTable('certifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  staffId: integer('staff_id').notNull(),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  issueDate: text('issue_date'),
  expiryDate: text('expiry_date'),
  certNumber: text('cert_number'),
  fileName: text('file_name'),
  fileData: text('file_data'),
  status: text('status').default('active'),
});

export const complianceRecords = sqliteTable('compliance_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  staffId: integer('staff_id'),
  type: text('type').notNull(),
  logDate: text('log_date'),
  status: text('status').default('pass'),
  details: text('details'),
  cycleNumber: text('cycle_number'),
  autoclaveId: text('autoclave_id'),
  temperature: real('temperature'),
  pressure: real('pressure'),
  duration: integer('duration'),
  sporeTestResult: text('spore_test_result'),
  operatorName: text('operator_name'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const documents = sqliteTable('documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  entityType: text('entity_type'),
  entityId: integer('entity_id'),
  type: text('type').notNull(),
  description: text('description'),
  filePath: text('file_path'),
  fileName: text('file_name'),
  fileType: text('file_type'),
  fileSize: integer('file_size'),
  // Consent forms are stored as JSON rather than an uploaded file, so a
  // record stays readable without the PDF.
  content: text('content'),
  uploadedAt: text('uploaded_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const inventory = sqliteTable('inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  sku: text('sku').unique(),
  category: text('category').notNull(),
  quantity: integer('quantity').default(0),
  minThreshold: integer('min_threshold').default(5),
  unitPrice: real('unit_price').default(0),
  costPrice: real('cost_price').default(0),
  supplier: text('supplier'),
  location: text('location'),
  lastRestocked: text('last_restocked'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const clientTattooWork = sqliteTable('client_tattoo_work', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientId: integer('client_id').notNull(),
  title: text('title').notNull(),
  style: text('style'),
  artist: text('artist'),
  status: text('status').default('completed'),
  date: text('date'),
  notes: text('notes'),
  imageUrl: text('image_url'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const teamMessages = sqliteTable('team_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sender: text('sender').notNull(),
  recipient: text('recipient'),
  station: text('station'),
  message: text('message').notNull(),
  category: text('category').default('general'),
  timestamp: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`),
  read: integer('read').default(0),
});
