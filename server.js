import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';
import { formatMoney } from './src/money.js';
import { STATUSES, toTimestamp, findClash } from './src/bookings.js';
import { paymentError, paymentAmount } from './src/payments.js';
import { studioDay } from './src/studio-day.js';
import { db, safeDbQuery, sqlite } from './src/db/index.js';
import { startHttps, studioAddress } from './src/https.js';
import { installAccess } from './src/access.js';
import { installAssessment } from './src/assessment.js';
import { installUpdate } from './src/update.js';
import { pruneAutoBackups, AUTO_BACKUP } from './src/backups.js';
import { GUARDIAN_AGE, ageOn, isGuardianForm, dobFromResponses } from './src/consent-age.js';
import { AFTERCARE_LANGS, addAftercareTranslations } from './src/aftercare-texts.js';
import { listScanners, scanPages } from './src/scanner.js';
import { docIdFor, saveScanFiles, scanPagesOf, scanFileName } from './src/scan-files.js';
import { PHOTO_NAME, isPhotoData, countPhotos, photosToFiles, copyPhotos } from './src/photo-files.js';
import { mergeMedicalInto } from './src/utils/crm-utils.js';
import {
  users as dbUsers,
  activityLogs as dbActivityLogs,
  appointments as dbAppointments,
  financialTransactions as dbFinancialTransactions,
  clients as dbClients,
  staff as dbStaff,
  certifications as dbCertifications,
  complianceRecords as dbComplianceRecords,
  documents as dbDocuments,
  inventory as dbInventory,
  clientTattooWork as dbClientTattooWork,
  teamMessages as dbTeamMessages
} from './src/db/schema.js';
import { desc } from 'drizzle-orm';

// A date or a timestamp as the studio's day (YYYY-MM-DD): the day on the studio's clock, not the UTC day. A bare day stays as it is.
const dayOf = (v) => {
  const s = String(v || '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s.slice(0, 10) : studioDay(d);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function safeIsoDate(val, fallback = new Date().toISOString()) {
  if (!val || val === 'CURRENT_TIMESTAMP') return fallback;
  const d = new Date(val);
  return isNaN(d.getTime()) ? fallback : d.toISOString();
}

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')).version;
// the studio's files: photos, scans, backups (STUDIO_CRM_STORAGE is for the tests)
const STORAGE_DIR = process.env.STUDIO_CRM_STORAGE || path.join(__dirname, 'storage');
const PHOTO_DIR = path.join(STORAGE_DIR, 'photos');

app.use(express.json({ limit: '15mb' })); // portfolio photos arrive as data URLs

// Optional studio password: when one is set, nothing below answers before the device has signed in.
installAccess(app, sqlite, () => staff);
installUpdate(app, { root: __dirname, version: APP_VERSION, sqlite, saveAll: () => saveAll(), copyBackup: (f) => copyBackupOut(f) });   // both are defined further down

// Save state after every successful write (persistence block at the end of this file).
app.use((req, res, next) => {
  if (req.method !== 'GET' && /^\/api\//i.test(req.path)) res.on('finish', () => { if (res.statusCode < 400) scheduleStateSave(); });
  next();
});
// New-artist assessment (Settings, New artists): its own tables in the SQLite file; the team list is staff above.
installAssessment(app, sqlite, { staff: () => staff, country: () => { try { return JSON.parse(appData.poli_studio_profile || '{}').studioCountry; } catch (e) { return ''; } }, log: (e) => logActivity({ user: 'Admin Manager', badgeColor: 'purple', ...e }) });
app.use(express.urlencoded({ extended: true }));

// Tool pages get the clipboard fallback: dozens of Copy buttons in the tools call
// navigator.clipboard, which a tablet on the http address does not have.
const PUBLIC_DIR = path.join(__dirname, 'public');
app.use((req, res, next) => {
  if (req.method !== 'GET' || !/^\/tools\/.+(\.html|\/)$/.test(req.path)) return next();
  const file = path.join(PUBLIC_DIR, req.path.endsWith('/') ? req.path + 'index.html' : req.path);
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return next();
  fs.readFile(file, 'utf8', (err, html) => (err ? next()
    : res.type('html').send(html.replace(/<head[^>]*>/i, (head) => head + '<script src="/js/clipboard-fallback.js"></script>'))));
});

// Serve static assets from public directory
app.use(express.static(PUBLIC_DIR));

// Real-time SSE Clients & Activity Log Data Store
const sseClients = [];

const activityLogs = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    category: 'appointment',
    action: 'UPDATED',
    title: 'Appointment Confirmed',
    details: 'Alex Rivera — Tattoo Custom Sleeve session confirmed with Jaxon Vance',
    user: 'Jaxon Vance',
    badgeColor: 'blue'
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    category: 'inventory',
    action: 'STOCK_CHECK',
    title: 'Low Stock Alert',
    details: 'Nitrile Gloves Box (M) reached reorder threshold (8 units remaining)',
    user: 'Auto-Monitor System',
    badgeColor: 'amber'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1 * 86400000 + 120 * 60000).toISOString(),
    category: 'financial',
    action: 'PAYMENT_RECEIVED',
    title: 'Deposit Payment Recorded',
    details: '$350.00 payment received for Alex Rivera via Card (In-Studio)',
    user: 'Admin Manager',
    badgeColor: 'green'
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 2 * 86400000 + 45 * 60000).toISOString(),
    category: 'compliance',
    action: 'LOG_PASSED',
    title: 'Autoclave Sterilization Passed',
    details: 'Spore test cycle #1042 passed & verified by Jaxon Vance',
    user: 'Jaxon Vance',
    badgeColor: 'indigo'
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 3 * 86400000 + 90 * 60000).toISOString(),
    category: 'client',
    action: 'CREATED',
    title: 'New Client Profile Created',
    details: 'Samantha Chen registered — Assigned to Maya Lin for Piercing curation',
    user: 'Maya Lin',
    badgeColor: 'purple'
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 4 * 86400000 + 150 * 60000).toISOString(),
    category: 'staff',
    action: 'SHIFT_LOG',
    title: 'Artist Shift Completed',
    details: 'Jaxon Vance completed 8h tattooing session & sanitized workstation',
    user: 'Jaxon Vance',
    badgeColor: 'blue'
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 5 * 86400000 + 200 * 60000).toISOString(),
    category: 'appointment',
    action: 'COMPLETED',
    title: 'Piercing Consultation Done',
    details: 'Helix Titanium Earring placement & aftercare instructions issued',
    user: 'Maya Lin',
    badgeColor: 'purple'
  }
];

let nextActivityId = 8;

function logActivity({ category, action, title, details, user = 'Admin Manager', badgeColor = 'blue' }) {
  // "Admin Manager" is the demo owner's name, written into ~50 routes as "who did it": it now names the
  // studio's own owner (in an emptied studio "Studio owner", until the studio renames them)
  if (user === 'Admin Manager') {
    try { user = (staff.find((s) => s.role === 'manager') || {}).name || 'Studio'; } catch (e) { /* the staff list is not built yet */ }
  }
  const newEntry = {
    id: nextActivityId++,
    timestamp: new Date().toISOString(),
    category: category || 'general',
    action: action || 'ACTION',
    title,
    details: details || '',
    user,
    badgeColor
  };
  activityLogs.unshift(newEntry);
  if (activityLogs.length > 200) activityLogs.pop();

  // Asynchronously persist to Cloud SQL
  safeDbQuery(() => db.insert(dbActivityLogs).values({
    category: newEntry.category,
    action: newEntry.action,
    title: newEntry.title,
    details: newEntry.details,
    user: newEntry.user,
    badgeColor: newEntry.badgeColor
  }), null).catch(() => {});

  // Broadcast to all connected SSE clients (both legacy format and delta format)
  const payload = `data: ${JSON.stringify(newEntry)}\n\n`;
  const deltaPayload = `data: ${JSON.stringify({ type: 'activity_delta', op: 'create', id: newEntry.id, delta: newEntry, timestamp: new Date().toISOString() })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(payload);
      sseClients[i].write(deltaPayload);
    } catch (e) {
      sseClients.splice(i, 1);
    }
  }
  return newEntry;
}

// Function to broadcast delta SSE events to all connected clients
function broadcastSseDelta(op, data) {
  const payload = `data: ${JSON.stringify({ type: 'activity_delta', op, data, timestamp: new Date().toISOString() })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(payload);
    } catch (e) {
      sseClients.splice(i, 1);
    }
  }
}

// Function to broadcast custom SSE events to all connected clients
function broadcastSseEvent(eventType, data) {
  const payload = `data: ${JSON.stringify({ type: eventType, data, timestamp: new Date().toISOString() })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(payload);
    } catch (e) {
      sseClients.splice(i, 1);
    }
  }
}

// Heartbeat ping to keep SSE connections alive
setInterval(() => {
  const ping = `data: ${JSON.stringify({ type: 'ping', time: new Date().toISOString() })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(ping);
    } catch (e) {
      sseClients.splice(i, 1);
    }
  }
}, 25000);

// Mock In-Memory Database

const clientTattooWork = [
  {
    id: 1,
    client_id: 1,
    client_name: 'Alex Rivera',
    title: 'Custom Japanese Dragon Sleeve — Session #3',
    category: 'Tattoo Session',
    date: '2025-01-15',
    artist: 'Jaxon Vance',
    image_url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800&q=80',
    description: 'Black and grey shading on upper arm dragon scale lining and background cloud waves.',
    tags: ['Japanese', 'Sleeve', 'In Progress']
  },
  {
    id: 2,
    client_id: 1,
    client_name: 'Alex Rivera',
    title: 'Fine-Line Geometric Forearm Stencil',
    category: 'Stencil Design',
    date: '2024-11-10',
    artist: 'Jaxon Vance',
    image_url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&q=80',
    description: 'Sacred geometry stencil placement and skin prep audit passed.',
    tags: ['Geometric', 'Stencil', 'Fine-Line']
  },
  {
    id: 3,
    client_id: 2,
    client_name: 'Samantha Chen',
    title: 'Titanium Helix & Conch Piercing Set',
    category: 'Piercing Session',
    date: '2025-01-18',
    artist: 'Maya Lin',
    image_url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80',
    description: 'Anodized gold titanium double helix with opal cluster conch stud.',
    tags: ['Ear Piercing', 'Titanium', 'Healed']
  },
  {
    id: 4,
    client_id: 3,
    client_name: 'Marcus Brody',
    title: 'Traditional Koi & Lotus Backpiece Outline',
    category: 'Tattoo Session',
    date: '2025-01-10',
    artist: 'Jaxon Vance',
    image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&q=80',
    description: 'Bold linework session 1 completed with sterile 14RL needle grouping.',
    tags: ['Traditional', 'Backpiece', 'Linework']
  },
  {
    id: 5,
    client_id: 4,
    client_name: 'Elena Rostova',
    title: 'Botanical Floral Rib Curation',
    category: 'Tattoo Session',
    date: '2025-01-20',
    artist: 'Soren Frost',
    image_url: 'https://images.unsplash.com/photo-1542382257-80dedb725088?w=800&q=80',
    description: 'Micro-realism peonies and fern foliage healed touch-up.',
    tags: ['Botanical', 'Micro-Realism', 'Healed']
  }
];

const clients = [
  { 
    id: 1, 
    name: 'Alex Rivera', 
    email: 'alex.r@example.com', 
    phone: '555-0142', 
    profession: 'Graphic Designer', 
    notes: 'Sleeve tattoo project in progress', 
    assigned_staff_id: 2, 
    assigned_staff_name: 'Jaxon Vance', 
    dob: '1992-04-12', 
    allergies: 'Latex', 
    medical_history: 'None', 
    lastVisit: '2025-01-15',
    staff_notes: [
      {
        id: 101,
        author: 'Jaxon Vance',
        author_role: 'Senior Tattoo Artist',
        category: 'Procedure Observation',
        note: 'Client handles 3-hour line sessions well. Prefers Hustle Butter CBD soothing ointment during shading passes.',
        timestamp: '2026-07-14T14:30:00.000Z'
      },
      {
        id: 102,
        author: 'Admin Manager',
        author_role: 'Studio Owner & Manager',
        category: 'Client Preference',
        note: 'Verified non-latex nitrile gloves must be staged at Station A1 for all future appointments due to allergy.',
        timestamp: '2026-08-02T09:15:00.000Z'
      }
    ]
  },
  { 
    id: 2, 
    name: 'Samantha Chen', 
    email: 'sam.chen@example.com', 
    phone: '555-0198', 
    profession: 'Architect', 
    notes: 'Piercing follow-up scheduled', 
    assigned_staff_id: 3, 
    assigned_staff_name: 'Maya Lin', 
    dob: '1988-09-23', 
    allergies: 'None', 
    medical_history: 'Sensitive skin', 
    lastVisit: '2025-01-18',
    staff_notes: [
      {
        id: 201,
        author: 'Maya Lin',
        author_role: 'Master Piercing Specialist',
        category: 'Skin Sensitivity',
        note: 'Prone to minor irritation around cartilage piercings. Only ASTM F-136 implant-grade titanium threadless labrets recommended.',
        timestamp: '2026-07-28T16:45:00.000Z'
      }
    ]
  },
  { 
    id: 3, 
    name: 'Marcus Brody', 
    email: 'm.brody@example.com', 
    phone: '555-0177', 
    profession: 'Software Engineer', 
    notes: 'Interested in Japanese traditional style', 
    assigned_staff_id: 2, 
    assigned_staff_name: 'Jaxon Vance', 
    dob: '1995-11-05', 
    allergies: 'Penicillin', 
    medical_history: 'None', 
    lastVisit: '2025-01-10',
    staff_notes: [
      {
        id: 301,
        author: 'Jaxon Vance',
        author_role: 'Senior Tattoo Artist',
        category: 'Consultation & Deposit',
        note: 'Deposit received for Ryu Dragon chest plate piece. Color palette: Sumi black, cinnabar red, and bamboo green.',
        timestamp: '2026-08-10T11:20:00.000Z'
      }
    ]
  },
  { 
    id: 4, 
    name: 'Elena Rostova', 
    email: 'elena@example.com', 
    phone: '555-0133', 
    profession: 'Photographer', 
    notes: 'Completed backpiece touch-up', 
    assigned_staff_id: 4, 
    assigned_staff_name: 'Soren Frost', 
    dob: '1991-03-30', 
    allergies: 'None', 
    medical_history: 'None', 
    lastVisit: '2025-01-20',
    staff_notes: [
      {
        id: 401,
        author: 'Admin Manager',
        author_role: 'Studio Owner & Manager',
        category: 'Follow-up',
        note: 'Backpiece completely healed with high contrast retention. Consented to portfolio gallery feature.',
        timestamp: '2026-08-15T15:00:00.000Z'
      }
    ]
  }
];

const staff = [
  {
    id: 1,
    name: 'Admin Manager',
    email: 'admin@studiocrm.com',
    role: 'manager',
    title: 'Studio Owner & Manager',
    active: true,
    specialties: ['Studio Operations', 'Client Care', 'Sanitation Safety'],
    phone: '555-0100',
    bio: 'Oversees overall studio operations, artist scheduling, compliance regulations, and client care standards with 12+ years in body art administration.',
    notes: 'Handles Tuesday/Thursday studio sterilization audits, inventory restocking schedules, and monthly artist commission calculations.',
    linkedin: 'linkedin.com/in/admin-manager-studio',
    twitter: '@studiocrm_owner',
    facebook: 'facebook.com/studiocrmofficial',
    whatsapp: '+1 (555) 010-0011',
    telegram: '@studiocrm_admin',
    instagram: '@studiocrm_main',
    certifications: [
      { id: 101, name: 'OSHA Bloodborne Pathogens & Universal Precautions', issuer: 'American Red Cross', issueDate: '2024-01-15', fileName: 'bloodborne_pathogens_admin.pdf', fileData: null },
      { id: 102, name: 'Body Art Facility Manager Safety Accreditation', issuer: 'Department of Public Health', issueDate: '2023-06-20', fileName: 'facility_manager_license.pdf', fileData: null }
    ]
  },
  {
    id: 2,
    name: 'Jaxon Vance',
    email: 'jaxon@studiocrm.com',
    role: 'artist',
    title: 'Senior Tattoo Artist',
    active: true,
    specialties: ['Japanese Traditional', 'Black & Grey Realism', 'Custom Sleeves'],
    phone: '555-0102',
    bio: '10+ years specializing in large-scale custom Japanese traditional sleeves, irezumi motifs, and hyper-detailed black & grey realism portraits.',
    notes: 'Prefers Kwadron 3RL and 7RL cartridges; uses FK Irons Spektra Flux machine at 8.2V. Preferred station: Station A1 near natural lighting.',
    linkedin: 'linkedin.com/in/jaxon-vance-ink',
    twitter: '@jaxon_vance',
    facebook: 'facebook.com/jaxonvance.tattoos',
    whatsapp: '+1 (555) 010-2233',
    telegram: '@jaxon_ink',
    instagram: '@jaxon_vance_ink',
    certifications: [
      { id: 201, name: 'Master Tattoo Artist Practitioner License', issuer: 'State Board of Barbering & Cosmetology', issueDate: '2023-09-10', fileName: 'jaxon_master_tattoo_license.pdf', fileData: null },
      { id: 202, name: 'OSHA Bloodborne Pathogens & Infection Control', issuer: 'National Safety Council', issueDate: '2024-02-18', fileName: 'jaxon_bbp_cert_2024.pdf', fileData: null },
      { id: 203, name: 'Advanced Skin & Pigmentology Diploma', issuer: 'International Tattoo Academy', issueDate: '2022-11-05', fileName: 'pigmentology_diploma.pdf', fileData: null }
    ]
  },
  {
    id: 3,
    name: 'Maya Lin',
    email: 'maya@studiocrm.com',
    role: 'piercer',
    title: 'Master Piercing Specialist',
    active: true,
    specialties: ['Ear Curations', 'Titanium Jewelry', 'Micro-dermal'],
    phone: '555-0103',
    bio: 'Experienced body piercer specializing in precision body piercing, aseptic technique, established professional practice, and bespoke ear curations.',
    notes: 'Requires 14G & 16G threadless implant-grade titanium jewelry in stock. Station B2 equipped with dedicated Statim 2000 autoclave.',
    linkedin: 'linkedin.com/in/mayalin-piercing',
    twitter: '@mayalin_pierce',
    facebook: 'facebook.com/mayalin.bodyart',
    whatsapp: '+1 (555) 010-3344',
    telegram: '@mayalin_piercing',
    instagram: '@mayalin_piercing',
    certifications: [
      { id: 301, name: 'Aseptic Piercing & Technique Certificate', issuer: 'Industry Training', issueDate: '2023-05-14', fileName: 'aseptic_piercing_cert.pdf', fileData: null },
      { id: 302, name: 'Aseptic Technique & Autoclave Sterilization Diploma', issuer: 'Medical Safety Institute', issueDate: '2024-01-22', fileName: 'aseptic_sterilization_diploma.pdf', fileData: null }
    ]
  },
  {
    id: 4,
    name: 'Soren Frost',
    email: 'soren@studiocrm.com',
    role: 'artist',
    title: 'Resident Fine-Line Artist',
    active: true,
    specialties: ['Fine-Line', 'Micro-Realism', 'Botanicals'],
    phone: '555-0104',
    bio: 'Specialist in single-needle fine line tattoos, intricate botanical illustrations, micro-realism architectural geometry, and delicate script.',
    notes: 'Uses Bishop Power Wand Shader at 6.8V for ultra-fine single needle lines. Requires high-CRI 5000K daylight LED lamp at station.',
    linkedin: 'linkedin.com/in/sorenfrost-art',
    twitter: '@soren_frost',
    facebook: 'facebook.com/sorenfrost.art',
    whatsapp: '+1 (555) 010-4455',
    telegram: '@soren_frost_tattoo',
    instagram: '@soren_frost_tattoo',
    certifications: [
      { id: 401, name: 'Licensed Tattoo Practitioner', issuer: 'City Department of Health', issueDate: '2023-10-01', fileName: 'soren_tattoo_license.pdf', fileData: null },
      { id: 402, name: 'Bloodborne Pathogens Standard Training Certificate', issuer: 'ProTrainings', issueDate: '2024-03-01', fileName: 'bbp_certificate_soren.pdf', fileData: null }
    ]
  },
  {
    id: 5,
    name: 'Chloe Vance',
    email: 'chloe@studiocrm.com',
    role: 'apprentice',
    title: 'Tattoo Apprentice & PMU Specialist',
    active: true,
    specialties: ['Flash Tattoos', 'Cosmetic PMU', 'Aftercare'],
    phone: '555-0105',
    bio: 'Specializing in flash pieces, lip blushing, powder brows, and cosmetic PMU eyebrows under Jaxon Vance mentorship.',
    notes: 'PMU machine: Cheyenne Sol Terra. Uses Tina Davies pigments for lip blush & powder brows. Mentorship check-ins every Friday at 4 PM.',
    linkedin: 'linkedin.com/in/chloevance-pmu',
    twitter: '@chloev_pmu',
    facebook: 'facebook.com/chloevance.beauty',
    whatsapp: '+1 (555) 010-5566',
    telegram: '@chloe_pmu',
    instagram: '@chloev_pmu',
    certifications: [
      { id: 501, name: 'Permanent Makeup (PMU) & Microblading Diploma', issuer: 'Cosmetic Tattoo Academy', issueDate: '2023-12-10', fileName: 'pmu_microblading_diploma.pdf', fileData: null },
      { id: 502, name: 'Tattoo Apprenticeship Completion Certificate', issuer: 'Studio CRM Academy', issueDate: '2024-04-15', fileName: 'apprentice_certificate.pdf', fileData: null }
    ]
  }
];

const teamMessages = [
  {
    id: 1,
    author: 'Jaxon Vance',
    role: 'Senior Tattoo Artist',
    avatar: '👨‍🎨',
    channel: 'equipment',
    text: 'Hey team, Kwadron 3RL needle cartridges in Station A1 are down to the last 2 boxes. Please trigger a PO reorder or add to today’s supply run!',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    pinned: true
  },
  {
    id: 2,
    author: 'Maya Lin',
    role: 'Master Piercing Specialist',
    avatar: '👩‍⚕️',
    channel: 'studio-floor',
    text: 'Statim 2000 autoclave spore test cycle #1042 passed with flying colors this morning. Logged in the compliance tab! 🛡️',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    pinned: false
  },
  {
    id: 3,
    author: 'Admin Manager',
    role: 'Studio Owner & Manager',
    avatar: '💼',
    channel: 'general',
    text: 'Reminder: The health inspector is visiting next Tuesday at 10 AM. Please ensure all station sterilization logs & biohazard waste containers are sealed & labeled.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    pinned: true
  },
  {
    id: 4,
    author: 'Soren Frost',
    role: 'Fine-Line Artist',
    avatar: '🎨',
    channel: 'client-notes',
    text: 'Alex Rivera confirmed for tomorrow’s sleeve shading session. Workstation prepared with Bishop Wand & Kwadron set.',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    pinned: false
  }
];

let nextMessageId = 5;

const now = new Date();
const todayAt = (hours, mins = 0, offsetDays = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, mins, 0, 0);
  return d.toISOString();
};

const appointments = [
  { id: 1, client_id: 1, staff_id: 2, service_type: 'Tattoo - Custom Sleeve', datetime: new Date(Date.now() + 22 * 3600 * 1000).toISOString(), duration_minutes: 180, estimated_price: 650, deposit_paid: 150, status: 'scheduled', client_name: 'Alex Rivera', staff_name: 'Jaxon Vance', notes: 'Session 2: Upper arm shading' },
  { id: 2, client_id: 2, staff_id: 3, service_type: 'Piercing - Helix & Tragus', datetime: new Date(Date.now() + 18 * 3600 * 1000).toISOString(), duration_minutes: 45, estimated_price: 95, deposit_paid: 0, status: 'scheduled', client_name: 'Samantha Chen', staff_name: 'Maya Lin', notes: 'Titanium jewelry selected' },
  { id: 3, client_id: 3, staff_id: 2, service_type: 'Consultation - Japanese Backpiece', datetime: todayAt(11, 30, 2), duration_minutes: 60, estimated_price: 0, deposit_paid: 0, status: 'scheduled', client_name: 'Marcus Brody', staff_name: 'Jaxon Vance', notes: 'Bring reference sketches' },
  { id: 4, client_id: 4, staff_id: 4, service_type: 'Fine-Line Botanical Tattoo', datetime: todayAt(15, 30, 3), duration_minutes: 120, estimated_price: 280, deposit_paid: 80, status: 'scheduled', client_name: 'Elena Rostova', staff_name: 'Soren Frost', notes: 'Wildflower bouquet on forearm' },
  { id: 5, client_id: 1, staff_id: 5, service_type: 'Lip Blush PMU Touch-Up', datetime: todayAt(13, 0, 4), duration_minutes: 90, estimated_price: 180, deposit_paid: 50, status: 'scheduled', client_name: 'Alex Rivera', staff_name: 'Chloe Vance', notes: 'PMU touch up under Jaxon supervision' }
];

const services = [
  { id: 1, client_id: 1, staff_id: 2, type: 'Tattoo Session 1', date_completed: '2025-01-15', notes: 'Line work completed on upper arm', client_name: 'Alex Rivera' },
  { id: 2, client_id: 2, staff_id: 3, type: 'Helix Piercing', date_completed: '2025-01-18', notes: 'Titanium stud used, aftercare kit provided', client_name: 'Samantha Chen' }
];

const inventory = [
  { 
    id: 1, 
    name: 'Sterile Tattoo Needles 3RL', 
    item_type: 'Needles', 
    category: 'Needles',
    sku: 'NDL-3RL-100', 
    quantity: 150, 
    reorder_point: 50, 
    price: 25.00, 
    unit_cost: 25.00,
    unit_cost_30d_ago: 24.50,
    unit_cost_90d_ago: 24.00,
    unit_cost_1yr_avg: 24.25,
    lot_number: 'LOT-NDL-2026A', 
    exp_date: '2026-11-15', 
    supplier: 'NeedleCraft Supply Co.', 
    lead_time_days: 3, 
    daily_burn: 4.5,
    order_history: [
      { date: '2026-07-28', po_number: 'PO-2026-089', qty: 100, unit_cost: 25.00, status: 'Delivered', lead_time_days: 3 },
      { date: '2026-06-12', po_number: 'PO-2026-064', qty: 80, unit_cost: 24.50, status: 'Delivered', lead_time_days: 3 },
      { date: '2026-05-04', po_number: 'PO-2026-041', qty: 100, unit_cost: 24.00, status: 'Delivered', lead_time_days: 2 }
    ]
  },
  { 
    id: 2, 
    name: 'Black Tattoo Ink 8oz', 
    item_type: 'Ink', 
    category: 'Inks',
    sku: 'INK-BLK-08', 
    quantity: 12, 
    reorder_point: 5, 
    price: 45.00, 
    unit_cost: 45.00,
    unit_cost_30d_ago: 44.00,
    unit_cost_90d_ago: 42.50,
    unit_cost_1yr_avg: 43.00,
    lot_number: 'LOT-INK-9912', 
    exp_date: '2026-08-25', 
    supplier: 'Eternal Ink Direct', 
    lead_time_days: 4, 
    daily_burn: 1.2,
    order_history: [
      { date: '2026-07-20', po_number: 'PO-2026-085', qty: 10, unit_cost: 45.00, status: 'Delivered', lead_time_days: 4 },
      { date: '2026-06-05', po_number: 'PO-2026-058', qty: 12, unit_cost: 44.00, status: 'Delivered', lead_time_days: 4 },
      { date: '2026-04-18', po_number: 'PO-2026-033', qty: 10, unit_cost: 42.50, status: 'Delivered', lead_time_days: 3 }
    ]
  },
  { 
    id: 3, 
    name: 'Titanium Helix Barbell 16G', 
    item_type: 'Jewelry', 
    category: 'Jewelry',
    sku: 'JWL-THB-16', 
    quantity: 45, 
    reorder_point: 20, 
    price: 18.50, 
    unit_cost: 18.50,
    unit_cost_30d_ago: 18.00,
    unit_cost_90d_ago: 17.50,
    unit_cost_1yr_avg: 17.80,
    lot_number: 'LOT-JWL-7740', 
    exp_date: '2028-05-01', 
    supplier: 'Piercing World Wholesale', 
    lead_time_days: 5, 
    daily_burn: 2.1,
    order_history: [
      { date: '2026-07-15', po_number: 'PO-2026-081', qty: 30, unit_cost: 18.50, status: 'Delivered', lead_time_days: 5 },
      { date: '2026-05-22', po_number: 'PO-2026-052', qty: 25, unit_cost: 18.00, status: 'Delivered', lead_time_days: 4 },
      { date: '2026-03-30', po_number: 'PO-2026-027', qty: 40, unit_cost: 17.50, status: 'Delivered', lead_time_days: 5 }
    ]
  },
  { 
    id: 4, 
    name: 'Nitrile Gloves Box (M)', 
    item_type: 'Supplies', 
    category: 'Supplies',
    sku: 'SUP-GLV-M', 
    quantity: 4, 
    reorder_point: 10, 
    price: 15.00, 
    unit_cost: 15.00,
    unit_cost_30d_ago: 14.75,
    unit_cost_90d_ago: 14.50,
    unit_cost_1yr_avg: 14.60,
    lot_number: 'LOT-GLV-4421', 
    exp_date: '2027-02-10', 
    supplier: 'MedSafe Studio Depot', 
    lead_time_days: 2, 
    daily_burn: 3.8,
    order_history: [
      { date: '2026-07-24', po_number: 'PO-2026-087', qty: 15, unit_cost: 15.00, status: 'Delivered', lead_time_days: 2 },
      { date: '2026-06-28', po_number: 'PO-2026-071', qty: 20, unit_cost: 14.75, status: 'Delivered', lead_time_days: 2 },
      { date: '2026-05-15', po_number: 'PO-2026-046', qty: 15, unit_cost: 14.50, status: 'Delivered', lead_time_days: 2 }
    ]
  },
  { 
    id: 5, 
    name: 'Tattoo Aftercare Balm 2oz', 
    item_type: 'Aftercare', 
    category: 'Aftercare',
    sku: 'AFT-BALM-02', 
    quantity: 30, 
    reorder_point: 15, 
    price: 12.00, 
    unit_cost: 12.00,
    unit_cost_30d_ago: 11.80,
    unit_cost_90d_ago: 11.50,
    unit_cost_1yr_avg: 11.65,
    lot_number: 'LOT-AFT-1102', 
    exp_date: '2026-09-01', 
    supplier: 'SkinCare Studio Pro', 
    lead_time_days: 3, 
    daily_burn: 1.5,
    order_history: [
      { date: '2026-07-10', po_number: 'PO-2026-078', qty: 25, unit_cost: 12.00, status: 'Delivered', lead_time_days: 3 },
      { date: '2026-06-01', po_number: 'PO-2026-055', qty: 30, unit_cost: 11.80, status: 'Delivered', lead_time_days: 3 },
      { date: '2026-04-10', po_number: 'PO-2026-030', qty: 25, unit_cost: 11.50, status: 'Delivered', lead_time_days: 3 }
    ]
  }
];

const procedureConsumptions = [
  { id: 1, client_name: 'Alex Rivera', artist_name: 'Marcus Vance', procedure_type: 'Tattoo Session', date: '2025-01-20', items: [{ id: 1, name: 'Sterile Tattoo Needles 3RL', qty: 3 }, { id: 2, name: 'Black Tattoo Ink 8oz', qty: 1 }], notes: 'Upper arm tattoo sleeve outline' },
  { id: 2, client_name: 'Samantha Chen', artist_name: 'Elena Rostova', procedure_type: 'Helix Piercing', date: '2025-01-22', items: [{ id: 3, name: 'Titanium Helix Barbell 16G', qty: 1 }, { id: 4, name: 'Nitrile Gloves Box (M)', qty: 1 }], notes: 'Right ear helix piercing' }
];

const inventoryCategories = [
  { id: 1, name: 'Needles', min_stock_level: 60, default_reorder_point: 50, description: 'Sterile tattooing & piercing needle cartridges' },
  { id: 2, name: 'Inks', min_stock_level: 20, default_reorder_point: 5, description: 'Tattoo inks, pigments & mixing solutions' },
  { id: 3, name: 'Aftercare', min_stock_level: 25, default_reorder_point: 15, description: 'Healing ointments, soaps & protective films' },
  { id: 4, name: 'Piercing', min_stock_level: 30, default_reorder_point: 20, description: 'Body jewelry, barbells, studs & calipers' },
  { id: 5, name: 'Supplies', min_stock_level: 20, default_reorder_point: 10, description: 'Gloves, barrier film, stencils & sanitizers' }
];

const financial = [
  { id: 1, client_id: 1, staff_id: 2, amount: 350.00, method: 'Card', type: 'payment', transaction_date: studioDay(new Date(Date.now() - 6 * 864e5)), status: 'completed', source: 'in-studio', client_name: 'Alex Rivera' },
  { id: 2, client_id: 2, staff_id: 3, amount: 65.00, method: 'Cash', type: 'payment', transaction_date: studioDay(new Date(Date.now() - 2 * 864e5)), status: 'completed', source: 'in-studio', client_name: 'Samantha Chen' }
];

const compliance = [
  { id: 1, staff_id: 2, type: 'Autoclave Sterilization Log', log_date: '2025-01-20', status: 'pass', details: { notes: 'Passed spore test cycle #1042' } },
  { id: 2, staff_id: 3, type: 'Sharps Disposal Verification', log_date: '2025-01-19', status: 'pass', details: { notes: 'Manifest #8821 signed by licensed carrier' } }
];

const documents = [
  { id: 1, type: 'Safety Data Sheet (SDS)', description: 'Black Ink Chemical Safety Sheet', file_path: 'sds_black_ink.pdf', uploaded_at: '2025-01-10' },
  { id: 2, type: 'Health Inspection Certificate', description: 'Annual Studio Permit 2025', file_path: 'health_cert_2025.pdf', uploaded_at: '2025-01-02' }
];

// REAL-TIME ACTIVITY LOGS ENDPOINTS
app.get('/api/activity-logs/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: 'connected', count: activityLogs.length })}\n\n`);
  sseClients.push(res);

  const cleanup = () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  };

  req.on('close', cleanup);
  req.on('end', cleanup);
  res.on('error', cleanup);
});

app.get('/api/activity-logs', async (req, res) => {
  const rows = await safeDbQuery(
    () => db.select().from(dbActivityLogs).orderBy(desc(dbActivityLogs.timestamp)).limit(100),
    []
  );
  const dbLogs = rows.map(r => ({
    id: r.id,
    timestamp: safeIsoDate(r.timestamp),
    category: r.category,
    action: r.action,
    title: r.title,
    details: r.details,
    user: r.user || 'Admin Manager',
    badgeColor: r.badgeColor || 'blue'
  }));

  // Combine DB logs and in-memory activityLogs avoiding duplicates by title/details or timestamp
  const combinedMap = new Map();
  [...dbLogs, ...activityLogs].forEach(item => {
    const key = item.id ? `id_${item.id}` : `${item.title}_${item.timestamp}`;
    if (!combinedMap.has(key)) {
      combinedMap.set(key, item);
    }
  });

  let result = Array.from(combinedMap.values());
  if (req.query.category && req.query.category !== 'all') {
    result = result.filter(a => a.category === req.query.category);
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.details.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      a.user.toLowerCase().includes(q)
    );
  }
  const limit = parseInt(req.query.limit || 50);
  res.json(result.slice(0, limit));
});

/**
 * Consent forms produced by the embedded Consultation Form Builder.
 *
 * Written to the studio's own SQLite file on the studio's own machine. Nothing
 * is sent to Poli International, which is what the banner in the form builder
 * tells the client, so this route must never gain a remote call.
 *
 * Stored in `documents` rather than a table of its own: a consent form is a
 * document attached to a client, and reusing the table means it appears in the
 * client's existing document list with no extra wiring.
 */
app.post('/api/clients/:id/consent-forms', async (req, res) => {
  const r = await saveConsentForm(Number(req.params.id), req.body || {});
  res.status(r.status).json(r.body);
});

// A form sent to a kiosk tablet gets the studio's own details (Settings, Studio details) in its empty
// studio fields: the tablet cannot read the studio settings. Same rule as studioFieldValue in the
// form builder's form-preview.js; the form showed sample "Poli International" details (Henry, 2026-10-18).
// the studio's own details from Settings, and an amount in the studio's currency
function studioProfile() {
  try { return JSON.parse(appData.poli_studio_profile || '{}') || {}; } catch (e) { return {}; }
}
const money = (n) => formatMoney(n, studioProfile().currency);

function fillStudioFields(schema, client) {
  let s = {};
  try { s = JSON.parse(appData.poli_studio_profile || '{}') || {}; } catch (e) {}
  const join = (...v) => v.filter(Boolean).join(' | ');
  // the practitioner: the artist of the client's appointment, the coming one first (it said "Senior Resident Artist")
  const mine = client ? appointments.filter((a) => Number(a.client_id) === client.id && (a.staff_name || a.artist_name)) : [];
  const when = (a) => String(a.datetime || a.date || '');
  const appt = mine.filter((a) => dayOf(when(a)) >= studioDay()).sort((a, b) => when(a).localeCompare(when(b)))[0]
    || mine.sort((a, b) => when(b).localeCompare(when(a)))[0];
  const artist = appt ? appt.staff_name || appt.artist_name : '';
  const valueFor = (f) => {
    const id = String(f.id || '').toLowerCase(), text = id + ' ' + String(f.label || '').toLowerCase();
    if (/^(practitioner|artist|piercer)_name$/.test(id)) return artist; // by exact id: "artistic_license" is not a name
    if (!/studio|practice|clinic/.test(text) || /artist|practitioner|piercer/.test(text)) return '';
    if (/name/.test(text)) return s.studioName || '';
    if (/permit|licen/.test(id)) return join(s.studioPermit, s.studioAddress);
    if (/address|contact|phone|location/.test(text)) return join(s.studioAddress, s.studioPhone, s.studioEmail, s.studioPermit);
    return '';
  };
  const copy = JSON.parse(JSON.stringify(schema));
  for (const sec of copy.sections || []) for (const f of (sec && sec.fields) || []) {
    // a form saved before 1.0.19 holds the sample studio: treated as empty (isSampleStudioValue in form-preview.js)
    const sample = /Poli International|104 Studio Plaza|100 Artisan Boulevard|poli-studio\.com|poliinternational\.com/i.test(String((f && f.value) || ''));
    if (f && f.type !== 'signature' && (!f.value || sample)) { const v = valueFor(f); if (v) f.value = v; }
  }
  return copy;
}

// A client under 18 signs only with a parent or guardian (src/consent-age.js).
const MINOR_NEEDS_GUARDIAN = 'This client is under 18: a parent or legal guardian must sign the form too. Choose a form with a parent or guardian signature, such as the Minor Consent template.';
const clientAge = (client) => ageOn(client && client.dob);

// Shared by the form builder's Save (from 'desk') and by the kiosk tablet (from 'kiosk'). Answers { status, body }.
async function saveConsentForm(clientId, { formName, formCategory, language, schema, responses }, from = 'desk') {
  if (!Number.isInteger(clientId) || clientId <= 0) {
    return { status: 400, body: { error: 'A valid client id is required.' } };
  }
  if (!schema || typeof schema !== 'object') {
    return { status: 400, body: { error: 'A form schema is required.' } };
  }

  // the client's age: from their record, or from the birth date they wrote on this form
  const client = clients.find((c) => c.id === clientId);
  const formDob = dobFromResponses(responses);
  const age = ageOn((client && client.dob) || formDob);
  const withoutGuardian = age !== null && age < GUARDIAN_AGE && !isGuardianForm(schema);
  // at the desk the form is not saved, so another can be chosen; a form signed on the tablet is kept
  // (it is never lost) and marked, and the studio is told
  if (withoutGuardian && from === 'desk') return { status: 409, body: { error: MINOR_NEEDS_GUARDIAN } };

  const record = {
    entityType: 'client',
    entityId: clientId,
    type: 'consent_form',
    description: String(formName || 'Consent form').slice(0, 300),
    fileName: null,
    fileType: 'application/json',
    // the age and the ID check as they were when the form was signed
    content: JSON.stringify({ formCategory: formCategory || null, language: language || 'en', schema, responses: responses || {},
      ageAtSigning: age, idCheck: (client && client.id_check) || null, minorWithoutGuardian: withoutGuardian || undefined }),
  };

  const saved = await safeDbQuery(
    () => db.insert(dbDocuments).values(record).returning(),
    null
  );

  if (!saved) {
    // safeDbQuery returns the fallback when no database is configured. Say so
    // rather than reporting a save that did not happen.
    return { status: 503, body: { error: 'No database configured, the consent form was not stored.' } };
  }

  const newId = Array.isArray(saved) ? saved[0]?.id : undefined;
  const docId = newId ? docIdFor(newId, saved[0].uploadedAt) : undefined;
  // the scanned pages at full size, also as files on this computer (src/scan-files.js)
  if (docId) saveScanFiles(path.join(STORAGE_DIR, 'scans'), { docId, clientName: client && client.name, schema, responses });

  mergeMedicalAnswers(clientId, responses || {});
  if (client && !client.dob && formDob) { client.dob = formDob; scheduleStateSave(); } // the record learns the birth date
  if (withoutGuardian) {
    logActivity({ category: 'compliance', action: 'MINOR_WITHOUT_GUARDIAN', title: `Under 18 without a guardian signature: ${client ? client.name : 'client ' + clientId}`,
      details: `${record.description} was signed on the kiosk by a client aged ${age}, on a form with no parent or guardian signature. Have a parent or guardian sign a Minor Consent form before the procedure.`,
      user: 'Studio CRM', badgeColor: 'red' });
  }
  return { status: 201, body: { ok: true, id: newId, docId, minorWithoutGuardian: withoutGuardian || undefined } };
}

// The desk saw the client's ID: the type and at most its last 4 characters, never the whole number or a photo.
const ID_TYPES = ['Passport', 'Driving licence', 'National ID card', 'Other ID'];
app.post('/api/clients/:id/id-check', (req, res) => {
  const client = clients.find((c) => c.id === Number(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  const b = req.body || {};
  const type = ID_TYPES.includes(b.type) ? b.type : null;
  const last4 = String(b.last4 || '').trim();
  if (!type) return res.status(400).json({ error: 'Choose the type of ID' });
  if (!/^[A-Za-z0-9]{1,4}$/.test(last4)) return res.status(400).json({ error: 'Enter only the last 4 letters or digits of the ID, not the whole number' });
  const dob = String(b.dob || '').trim();
  if (dob && ageOn(dob) === null) return res.status(400).json({ error: 'The date of birth is not a valid date' });
  if (dob) client.dob = dob; // the birth date read from the ID
  client.id_check = { type, last4: last4.toUpperCase(), checked_by: String(b.checked_by || '').slice(0, 80) || 'Front desk', checked_at: new Date().toISOString() };
  logActivity({ category: 'compliance', action: 'CLIENT_ID_CHECKED', title: `ID checked: ${client.name}`,
    details: `${type} ending ${client.id_check.last4}` + (dob ? `, born ${dob}` : ''), user: client.id_check.checked_by, badgeColor: 'emerald' });
  res.json({ ok: true, id_check: client.id_check, dob: client.dob || '', age: clientAge(client) });
});

// The form builder's Scanner field (Henry, 2026-10-18): the scanner is on the CRM computer (src/scanner.js).
// A kiosk tablet may scan too: it only gets the image back, for the form it is filling in.
let scanning = false; // one scan at a time: a scanner does one run at once
app.get('/api/scanner/devices', async (req, res) => {
  try { res.json(await listScanners()); } catch (e) { res.json([]); }
});
app.post('/api/scanner/scan', async (req, res) => {
  if (scanning) return res.status(409).json({ error: 'The scanner is busy with another scan. Try again in a moment.' });
  scanning = true;
  try {
    res.json({ ok: true, dataUrls: await scanPages((req.body || {}).device) });
  } catch (e) {
    res.status(e.status || (e.timedOut ? 504 : 500)).json({ error: e.status ? e.message : e.timedOut ? 'The scanner did not answer within two minutes.' : 'The scan did not work: ' + e.message });
  } finally {
    scanning = false;
  }
});

function mergeMedicalAnswers(clientId, responses) {
  const client = clients.find((c) => c.id === clientId);
  if (client && mergeMedicalInto(client, responses)) scheduleStateSave();
}

/**
 * Kiosk tablets (Henry, 2026-10-15): a tablet on a stand opens /kiosk, signs in with the kiosk
 * password and waits. Front desk sends it a form for a client; the client signs; the form is
 * saved to that client's record and the tablet waits again.
 *
 * Each tablet names itself, so a studio can have several. One form waits per tablet.
 * The waiting forms are saved with the rest of the studio's state, so a restart keeps them.
 */
const kioskQueue = new Map();   // kiosk name -> { id, clientId, clientName, formName, formCategory, language, schema, sentAt, sentBy }
const kioskSeen = new Map();    // kiosk name -> last time it asked for a form
let nextKioskItemId = 1;
const kioskName = (v) => String(v || '').trim().slice(0, 40) || 'Kiosk';
// A tablet signed in with the kiosk password is held to the name it signed in with, whatever name the request
// gives, so it never sees the client waiting on another tablet. Staff (the desk) may name any tablet.
const kioskOf = (req, asked) => {
  const s = req.kioskSession;
  if (!s) return kioskName(asked);
  if (!s.kiosk) s.kiosk = kioskName(asked);
  return s.kiosk;
};

// The addresses a tablet can open: Settings shows these, not the address of the PC Settings was opened on
// (on the server itself that is localhost, which a tablet cannot reach).
let httpsPortUp = 0;
app.get('/api/kiosk/addresses', (req, res) => {
  const ip = studioAddress();
  if (!ip) return res.json({ https: [], http: [] });
  res.json({ https: httpsPortUp ? [`https://${ip}:${httpsPortUp}/kiosk`] : [], http: [`http://${ip}:${PORT}/kiosk`] });
});

// The tablet asks every few seconds: "is there a form for me?"
app.get('/api/kiosk/next', (req, res) => {
  const name = kioskOf(req, req.query.kiosk);
  kioskSeen.set(name, Date.now());
  const item = kioskQueue.get(name);
  res.set('Cache-Control', 'no-store').json({ kiosk: name, version: APP_VERSION, item: item ? { id: item.id, clientName: item.clientName, formName: item.formName, language: item.language, schema: item.schema } : null });
});

// The tablets seen in the last two minutes, and what waits on each: for the desk's "Send to kiosk".
app.get('/api/kiosk/devices', (req, res) => {
  const recent = Date.now() - 120000;
  const names = new Set([...kioskSeen].filter(([, t]) => t > recent).map(([n]) => n));
  for (const n of kioskQueue.keys()) names.add(n);
  res.json([...names].sort().map((n) => {
    const item = kioskQueue.get(n);
    return { kiosk: n, online: (kioskSeen.get(n) || 0) > recent, waiting: item ? { id: item.id, clientName: item.clientName, formName: item.formName, sentAt: item.sentAt } : null };
  }));
});

app.post('/api/kiosk/send', (req, res) => {
  const b = req.body || {};
  const clientId = Number(b.clientId);
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(400).json({ error: 'Choose the client first: the signed form is saved to their record.' });
  if (!b.schema || typeof b.schema !== 'object') return res.status(400).json({ error: 'Choose a form first.' });
  const age = clientAge(client);
  if (age !== null && age < GUARDIAN_AGE && !isGuardianForm(b.schema)) return res.status(409).json({ error: MINOR_NEEDS_GUARDIAN });
  b.schema = fillStudioFields(b.schema, client);
  const name = kioskName(b.kiosk);
  const item = { id: nextKioskItemId++, clientId, clientName: client.name, formName: String(b.formName || 'Consent form').slice(0, 300),
    formCategory: b.formCategory || null, language: String(b.language || 'en').slice(0, 5), schema: b.schema, sentAt: new Date().toISOString(), sentBy: b.sentBy || '' };
  const replaced = kioskQueue.get(name);
  kioskQueue.set(name, item);
  logActivity({ category: 'compliance', action: 'KIOSK_FORM_SENT', title: `Form sent to the kiosk: ${client.name}`,
    details: `${item.formName} sent to ${name}` + (replaced ? ` (replaced the form waiting for ${replaced.clientName})` : ''), user: item.sentBy || 'Front desk', badgeColor: 'indigo' });
  res.status(201).json({ ok: true, kiosk: name, id: item.id, replaced: replaced ? replaced.clientName : null });
});

// The desk takes a form back (wrong client, client left): the tablet returns to waiting.
app.post('/api/kiosk/cancel', (req, res) => {
  const name = kioskName((req.body || {}).kiosk);
  const had = kioskQueue.get(name);
  kioskQueue.delete(name);
  res.json({ ok: true, removed: had ? had.clientName : null });
});

// The client tapped Complete on the tablet: save to the client's record, tell the studio.
// The form the desk sent stays the record; only the medical questions the tablet showed (a medical section is
// an empty marker until the form builder fills it) are taken from the tablet, so every answer has its question.
function withTabletMedicalQuestions(sent, fromTablet) {
  if (!sent || !Array.isArray(sent.sections) || !fromTablet || !Array.isArray(fromTablet.sections)) return sent;
  const copy = JSON.parse(JSON.stringify(sent));
  for (const sec of copy.sections) {
    if (sec.type !== 'medical_section' || (sec.fields && sec.fields.length)) continue;
    const t = fromTablet.sections.find((s) => s && s.id === sec.id && s.type === 'medical_section');
    if (t && Array.isArray(t.fields)) sec.fields = t.fields.filter((f) => f && typeof f.id === 'string').slice(0, 50);
  }
  return copy;
}

app.post('/api/kiosk/submit', async (req, res) => {
  const b = req.body || {};
  const name = kioskOf(req, b.kiosk);
  const item = kioskQueue.get(name);
  if (!item || item.id !== Number(b.id)) return res.status(409).json({ error: 'This form was taken back by the studio. Please ask a member of staff.' });
  const r = await saveConsentForm(item.clientId, { formName: item.formName, formCategory: item.formCategory, language: b.language || item.language, schema: withTabletMedicalQuestions(item.schema, b.schema), responses: b.responses || {} }, 'kiosk');
  if (r.status >= 400) return res.status(r.status).json(r.body);
  kioskQueue.delete(name);
  logActivity({ category: 'compliance', action: 'KIOSK_FORM_SIGNED', title: `Form completed on the kiosk: ${item.clientName}`,
    details: `${item.formName}, completed on ${name}. Check it in the client's record.`, user: item.clientName, badgeColor: 'emerald' });
  res.status(201).json({ ok: true, id: r.body.id });
});

app.post('/api/activity-logs', (req, res) => {
  // Support bulk insertion if body is an array or contains logs array
  const items = Array.isArray(req.body) ? req.body : (Array.isArray(req.body?.logs) ? req.body.logs : null);
  if (items) {
    const createdEntries = [];
    const conflicts = [];

    for (const item of items) {
      if (!item || !item.title) continue;

      // Conflict detection for items with offline timestamp or explicit conflict flag
      if (item.id || item.clientTimestamp) {
        const existing = activityLogs.find(a => 
          (item.id && (String(a.id) === String(item.id) || a.id === item.id)) ||
          (a.title === item.title && Math.abs(new Date(a.timestamp).getTime() - new Date(item.timestamp || item.clientTimestamp || Date.now()).getTime()) < 5000)
        );
        if (existing && existing.details !== item.details && !item.forceOverwrite) {
          conflicts.push({ localEntry: item, serverEntry: existing });
          continue;
        }
      }

      const entry = logActivity({
        category: item.category || 'general',
        action: item.action || 'OFFLINE_SYNC',
        title: item.title,
        details: item.details || '',
        user: item.user || 'Studio Manager',
        badgeColor: item.badgeColor || 'amber'
      });
      createdEntries.push(entry);
    }

    if (conflicts.length > 0 && createdEntries.length === 0) {
      return res.status(409).json({
        success: false,
        conflict: true,
        code: 'VERSION_CONFLICT',
        conflicts,
        message: 'Collision detected: pending log entry was modified on the server while offline'
      });
    }

    return res.status(201).json({ success: true, count: createdEntries.length, entries: createdEntries, conflicts });
  }

  const { category, action, title, details, user, badgeColor, clientTimestamp, forceOverwrite } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  // Conflict check for single post if checkConflict header or flag is present
  if (req.body.checkConflict || req.headers['x-check-conflict']) {
    const existing = activityLogs.find(a => a.title === title && a.category === category);
    if (existing && existing.details !== details && !forceOverwrite) {
      return res.status(409).json({
        success: false,
        conflict: true,
        code: 'VERSION_CONFLICT',
        localEntry: req.body,
        serverEntry: existing,
        message: 'Conflict detected: activity log entry on server has diverged'
      });
    }
  }

  const entry = logActivity({
    category: category || 'general',
    action: action || 'MANUAL_LOG',
    title,
    details: details || '',
    user: user || 'Studio Manager',
    badgeColor: badgeColor || 'blue'
  });
  res.status(201).json(entry);
});

app.delete('/api/activity-logs/:id', (req, res) => {
  const logId = parseInt(req.params.id);
  const index = activityLogs.findIndex(a => a.id === logId);
  if (index === -1) {
    return res.status(404).json({ error: 'Activity log entry not found' });
  }
  const removed = activityLogs.splice(index, 1)[0];

  // Broadcast deletion event via SSE so all connected clients update instantly
  const payload = `data: ${JSON.stringify({ type: 'deleted', id: logId })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(payload);
    } catch (e) {
      sseClients.splice(i, 1);
    }
  }
  broadcastSseDelta('delete', { id: logId });

  res.json({ success: true, removed });
});

app.get('/api/clients', (req, res) => {
  const q = (req.query.q || req.query.search || '').toString().toLowerCase().trim();
  const latexFilter = (req.query.latex_allergy || req.query.has_latex_allergy || req.query.latex || '').toString().toLowerCase().trim();
  const medicalFilter = (req.query.medical_flag || req.query.has_medical_flags || req.query.medical_history || '').toString().toLowerCase().trim();

  const wantArchived = ['1', 'true'].includes((req.query.archived || '').toString());
  let enriched = clients.filter(c => !!c.archived === wantArchived).map(c => {
    if (c.assigned_staff_id && !c.assigned_staff_name) {
      const st = staff.find(s => s.id === parseInt(c.assigned_staff_id));
      if (st) c.assigned_staff_name = st.name;
    }
    return { ...c, age: clientAge(c) };
  });

  if (q) {
    enriched = enriched.filter(c => 
      (c.name && c.name.toLowerCase().includes(q)) || 
      (c.email && c.email.toLowerCase().includes(q)) || 
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.allergies && c.allergies.toLowerCase().includes(q)) ||
      (c.medical_history && c.medical_history.toLowerCase().includes(q))
    );
  }

  if (latexFilter === 'true' || latexFilter === 'yes' || latexFilter === '1' || latexFilter === 'latex') {
    enriched = enriched.filter(c => {
      const alg = (c.allergies || '').toLowerCase();
      const med = (c.medical_history || '').toLowerCase();
      return alg.includes('latex') || med.includes('latex');
    });
  }

  if (medicalFilter === 'true' || medicalFilter === 'yes' || medicalFilter === '1' || medicalFilter === 'has_flags') {
    enriched = enriched.filter(c => {
      const med = (c.medical_history || '').trim().toLowerCase();
      const alg = (c.allergies || '').trim().toLowerCase();
      return (med && med !== 'none' && med !== 'n/a') || (alg && alg !== 'none' && alg !== 'n/a');
    });
  }

  res.json(enriched);
});

app.post('/api/clients', (req, res) => {
  let assignedName = req.body.assigned_staff_name || '';
  let assignedId = req.body.assigned_staff_id !== undefined && req.body.assigned_staff_id !== null && req.body.assigned_staff_id !== ''
    ? parseInt(req.body.assigned_staff_id)
    : null;

  if (assignedId) {
    const st = staff.find(s => s.id === assignedId);
    if (st) assignedName = st.name;
  }
  const newClient = {
    id: clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1,
    ...req.body,
    assigned_staff_id: assignedId,
    assigned_staff_name: assignedName,
    created_at: new Date().toISOString()
  };
  delete newClient.archived;
  delete newClient.archived_at;
  clients.push(newClient);

  logActivity({
    category: 'client',
    action: 'CREATED',
    title: `New Client: ${newClient.name}`,
    details: `Client profile created with email ${newClient.email || 'N/A'}${assignedName ? ` — Assigned to ${assignedName}` : ''}`,
    user: 'Admin Manager',
    badgeColor: 'purple'
  });

  res.status(201).json(newClient);
});

app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const assignedStaff = staff.find(s => s.id === parseInt(client.assigned_staff_id));
  res.json({
    ...client,
    assigned_staff: assignedStaff || null
  });
});

app.patch('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const { archived: _a, archived_at: _at, ...edits } = req.body || {};
  Object.assign(client, edits);

  if (client.assigned_staff_id !== undefined && client.assigned_staff_id !== null && client.assigned_staff_id !== '') {
    client.assigned_staff_id = parseInt(client.assigned_staff_id);
    const st = staff.find(s => s.id === client.assigned_staff_id);
    client.assigned_staff_name = st ? st.name : 'Unassigned';
  } else if (client.assigned_staff_id === null || client.assigned_staff_id === '') {
    client.assigned_staff_id = null;
    client.assigned_staff_name = 'Unassigned';
  }

  logActivity({
    category: 'client',
    action: 'UPDATED',
    title: `Client Profile Updated: ${client.name}`,
    details: `Updated info for ${client.name}${client.assigned_staff_name ? ` (Assigned to ${client.assigned_staff_name})` : ''}`,
    user: 'Admin Manager',
    badgeColor: 'purple'
  });

  res.json(client);
});

// A client is never deleted: archived = hidden from the lists, everything else kept.
app.delete('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  if (!client.archived) {
    client.archived = true;
    client.archived_at = new Date().toISOString();
    logActivity({
      category: 'client',
      action: 'ARCHIVED',
      title: `Client Archived: ${client.name}`,
      details: `Client #${client.id} (${client.name}) archived. Their appointments, payments and signed forms are kept.`,
      user: 'Admin Manager',
      badgeColor: 'red'
    });
  }
  res.json({ success: true, client });
});

app.post('/api/clients/:id/restore', (req, res) => {
  const client = clients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  delete client.archived;
  delete client.archived_at;
  logActivity({
    category: 'client',
    action: 'RESTORED',
    title: `Client Restored: ${client.name}`,
    details: `Client #${client.id} (${client.name}) restored to the client list.`,
    user: 'Admin Manager',
    badgeColor: 'purple'
  });
  res.json({ success: true, client });
});

// The client's Scans tab (Henry, 2026-11-01): every page scanned with a Scanner field on the client's saved forms,
// newest form first. Only the details: each picture is fetched from its url at full size.
function clientScans(clientId) {
  const name = (clients.find((c) => c.id === clientId) || {}).name;
  try {
    return sqlite.prepare("SELECT id, description, content, uploaded_at FROM documents WHERE entity_type = 'client' AND entity_id = ? AND type = 'consent_form' ORDER BY id DESC").all(clientId)
      .flatMap((row) => {
        let content = {};
        try { content = JSON.parse(row.content) || {}; } catch (e) {}
        const docId = docIdFor(row.id, row.uploaded_at);
        return scanPagesOf(content.schema, content.responses).map((p, n) => ({
          form_id: row.id, form_name: row.description, saved_at: row.uploaded_at, doc_id: docId, label: p.label, page: p.page,
          url: `/api/consent-forms/${row.id}/scans/${n}`, file_name: scanFileName(String(row.uploaded_at || '').replace(' ', 'T') + 'Z', name, docId, p) }));
      });
  } catch (e) { return []; }
}

// One scanned page of a saved form, as the picture itself
app.get('/api/consent-forms/:id/scans/:n', (req, res) => {
  let row;
  try { row = sqlite.prepare("SELECT content FROM documents WHERE id = ? AND type = 'consent_form'").get(Number(req.params.id)); } catch (e) {}
  let content = {};
  try { content = JSON.parse((row && row.content) || '{}') || {}; } catch (e) {}
  const p = scanPagesOf(content.schema, content.responses)[Number(req.params.n)];
  if (!p) return res.status(404).json({ error: 'Scan not found' });
  res.set('Cache-Control', 'private, no-store').type(p.mime).send(Buffer.from(p.base64, 'base64'));
});

// Consent forms saved from the form builder, newest first (answers are fetched one at a time).
function clientConsentForms(clientId) {
  try {
    return sqlite.prepare("SELECT id, description, content, uploaded_at FROM documents WHERE entity_type = 'client' AND entity_id = ? AND type = 'consent_form' ORDER BY id DESC").all(clientId)
      .map((row) => {
        let content = {};
        try { content = JSON.parse(row.content) || {}; } catch (e) {}
        const responses = content.responses || {};
        return { id: row.id, name: row.description, saved_at: row.uploaded_at,
          signed: Object.values(responses).some((v) => typeof v === 'string' && v.startsWith('data:image')),
          minor_without_guardian: !!content.minorWithoutGuardian };
      });
  } catch (e) { return []; }
}

// Every saved consent form, for counts: the client list showed "0 signed" after a form was
// signed on the tablet, because it counted the separate waivers only.
app.get('/api/consent-forms', (req, res) => {
  let rows = [];
  try { rows = sqlite.prepare("SELECT id, entity_id, content FROM documents WHERE entity_type = 'client' AND type = 'consent_form'").all(); } catch (e) {}
  res.json(rows.map((row) => {
    let responses = {};
    try { responses = JSON.parse(row.content).responses || {}; } catch (e) {}
    return { id: row.id, client_id: row.entity_id, signed: Object.values(responses).some((v) => typeof v === 'string' && v.startsWith('data:image')) };
  }));
});

app.get('/api/consent-forms/:id', (req, res) => {
  let row;
  try { row = sqlite.prepare("SELECT id, entity_id, description, content, uploaded_at FROM documents WHERE id = ? AND type = 'consent_form'").get(Number(req.params.id)); } catch (e) {}
  if (!row) return res.status(404).json({ error: 'Consent form not found' });
  let content = {};
  try { content = JSON.parse(row.content); } catch (e) {}
  res.json({ id: row.id, docId: docIdFor(row.id, row.uploaded_at), client_id: row.entity_id, name: row.description, saved_at: row.uploaded_at, ...content });
});

app.get('/api/clients/:id/profile', (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const clientObj = clients.find(c => c.id === clientId);
  if (!clientObj) {
    return res.status(404).json({ error: 'Client not found' });
  }

  // By id, or by the exact name on records that carry no id. A name that merely
  // contains this one belongs to somebody else.
  const clientNameLower = (clientObj.name || '').trim().toLowerCase();
  const sameName = (v) => !!clientNameLower && String(v || '').trim().toLowerCase() === clientNameLower;
  const mine = (r, nameField) => (r.client_id ? parseInt(r.client_id, 10) === clientId : sameName(r[nameField]));

  const clientApps = appointments.filter(a => mine(a, 'client') || (!a.client_id && sameName(a.client_name)));
  const clientWaivers = waivers.filter(w => mine(w, 'client_name'));
  const clientWork = clientTattooWork.filter(w => mine(w, 'client_name'));
  const totalSpend = financial.filter(f => mine(f, 'client_name') && f.type !== 'refund').reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const assignedStaff = staff.find(s => s.id === parseInt(clientObj.assigned_staff_id, 10));

  res.json({
    client: {
      ...clientObj,
      age: clientAge(clientObj),
      assigned_staff: assignedStaff || null
    },
    staff_notes: (clientObj.staff_notes || []).slice().sort((a,b) => new Date(b.timestamp || b.createdAt || 0).getTime() - new Date(a.timestamp || a.createdAt || 0).getTime()),
    appointments: clientApps,
    waivers: clientWaivers,
    consent_forms: clientConsentForms(clientId),
    scans: clientScans(clientId),
    tattoo_work: clientWork,
    stats: {
      totalAppointments: clientApps.length,
      signedWaiversCount: clientWaivers.length,
      totalTattooWorkCount: clientWork.length,
      totalSpend: totalSpend,
      lastVisit: clientObj.lastVisit || (clientApps[0] ? clientApps[0].date : '')
    }
  });
});

app.post('/api/clients/:id/photo', (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const clientObj = clients.find(c => c.id === clientId);
  if (!clientObj) return res.status(404).json({ error: 'Client not found' });

  const photoUrl = req.body.photo_url || req.body.data_url || req.body.photo;
  if (!isPhotoData(photoUrl)) return res.status(400).json({ error: 'Photo data URL required' });

  clientObj.photo = photoUrl;
  clientObj.avatar = photoUrl;
  clientObj.avatar_url = photoUrl;

  logActivity({
    category: 'client',
    action: 'PROFILE_PHOTO_CAPTURED',
    title: `Captured Camera Profile Photo for ${clientObj.name}`,
    details: 'Client avatar updated using live device camera snapshot.',
    user: req.body.artist || 'Studio Staff',
    badgeColor: 'sky'
  });

  res.json({ success: true, client: clientObj, photo_url: photoUrl });
});

// A photo, from its file in storage/photos (src/photo-files.js). The name says what is in the file, so a
// browser may keep it for good.
app.get('/api/photos/:name', (req, res) => {
  if (!PHOTO_NAME.test(req.params.name)) return res.status(404).end();
  res.sendFile(req.params.name, { root: PHOTO_DIR, immutable: true, maxAge: '1y', headers: { 'Cache-Control': 'private, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } },
    (e) => { if (e && !res.headersSent) res.status(404).end(); });
});

app.post('/api/clients/:id/tattoo-work', (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const clientObj = clients.find(c => c.id === clientId);
  if (!clientObj) return res.status(404).json({ error: 'Client not found' });
  // the photo itself (taken or chosen on the device, as a data URL): there was a stock photo when none came
  if (!req.body.image_url) return res.status(400).json({ error: 'Take or choose a photo first' });

  const newWork = {
    id: clientTattooWork.reduce((m, w) => Math.max(m, Number(w.id) || 0), 0) + 1, // length + 1 repeated an id after a delete
    client_id: clientId,
    client_name: clientObj.name,
    title: req.body.title || 'New Tattoo Session Work',
    category: req.body.category || 'Tattoo Session',
    date: req.body.date || studioDay(),
    artist: req.body.artist || clientObj.assigned_staff_name || '', // it named a sample artist
    image_url: req.body.image_url,
    notes: req.body.notes || '',
    description: req.body.description || '',
    tags: Array.isArray(req.body.tags) ? req.body.tags : []
  };

  clientTattooWork.unshift(newWork);

  logActivity({
    category: 'client',
    action: 'TATTOO_WORK_UPLOADED',
    title: `Tattoo Work Uploaded for ${clientObj.name}`,
    details: `${newWork.title} (${newWork.category})`,
    user: newWork.artist,
    badgeColor: 'indigo'
  });

  const updatedWorkList = clientTattooWork.filter(w => w.client_id === clientId);
  res.status(201).json({ success: true, work: newWork, tattoo_work: updatedWorkList });
});

// Delete in Work & Photos called this and found nothing here
app.delete('/api/clients/:id/tattoo-work/:workId', (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const i = clientTattooWork.findIndex((w) => w.client_id === clientId && Number(w.id) === Number(req.params.workId));
  if (i < 0) return res.status(404).json({ error: 'Photo not found' });
  clientTattooWork.splice(i, 1);
  res.json({ success: true, tattoo_work: clientTattooWork.filter((w) => w.client_id === clientId) });
});

// Appointments & Calendar API
app.get('/api/appointments', (req, res) => {
  const enriched = appointments.map(a => {
    let sName = a.staff_name;
    if (a.staff_id) {
      const st = staff.find(s => s.id === parseInt(a.staff_id));
      if (st) sName = st.name;
    }
    let cName = a.client_name;
    if (a.client_id) {
      const cl = clients.find(c => c.id === parseInt(a.client_id));
      if (cl) cName = cl.name;
    }
    return {
      ...a,
      staff_name: sName || 'Unassigned Professional',
      client_name: cName || 'Guest Client'
    };
  });
  res.json(enriched);
});

// Automated Appointment Slot Proposal Endpoint based on Shift Roster & Availability
app.post('/api/appointments/propose-slots', (req, res) => {
  const { staff_id, date, duration_minutes = 60, service_type = 'Custom Tattoo Session' } = req.body;
  const targetDate = date || studioDay();

  const results = [];
  const targetStaffList = (staff_id && staff_id !== 'all')
    ? staff.filter(s => s.id === parseInt(staff_id))
    : staff;

  targetStaffList.forEach(artist => {
    const artistShift = monthlySchedules.find(s => s.staff_id === artist.id && s.date === targetDate);
    const shiftStart = artistShift ? artistShift.start_time || '10:00' : '10:00';
    const shiftEnd = artistShift ? artistShift.end_time || '19:00' : '19:00';
    const station = artistShift ? artistShift.station || 'Station #1' : 'Station #1';

    const startHour = parseInt(shiftStart.split(':')[0]) || 10;
    const endHour = parseInt(shiftEnd.split(':')[0]) || 19;

    const existingApps = appointments.filter(a => {
      if (Number(a.staff_id) !== Number(artist.id)) return false;
      const appDate = dayOf(a.datetime);
      return appDate === targetDate && a.status !== 'cancelled';
    });

    const proposedSlots = [];
    const durMins = parseInt(duration_minutes) || 60;

    for (let h = startHour; h <= endHour - (durMins / 60); h += 1.5) {
      const hourInt = Math.floor(h);
      const minInt = (h % 1 === 0) ? '00' : '30';
      const timeStr = `${hourInt < 10 ? '0' + hourInt : hourInt}:${minInt}`;
      const slotStartIso = `${targetDate}T${timeStr}:00`;
      const slotStartMs = new Date(slotStartIso).getTime();
      const slotEndMs = slotStartMs + (durMins * 60000);

      const hasConflict = existingApps.some(a => {
        const aStart = new Date(a.datetime).getTime();
        const aEnd = aStart + ((a.duration_minutes || 60) * 60000);
        return (slotStartMs < aEnd && slotEndMs > aStart);
      });

      if (!hasConflict) {
        const isPeak = (hourInt >= 13 && hourInt <= 16);
        proposedSlots.push({
          time: timeStr,
          datetime: slotStartIso,
          displayTime: new Date(slotStartIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration_minutes: durMins,
          station: station,
          shift_window: `${shiftStart} - ${shiftEnd}`,
          match_score: isPeak ? 98 : 92,
          notes: isPeak ? '⭐ Optimal Studio Lighting & Station Availability' : '✅ Open Shift Slot'
        });
      }
    }

    results.push({
      staff_id: artist.id,
      staff_name: artist.name,
      specialty: artist.specialty || artist.title || 'Artist',
      avatar: artist.avatar || '🎨',
      shift_assigned: Boolean(artistShift),
      shift_details: artistShift ? `${artistShift.start_time} - ${artistShift.end_time} (${artistShift.station})` : 'Standard Studio Schedule (10:00 - 19:00)',
      available_slots: proposedSlots
    });
  });

  res.json({
    date: targetDate,
    duration_minutes,
    service_type,
    artists: results
  });
});

// The answer when a booking is in the way of another: the screen asks, and sends the booking again with force: true.
const clashAnswer = (clash) => ({ error: clash.same === 'artist' ? 'That artist already has an appointment at that time' : 'That station is already booked at that time', conflict: clash });

app.post('/api/appointments', (req, res) => {
  const when = toTimestamp(req.body.datetime);
  if (!when) return res.status(400).json({ error: 'Choose a date and time for the appointment' });
  const status = req.body.status || 'scheduled';
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'The status must be one of: ' + STATUSES.join(', ') });
  let cName = req.body.client_name || '';
  if (req.body.client_id) {
    const client = clients.find(c => c.id === parseInt(req.body.client_id));
    if (client) cName = client.name;
  }
  if (!cName) cName = 'Guest Client';

  let sName = req.body.staff_name || '';
  if (req.body.staff_id) {
    const st = staff.find(s => s.id === parseInt(req.body.staff_id));
    if (st) sName = st.name;
  }
  if (!sName) sName = 'Unassigned Professional';

  const newApp = {
    id: appointments.length ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
    client_id: req.body.client_id ? parseInt(req.body.client_id) : null,
    staff_id: req.body.staff_id ? parseInt(req.body.staff_id) : null,
    service_type: req.body.service_type || 'Tattoo / Piercing Session',
    datetime: when,
    duration_minutes: parseInt(req.body.duration_minutes || 60),
    status,
    notes: req.body.notes || '',
    client_name: cName,
    staff_name: sName,
    station: req.body.station || '',
    estimated_price: Number(req.body.estimated_price) || 0,
    deposit_paid: Number(req.body.deposit_paid) || 0
  };
  const clash = findClash(newApp, appointments);
  if (clash && req.body.force !== true) return res.status(409).json(clashAnswer(clash));
  appointments.push(newApp);

  const appDate = new Date(newApp.datetime);
  const appDateStr = !isNaN(appDate.getTime()) ? appDate.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : (newApp.datetime || 'Scheduled Time');
  logActivity({
    category: 'appointment',
    action: 'BOOKED',
    title: `Appointment Booked: ${cName}`,
    details: `${newApp.service_type} scheduled for ${appDateStr} w/ ${sName}`,
    user: sName !== 'Unassigned Professional' ? sName : 'Admin Manager',
    badgeColor: 'blue'
  });

  res.status(201).json(newApp);
});

// Change a booked appointment (time, artist, deposit, notes...) from the Calendar's Edit button.
app.patch('/api/appointments/:id', (req, res) => {
  const appt = appointments.find((a) => a.id === parseInt(req.params.id, 10));
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  const b = req.body || {};
  if (b.datetime !== undefined && !toTimestamp(b.datetime)) return res.status(400).json({ error: 'The date and time are not a valid date' });
  const next = { ...appt };   // changed on a copy: a clash saves nothing
  if (b.client_id) {
    const client = clients.find((c) => c.id === parseInt(b.client_id, 10));
    if (client) { next.client_id = client.id; next.client_name = client.name; }
  } else if (b.client_name) { next.client_id = null; next.client_name = String(b.client_name); }
  if (b.staff_id || b.staff_name) {
    const st = staff.find((s) => (b.staff_id && s.id === parseInt(b.staff_id, 10)) || s.name === b.staff_name);
    next.staff_id = st ? st.id : next.staff_id;
    next.staff_name = st ? st.name : String(b.staff_name || next.staff_name);
  }
  for (const f of ['service_type', 'station', 'notes']) if (b[f] !== undefined) next[f] = String(b[f]);
  if (b.datetime !== undefined) next.datetime = toTimestamp(b.datetime);
  for (const f of ['duration_minutes', 'estimated_price', 'deposit_paid']) if (b[f] !== undefined && !isNaN(Number(b[f]))) next[f] = Number(b[f]);
  const moved = ['datetime', 'duration_minutes', 'staff_id', 'staff_name', 'station'].some((f) => b[f] !== undefined);
  const clash = moved && findClash(next, appointments);
  if (clash && b.force !== true) return res.status(409).json(clashAnswer(clash));
  Object.assign(appt, next);
  logActivity({ category: 'appointment', action: 'UPDATED', title: `Appointment Changed: ${appt.client_name}`,
    details: `${appt.service_type} on ${appt.datetime}`, user: 'Admin Manager', badgeColor: 'blue' });
  res.json(appt);
});

app.delete('/api/appointments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = appointments.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });
  const removedApp = appointments.splice(idx, 1)[0];

  logActivity({
    category: 'appointment',
    action: 'CANCELLED',
    title: `Appointment Removed`,
    details: `Cancelled ${removedApp.service_type} for ${removedApp.client_name}`,
    user: 'Admin Manager',
    badgeColor: 'red'
  });

  res.json({ success: true });
});

app.patch('/api/appointments/:id/status', (req, res) => {
  const targetApp = appointments.find(a => a.id === parseInt(req.params.id));
  if (!targetApp) return res.status(404).json({ error: 'Appointment not found' });
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'The status must be one of: ' + STATUSES.join(', ') });
  targetApp.status = req.body.status;
  logActivity({
    category: 'appointment',
    action: 'STATUS_CHANGE',
    title: `Appointment Status Changed: ${targetApp.client_name || 'Client'}`,
    details: `Status set to "${targetApp.status}" for ${targetApp.service_type} w/ ${targetApp.staff_name}`,
    user: targetApp.staff_name || 'Admin Manager',
    badgeColor: targetApp.status === 'completed' ? 'green' : (targetApp.status === 'cancelled' ? 'red' : 'blue')
  });
  res.json(targetApp);
});

// Supplier Configuration & PO Auto-Dispatch Engine
let suppliers = [
  {
    id: 1,
    name: 'NeedleCraft Supply Co.',
    contact_person: 'David Vance (Account Rep)',
    phone: '+1 (800) 555-4657',
    email: 'orders@needlecraft.com',
    order_email: 'orders@needlecraft.com',
    website: 'https://needlecraftsupply.com',
    address: '108 Industrial Blvd, Austin, TX 78745',
    lead_time_days: 3,
    payment_terms: 'Net 30',
    categories: ['Needles', 'Grips', 'Tubes', 'Disposables'],
    notes: 'Primary needle cartridge & precision medical equipment supplier. Order cutoff 2:00 PM EST for same-day dispatch.',
    is_primary: true,
    created_at: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 2,
    name: 'Eternal Ink Direct',
    contact_person: 'Sarah Jenkins',
    phone: '+1 (888) 555-3837',
    email: 'orders@eternalink.com',
    order_email: 'orders@eternalink.com',
    website: 'https://eternaltattooink.com',
    address: '450 Pigment Parkway, Brighton, MI 48116',
    lead_time_days: 4,
    payment_terms: 'Credit Card / Immediate',
    categories: ['Inks', 'Pigments', 'Wash Solutions'],
    notes: 'Official manufacturer distributor. High pigment load premium tattoo inks. Free shipping on orders over $300.',
    is_primary: false,
    created_at: '2026-01-12T08:00:00.000Z'
  },
  {
    id: 3,
    name: 'Piercing World Wholesale',
    contact_person: 'Marcus Chen',
    phone: '+1 (800) 555-7437',
    email: 'b2b@piercingworld.com',
    order_email: 'orders@piercingworld.com',
    website: 'https://piercingworldb2b.com',
    address: '920 Titanium Way, Suite 400, Los Angeles, CA 90012',
    lead_time_days: 5,
    payment_terms: 'Net 15',
    categories: ['Jewelry', 'Body Piercing', 'Forceps', 'Autoclave Bags'],
    notes: 'Implant-grade titanium (ASTM F136) & 14k gold body jewelry. Mill test certificates included with every batch.',
    is_primary: false,
    created_at: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 4,
    name: 'MedSafe Studio Depot',
    contact_person: 'Elena Rostova',
    phone: '+1 (877) 555-6337',
    email: 'orders@medsafestudio.com',
    order_email: 'fulfillment@medsafestudio.com',
    website: 'https://medsafestudiodepot.com',
    address: '330 Biohazard Lane, Chicago, IL 60607',
    lead_time_days: 2,
    payment_terms: 'Net 30',
    categories: ['Hygiene', 'PPE', 'Nitrile Gloves', 'Cavicide', 'Barrier Film'],
    notes: 'Regional medical depot for hospital-grade disinfectants, barrier film, sharps containers, and nitrile gloves.',
    is_primary: false,
    created_at: '2026-01-20T08:00:00.000Z'
  },
  {
    id: 5,
    name: 'SkinCare Studio Pro',
    contact_person: 'Chloe Martin',
    phone: '+1 (800) 555-2273',
    email: 'sales@skincarepro.com',
    order_email: 'orders@skincarepro.com',
    website: 'https://skincareproaftercare.com',
    address: '77 Botanical Dr, Portland, OR 97201',
    lead_time_days: 3,
    payment_terms: 'Net 30',
    categories: ['Aftercare', 'Soaps', 'Ointments', 'Butter'],
    notes: 'Organic botanical tattoo aftercare balms, green foam soaps, and daily soothing recovery lotions.',
    is_primary: false,
    created_at: '2026-02-01T08:00:00.000Z'
  }
];

let supplierConfig = {
  supplier_name: 'NeedleCraft Supply Co.',
  supplier_email: 'orders@needlecraft.com',
  contact_person: 'David Vance (Account Mgr)',
  phone: '+1 (800) 555-4657',
  auto_email_enabled: true
};

// The items as the studio entered them. Every item came back with an invented order history
// (purchase orders, past prices, a usage rate and a stockout date); no screen used it.
app.get('/api/inventory', (req, res) => {
  res.json(inventory);
});
app.post('/api/inventory', (req, res) => {
  // the id is the server's: length + 1 repeated an id after a deletion, and the body could set one
  const { id: _ignored, ...fields } = req.body || {};
  const newItem = { ...fields, id: inventory.length ? Math.max(...inventory.map((i) => Number(i.id) || 0)) + 1 : 1 };
  inventory.push(newItem);

  logActivity({
    category: 'inventory',
    action: 'ITEM_ADDED',
    title: `Inventory Item Added: ${newItem.name}`,
    details: `Type: ${newItem.item_type || 'General'} | SKU: ${newItem.sku || 'N/A'} | Initial Qty: ${newItem.quantity || 0}`,
    user: 'Admin Manager',
    badgeColor: 'amber'
  });

  res.status(201).json(newItem);
});

app.patch('/api/inventory/:id', (req, res) => {
  const item = inventory.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const oldQty = item.quantity;
  const { id: _keep, ...changes } = req.body || {};
  Object.assign(item, changes);

  logActivity({
    category: 'inventory',
    action: 'STOCK_UPDATED',
    title: `Inventory Stock Updated: ${item.name}`,
    details: `Quantity adjusted from ${oldQty} to ${item.quantity} units (SKU: ${item.sku})`,
    user: 'Admin Manager',
    badgeColor: item.quantity <= (item.reorder_point !== undefined ? item.reorder_point : 10) ? 'red' : 'amber'
  });

  res.json(item);
});

app.delete('/api/inventory/:id', (req, res) => {
  const idNum = parseInt(req.params.id);
  const idx = inventory.findIndex(i => i.id === idNum);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const removed = inventory.splice(idx, 1)[0];

  logActivity({
    category: 'inventory',
    action: 'ITEM_REMOVED',
    title: `Inventory Item Deleted: ${removed.name}`,
    details: `Removed SKU ${removed.sku || 'N/A'} (${removed.name}) from studio inventory catalog.`,
    user: 'Admin Manager',
    badgeColor: 'red'
  });

  res.json({ success: true, removed });
});

// ========================================================
// 📦 5 NEW REAL FEATURE ENHANCEMENT API ENDPOINTS
// ========================================================

// 3. Sterile Medical Batch / Lot Number & Expiration Tracking
app.get('/api/inventory/sterile-audit', (req, res) => {
  const today = new Date();
  const audit = inventory.map(item => {
    let expStatus = 'VALID';
    let daysUntilExp = null;

    if (item.exp_date) {
      const exp = new Date(item.exp_date);
      const diffTime = exp.getTime() - today.getTime();
      daysUntilExp = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysUntilExp < 0) {
        expStatus = 'EXPIRED';
      } else if (daysUntilExp <= 30) {
        expStatus = 'EXPIRING_SOON';
      }
    }

    return {
      id: item.id,
      name: item.name,
      sku: item.sku,
      category: item.item_type || item.category,
      quantity: item.quantity,
      lot_number: item.lot_number || 'LOT-UNASSIGNED',
      exp_date: item.exp_date || 'N/A',
      days_until_exp: daysUntilExp,
      exp_status: expStatus
    };
  });

  res.json({ audit, checked_at: today.toISOString() });
});

// Shared Team Messenger Board API
app.get('/api/messages', (req, res) => {
  res.json(teamMessages);
});

app.post('/api/messages', (req, res) => {
  const { author, role, avatar, channel, text, pinned } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const newMsg = {
    id: nextMessageId++,
    author: author || 'Team Member',
    role: role || 'Studio Staff',
    avatar: avatar || '💬',
    channel: channel || 'general',
    text: text.trim(),
    timestamp: new Date().toISOString(),
    pinned: Boolean(pinned)
  };

  teamMessages.unshift(newMsg);
  if (teamMessages.length > 300) teamMessages.pop();

  logActivity({
    category: 'staff',
    action: 'CHAT_MESSAGE',
    title: `Team Message Posted by ${newMsg.author}`,
    details: `Posted to #${newMsg.channel}: "${newMsg.text.length > 60 ? newMsg.text.substring(0, 60) + '...' : newMsg.text}"`,
    user: newMsg.author,
    badgeColor: 'blue'
  });

  res.status(201).json(newMsg);
});

app.delete('/api/messages/:id', (req, res) => {
  const idNum = parseInt(req.params.id);
  const idx = teamMessages.findIndex(m => m.id === idNum);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  const removed = teamMessages.splice(idx, 1)[0];
  res.json({ success: true, removed });
});

app.delete('/api/messages', (req, res) => {
  teamMessages.length = 0;
  res.json({ success: true, cleared: true });
});

// Financial API
app.get('/api/financial', (req, res) => res.json(financial));

app.post('/api/financial', (req, res) => {
  const bad = paymentError(req.body);
  if (bad) return res.status(400).json({ error: bad });
  let cName = req.body.client_name || '';
  let clientId = req.body.client_id ? parseInt(req.body.client_id) : null;
  if (clientId && !cName) {
    const cl = clients.find(c => c.id === clientId);
    if (cl) cName = cl.name;
  }

  let staffId = req.body.staff_id ? parseInt(req.body.staff_id) : null;

  const newTransaction = {
    id: financial.length ? Math.max(...financial.map(f => f.id)) + 1 : 1,
    client_id: clientId,
    staff_id: staffId,
    amount: paymentAmount(req.body.amount),
    method: req.body.method.trim(),
    type: req.body.type || 'payment',
    transaction_date: req.body.transaction_date || studioDay(),
    status: req.body.status || 'completed',
    source: req.body.source || 'in-studio',
    client_name: cName
  };
  financial.push(newTransaction);

  logActivity({
    category: 'financial',
    action: 'PAYMENT_RECORDED',
    title: `Payment Received: ${money(newTransaction.amount)}`,
    details: `Transaction #${newTransaction.id} completed via ${newTransaction.method} (${newTransaction.source})${cName ? ` for ${cName}` : ''}`,
    user: 'Admin Manager',
    badgeColor: 'green'
  });

  res.status(201).json(newTransaction);
});

app.delete('/api/financial/:id', (req, res) => {
  const idNum = parseInt(req.params.id);
  const idx = financial.findIndex(f => f.id === idNum);
  if (idx === -1) return res.status(404).json({ error: 'Transaction record not found' });
  const removed = financial.splice(idx, 1)[0];

  logActivity({
    category: 'financial',
    action: 'PAYMENT_VOIDED',
    title: `Payment Voided: ${money(removed.amount)}`,
    details: `Voided transaction #${removed.id} (${money(removed.amount)} via ${removed.method}).`,
    user: 'Admin Manager',
    badgeColor: 'red'
  });

  res.json({ success: true, removed });
});

// =========================================================================
// 💼 ACCOUNTING APPLICATIONS INTEGRATION SUITE (QUICKBOOKS & SAGE)
// =========================================================================

// GET QuickBooks CSV/IIF Export
app.get('/api/accounting/export/quickbooks', (req, res) => {
  const header = `!TRNS,TRNSID,TRNSTYPE,DATE,ACCNT,AMOUNT,DOCNUM,MEMO\n!SPL,SPLID,TRNSTYPE,DATE,ACCNT,AMOUNT,DOCNUM,MEMO\n!ENDTRNS\n`;
  let rows = '';

  (financial || []).forEach((f, idx) => {
    const trnsId = `TRNS-QB-${f.id || idx + 1}`;
    const dateStr = f.transaction_date || studioDay();
    const amount = (parseFloat(f.amount) || 0).toFixed(2);
    const memo = `POS Payment - ${f.client_name || 'Client'} (${f.method || 'Card'})`;

    rows += `TRNS,${trnsId},PAYMENT,${dateStr},1000 - Primary Studio Operating Cash,${amount},POS-${f.id},${memo}\n`;
    rows += `SPL,${trnsId}-SPL,PAYMENT,${dateStr},4000 - Tattoo & Body Art Service Revenue,-${amount},POS-${f.id},Service Revenue Split\n`;
    rows += `ENDTRNS\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="QuickBooks_General_Ledger_Export.iif"');
  res.send(header + rows);
});

// GET Sage CSV Export
app.get('/api/accounting/export/sage', (req, res) => {
  let csv = `Date,Transaction_ID,GL_Account,Account_Description,Debit,Credit,Reference,Description,Client_Name\n`;

  (financial || []).forEach((f, idx) => {
    const dateStr = f.transaction_date || studioDay();
    const amount = parseFloat(f.amount) || 0;
    const ref = `SAGE-POS-${f.id || idx + 1}`;
    const client = f.client_name || 'Walk-in Client';

    // Debit Cash
    csv += `"${dateStr}","${ref}","1000","Primary Studio Operating Cash",${amount.toFixed(2)},0.00,"${ref}","Tattoo Service Payment","${client}"\n`;
    // Credit Revenue
    csv += `"${dateStr}","${ref}","4000","Tattoo Service Revenue",0.00,${amount.toFixed(2)},"${ref}","Revenue Recognition","${client}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="Sage_General_Ledger_Export.csv"');
  res.send(csv);
});

// Compliance & Vault API
app.get('/api/compliance', (req, res) => res.json(compliance));
app.post('/api/compliance', (req, res) => {
  const newLog = { id: compliance.length + 1, ...req.body, log_date: studioDay(), status: 'pass' };
  compliance.push(newLog);

  logActivity({
    category: 'compliance',
    action: 'LOG_RECORDED',
    title: `Compliance Verification: ${newLog.type}`,
    details: `Status: PASSED | Logged on ${newLog.log_date} | Notes: ${newLog.details?.notes || 'Verified'}`,
    user: 'Compliance Auditor',
    badgeColor: 'indigo'
  });

  res.status(201).json(newLog);
});

// Staff & Professionals API
app.get('/api/staff', (req, res) => {
  const enrichedStaff = staff.map(s => {
    const assignedClients = clients.filter(c => !c.archived && Number(c.assigned_staff_id) === Number(s.id));
    const completedServices = services.filter(ser => Number(ser.staff_id) === Number(s.id));
    return {
      ...s,
      clientCount: assignedClients.length,
      serviceCount: completedServices.length
    };
  });
  res.json(enrichedStaff);
});

app.post('/api/staff', (req, res) => {
  if (!req.body.name || !String(req.body.name).trim()) return res.status(400).json({ error: 'A name is required' });
  const newStaff = {
    id: staff.length ? Math.max(...staff.map(s => s.id)) + 1 : 1, // length + 1 repeated an id after a removal
    name: String(req.body.name).trim(),
    email: req.body.email || '',
    role: req.body.role || 'artist',
    title: req.body.title || '',
    phone: req.body.phone || '',
    specialties: Array.isArray(req.body.specialties) ? req.body.specialties : (req.body.specialties ? req.body.specialties.split(',').map(s => s.trim()).filter(Boolean) : []),
    bio: req.body.bio || '',
    notes: req.body.notes || '',
    instagram: req.body.instagram || '',
    linkedin: req.body.linkedin || '',
    twitter: req.body.twitter || req.body.x || '',
    facebook: req.body.facebook || '',
    whatsapp: req.body.whatsapp || '',
    telegram: req.body.telegram || '',
    certifications: Array.isArray(req.body.certifications) ? req.body.certifications : [],
    active: req.body.active !== undefined ? req.body.active : true,
    created_at: new Date().toISOString()
  };
  staff.push(newStaff);

  logActivity({
    category: 'staff',
    action: 'STAFF_ADDED',
    title: `New Team Member: ${newStaff.name}`,
    details: `${newStaff.title} (${newStaff.role}) added to studio roster`,
    user: 'Admin Manager',
    badgeColor: 'blue'
  });

  res.status(201).json(newStaff);
});

app.patch('/api/staff/:id', (req, res) => {
  const member = staff.find(s => s.id === parseInt(req.params.id));
  if (!member) return res.status(404).json({ error: 'Professional not found' });

  if (req.body.specialties && typeof req.body.specialties === 'string') {
    req.body.specialties = req.body.specialties.split(',').map(s => s.trim()).filter(Boolean);
  } else if (req.body.specialties === '') {
    req.body.specialties = [];
  }
  Object.assign(member, req.body);

  logActivity({
    category: 'staff',
    action: 'STAFF_UPDATED',
    title: `Staff Roster Updated: ${member.name}`,
    details: `Updated profile info, social links & bio for ${member.name}`,
    user: 'Admin Manager',
    badgeColor: 'blue'
  });

  res.json(member);
});

app.delete('/api/staff/:id', (req, res) => {
  const idNum = parseInt(req.params.id);
  const idx = staff.findIndex(s => s.id === idNum);
  if (idx === -1) return res.status(404).json({ error: 'Professional not found' });
  const removed = staff.splice(idx, 1)[0];

  logActivity({
    category: 'staff',
    action: 'STAFF_REMOVED',
    title: `Team Member Removed: ${removed.name}`,
    details: `${removed.name} (${removed.title}) removed from active studio roster.`,
    user: 'Admin Manager',
    badgeColor: 'red'
  });

  res.json({ success: true, removed });
});

app.get('/api/staff/:id/clients', (req, res) => {
  const staffId = parseInt(req.params.id);
  const assigned = clients.filter(c => !c.archived && c.assigned_staff_id === staffId);
  res.json(assigned);
});

const waivers = [
  {
    id: 1,
    client_id: 1,
    client_name: 'Alex Rivera',
    service_type: 'Tattoo - Custom Sleeve (Upper Arm)',
    signed_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    staff_verifier: 'Jaxon Vance',
    ip_hash: '0x8f4b2c1d9e8a7f6e5d4c3b2a10987654',
    age_verified: true,
    medical_disclosures: 'None stated. Latex allergy checked.',
    signature_preview: 'Digital Verified Signature #8812',
    verification_status: 'VERIFIED_ENCRYPTED',
    status: 'active'
  },
  {
    id: 2,
    client_id: 1,
    client_name: 'Alex Rivera',
    service_type: 'Tattoo Intake & Medical Release Waiver',
    signed_at: new Date(Date.now() - 3600000 * 240).toISOString(),
    staff_verifier: 'Admin Manager',
    ip_hash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    age_verified: true,
    medical_disclosures: 'Sensitive skin. No blood thinners.',
    signature_preview: 'Digital Verified Signature #7701',
    verification_status: 'VERIFIED_ENCRYPTED',
    status: 'active'
  },
  {
    id: 3,
    client_id: 2,
    client_name: 'Samantha Chen',
    service_type: 'Piercing - Helix & Tragus Consent Waiver',
    signed_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    staff_verifier: 'Maya Lin',
    ip_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    age_verified: true,
    medical_disclosures: 'None',
    signature_preview: 'Digital Verified Signature #9022',
    verification_status: 'VERIFIED_ENCRYPTED',
    status: 'active'
  },
  {
    id: 4,
    client_id: 3,
    client_name: 'Marcus Brody',
    service_type: 'Japanese Traditional Backpiece Consultation Waiver',
    signed_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    staff_verifier: 'Jaxon Vance',
    ip_hash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
    age_verified: true,
    medical_disclosures: 'Penicillin allergy noted.',
    signature_preview: 'Digital Verified Signature #9105',
    verification_status: 'VERIFIED_ENCRYPTED',
    status: 'active'
  },
  {
    id: 5,
    client_id: 4,
    client_name: 'Elena Rostova',
    service_type: 'Fine-Line Botanical Tattoo Waiver',
    signed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    staff_verifier: 'Soren Frost',
    ip_hash: '0x5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c',
    age_verified: true,
    medical_disclosures: 'None',
    signature_preview: 'Digital Verified Signature #9488',
    verification_status: 'VERIFIED_ENCRYPTED',
    status: 'active'
  }
];

app.get('/api/waivers', (req, res) => res.json(waivers));

app.post('/api/waivers', (req, res) => {
  const staffVerifier = req.body.staff_verifier || req.body.staff_name || 'Admin Manager';
  const ipHash = req.body.ip_hash || '';
  
  const newWaiver = {
    id: waivers.length ? Math.max(...waivers.map((x) => Number(x.id) || 0)) + 1 : 1, // length + 1 repeated an id after a deletion
    client_id: req.body.client_id ? parseInt(req.body.client_id) : null,
    client_name: req.body.client_name || 'Guest Client',
    service_type: req.body.service_type || 'Body Art Service Waiver',
    signed_at: new Date().toISOString(),
    staff_verifier: staffVerifier,
    ip_hash: ipHash,
    age_verified: !!req.body.age_verified,
    medical_disclosures: req.body.medical_disclosures || 'None stated',
    signature: req.body.signature || '',
    signature_preview: req.body.signature ? 'Signed on the studio signature pad' : 'No signature captured',
    verification_status: req.body.signature ? 'SIGNED' : 'UNSIGNED',
    status: 'active'
  };
  waivers.unshift(newWaiver);

  logActivity({
    category: 'compliance',
    action: 'WAIVER_SIGNED',
    title: `Digital Liability Waiver Signed: ${newWaiver.client_name}`,
    details: `Signed consent for ${newWaiver.service_type}. Recorded by: ${staffVerifier}`,
    user: staffVerifier,
    badgeColor: 'indigo'
  });

  res.status(201).json(newWaiver);
});

// Staff Shifts & Clock-in/Clock-out Tracking
const staffShifts = [];

// Seed realistic staff shift history for current week
(function seedStaffShifts() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);

  const staffMembers = [
    { id: 2, name: 'Jaxon Vance', dailyHrs: 8.0 },
    { id: 3, name: 'Maya Lin', dailyHrs: 7.5 },
    { id: 4, name: 'Soren Frost', dailyHrs: 8.2 },
    { id: 5, name: 'Chloe Vance', dailyHrs: 6.5 }
  ];

  let idCounter = 1;
  const daysPassed = Math.max(1, Math.min(dayOfWeek === 0 ? 6 : dayOfWeek, 5));

  for (let d = 0; d < daysPassed; d++) {
    const shiftDate = new Date(monday);
    shiftDate.setDate(monday.getDate() + d);

    staffMembers.forEach(sm => {
      const clockIn = new Date(shiftDate);
      clockIn.setHours(9 + (sm.id % 2), 0, 0, 0);
      const clockOut = new Date(clockIn);
      clockOut.setHours(clockIn.getHours() + Math.floor(sm.dailyHrs), Math.round((sm.dailyHrs % 1) * 60), 0, 0);

      staffShifts.push({
        id: idCounter++,
        staff_id: sm.id,
        staff_name: sm.name,
        clock_in: clockIn.toISOString(),
        clock_out: clockOut.toISOString(),
        duration_hours: sm.dailyHrs,
        notes: 'Completed scheduled studio shift'
      });
    });
  }
})();

app.get('/api/staff/shifts', (req, res) => res.json(staffShifts));
app.post('/api/staff/:id/shift', (req, res) => {
  const staffId = parseInt(req.params.id);
  const member = staff.find(s => s.id === staffId);
  if (!member) return res.status(404).json({ error: 'Staff member not found' });

  const activeShift = staffShifts.find(s => s.staff_id === staffId && !s.clock_out);
  if (activeShift) {
    // Clock Out
    activeShift.clock_out = new Date().toISOString();
    const durationHours = ((new Date(activeShift.clock_out) - new Date(activeShift.clock_in)) / 3600000).toFixed(2);
    activeShift.duration_hours = parseFloat(durationHours);

    logActivity({
      category: 'staff',
      action: 'CLOCK_OUT',
      title: `Staff Clock-Out: ${member.name}`,
      details: `${member.name} ended shift. Total active session duration: ${durationHours} hours.`,
      user: member.name,
      badgeColor: 'blue'
    });

    return res.json({ status: 'clocked_out', shift: activeShift });
  } else {
    // Clock In
    const newShift = {
      id: staffShifts.length + 1,
      staff_id: staffId,
      staff_name: member.name,
      clock_in: new Date().toISOString(),
      clock_out: null,
      notes: req.body.notes || 'Station sanitized & ready'
    };
    staffShifts.unshift(newShift);

    logActivity({
      category: 'staff',
      action: 'CLOCK_IN',
      title: `Staff Clock-In: ${member.name}`,
      details: `${member.name} (${member.title}) clocked in for active shift.`,
      user: member.name,
      badgeColor: 'green'
    });

    return res.status(201).json({ status: 'clocked_in', shift: newShift });
  }
});

// ========================================================
// 📅 MONTHLY ARTIST SHIFT SCHEDULE & AVAILABILITY ENGINE
// ========================================================
const monthlySchedules = [];

(function initializeMonthlySchedules() {
  const artists = [
    { id: 2, name: 'Jaxon Vance', station: 'Station 1 - Custom Tattoo', workDays: [1, 3, 5, 6], start: '10:00', end: '18:00', type: 'On-Duty' },
    { id: 3, name: 'Maya Lin', station: 'Station 2 - Piercing Suite', workDays: [2, 4, 6, 0], start: '11:00', end: '19:00', type: 'On-Duty' },
    { id: 4, name: 'Soren Frost', station: 'Station 3 - Fine-Line Suite', workDays: [1, 2, 4, 5], start: '10:00', end: '17:00', type: 'On-Duty' },
    { id: 5, name: 'Chloe Vance', station: 'Station 4 - PMU / Apprentice', workDays: [3, 5, 6, 0], start: '12:00', end: '18:00', type: 'On-Duty' }
  ];

  let schedId = 1;
  // The demo rota runs from this week for four weeks (it was fixed to July-August 2026, so it was always empty)
  const monday = new Date(); monday.setHours(12, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  {
    for (let d = 0; d < 28; d++) {
      const dateObj = new Date(monday); dateObj.setDate(monday.getDate() + d);
      const dayOfWeek = dateObj.getDay();
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      artists.forEach(a => {
        const isWorking = a.workDays.includes(dayOfWeek);
        if (isWorking) {
          monthlySchedules.push({
            id: schedId++,
            staff_id: a.id,
            staff_name: a.name,
            date: dateStr,
            start_time: a.start,
            end_time: a.end,
            station: a.station,
            status: 'On-Duty',
            notes: dayOfWeek === 0 ? 'Walk-in Sessions Only' : 'Scheduled Appointments & Custom Consults'
          });
        }
      });
    }
  }
})();

app.get('/api/staff/monthly-schedule', (req, res) => {
  res.json(monthlySchedules);
});

app.post('/api/staff/assign-shift', (req, res) => {
  const { staff_id, staff_name, date, start_time, end_time, station, status, notes } = req.body;
  const targetStaff = staff.find(s => s.id === parseInt(staff_id));
  if (!targetStaff || !date) return res.status(400).json({ error: 'A staff member and a date are required' });
  const sName = targetStaff.name;

  const existingIdx = monthlySchedules.findIndex(s => s.staff_id === parseInt(staff_id) && s.date === date);
  const newShift = {
    id: existingIdx >= 0 ? monthlySchedules[existingIdx].id : Math.max(0, ...monthlySchedules.map(s => s.id)) + 1,
    staff_id: parseInt(staff_id),
    staff_name: sName,
    date,
    start_time: start_time || '10:00',
    end_time: end_time || '18:00',
    station: station || '',
    status: status || 'On-Duty',
    notes: notes || ''
  };

  if (existingIdx >= 0) {
    monthlySchedules[existingIdx] = newShift;
  } else {
    monthlySchedules.push(newShift);
  }

  logActivity({
    category: 'staff',
    action: 'SHIFT_ASSIGNED',
    title: `📅 Artist Shift Assigned: ${newShift.staff_name}`,
    details: `${newShift.staff_name} assigned shift on ${newShift.date} (${newShift.start_time} - ${newShift.end_time}) at ${newShift.station}. Status: ${newShift.status}`,
    user: 'Admin Manager',
    badgeColor: 'blue'
  });

  res.status(200).json({ status: 'success', shift: newShift });
});

app.delete('/api/staff/monthly-schedule/:id', (req, res) => {
  const idx = monthlySchedules.findIndex(s => s.id === parseInt(req.params.id));
  if (idx >= 0) {
    const removed = monthlySchedules.splice(idx, 1)[0];
    logActivity({
      category: 'staff',
      action: 'SHIFT_REMOVED',
      title: `🗓️ Artist Shift Cancelled: ${removed.staff_name}`,
      details: `Shift on ${removed.date} at ${removed.station} was removed from monthly schedule.`,
      user: 'Admin Manager',
      badgeColor: 'red'
    });
    return res.json({ status: 'deleted', shift: removed });
  }
  res.status(404).json({ error: 'Shift not found' });
});

// Private Staff-Only Notes Management Routes
app.get('/api/clients/:id/staff-notes', (req, res) => {
  const clientId = parseInt(req.params.id);
  const client = clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  if (!client.staff_notes) client.staff_notes = [];
  const sortedNotes = client.staff_notes.slice().sort((a, b) => new Date(b.timestamp || b.createdAt || 0).getTime() - new Date(a.timestamp || a.createdAt || 0).getTime());
  res.json({ success: true, staff_notes: sortedNotes, client_id: clientId, client_name: client.name });
});

app.post('/api/clients/:id/staff-notes', (req, res) => {
  const clientId = parseInt(req.params.id);
  const client = clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  if (!client.staff_notes) client.staff_notes = [];

  const { note, author, author_role, category } = req.body;
  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Note text content is required' });
  }

  const staffAuthor = author || 'Admin Manager';
  const staffRole = author_role || (staff.find(s => s.name === staffAuthor)?.title || 'Studio Staff');
  
  const newStaffNote = {
    id: Date.now(),
    author: staffAuthor,
    author_role: staffRole,
    category: category || 'General Staff Note',
    note: note.trim(),
    timestamp: new Date().toISOString()
  };

  client.staff_notes.unshift(newStaffNote);

  logActivity({
    category: 'client',
    action: 'STAFF_NOTE_ADDED',
    title: `🔒 Staff Note: ${client.name}`,
    details: `[${newStaffNote.category}] "${newStaffNote.note}" (Logged by ${newStaffNote.author})`,
    user: newStaffNote.author,
    badgeColor: 'indigo'
  });

  res.status(201).json({ 
    success: true, 
    note: newStaffNote, 
    staff_notes: client.staff_notes.slice().sort((a, b) => new Date(b.timestamp || b.createdAt || 0).getTime() - new Date(a.timestamp || a.createdAt || 0).getTime())
  });
});

app.delete('/api/clients/:id/staff-notes/:noteId', (req, res) => {
  const clientId = parseInt(req.params.id);
  const noteId = parseInt(req.params.noteId);
  const client = clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  if (!client.staff_notes) client.staff_notes = [];
  const initialLength = client.staff_notes.length;
  client.staff_notes = client.staff_notes.filter(n => n.id !== noteId);

  if (client.staff_notes.length < initialLength) {
    logActivity({
      category: 'client',
      action: 'STAFF_NOTE_REMOVED',
      title: `🔒 Staff Note Removed: ${client.name}`,
      details: `Private staff note #${noteId} removed`,
      user: 'Admin Manager',
      badgeColor: 'gray'
    });
  }

  res.json({ 
    success: true, 
    staff_notes: client.staff_notes.slice().sort((a, b) => new Date(b.timestamp || b.createdAt || 0).getTime() - new Date(a.timestamp || a.createdAt || 0).getTime()) 
  });
});

// D3.js Supply Usage Density Heatmap by Day of the Week & Shift Endpoint
app.get('/api/inventory/usage-heatmap', (req, res) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shifts = [
    { key: 'morning', label: 'Morning (09:00 - 12:00)', hours: '9am-12pm', until: 12 },
    { key: 'afternoon', label: 'Afternoon (12:00 - 16:00)', hours: '12pm-4pm', until: 16 },
    { key: 'peak_evening', label: 'Peak Evening (16:00 - 20:00)', hours: '4pm-8pm', until: 20 },
    { key: 'late_night', label: 'Late Night (20:00 - 23:00)', hours: '8pm-11pm', until: 24 }
  ];
  const cells = {};
  const itemTotals = {};
  let unitsTotal = 0;
  procedureConsumptions.forEach((log) => {
    // logs written before v1.0.3 carry a date only: they count at midday
    const when = new Date(log.logged_at || `${log.date}T12:00:00`);
    if (isNaN(when.getTime())) return;
    const day = days[(when.getDay() + 6) % 7];
    const shift = shifts.find((sh) => when.getHours() < sh.until) || shifts[3];
    const cell = cells[day + shift.key] = cells[day + shift.key] || { units: 0, procedures: 0, items: {} };
    cell.procedures++;
    (log.items || []).forEach((item) => {
      const qty = Number(item.qty) || 1;
      cell.units += qty;
      unitsTotal += qty;
      cell.items[item.name] = (cell.items[item.name] || 0) + qty;
      itemTotals[item.name] = (itemTotals[item.name] || 0) + qty;
    });
  });
  const top = (map) => Object.keys(map).sort((a, b) => map[b] - map[a])[0] || '';
  const peak = Math.max(1, ...Object.values(cells).map((c) => c.units));
  const matrix = [];
  days.forEach((day) => shifts.forEach((shift) => {
    const cell = cells[day + shift.key] || { units: 0, procedures: 0, items: {} };
    const density = Math.round((cell.units / peak) * 100);
    matrix.push({ day, shift: shift.label, shift_key: shift.key, shift_hours: shift.hours, units: cell.units, units_used: cell.units, density,
      top_item: top(cell.items), top_supply: top(cell.items), procedure_count: cell.procedures,
      risk_level: cell.units === 0 ? 'LOW' : density >= 85 ? 'CRITICAL' : density >= 60 ? 'HIGH' : density >= 30 ? 'MODERATE' : 'LOW' });
  }));
  const dayTotals = days.map((d) => {
    const row = matrix.filter((c) => c.day === d);
    return { day: d, total_units: row.reduce((t, c) => t + c.units, 0), total_procedures: row.reduce((t, c) => t + c.procedure_count, 0) };
  });
  const peakDay = dayTotals.slice().sort((a, b) => b.total_units - a.total_units)[0];
  const peakCell = matrix.slice().sort((a, b) => b.units - a.units)[0];
  res.json({
    days,
    shifts: shifts.map(({ key, label, hours }) => ({ key, label, hours })),
    matrix,
    day_totals: dayTotals,
    summary: {
      total_weekly_units: unitsTotal,
      total_weekly_procedures: procedureConsumptions.length,
      peak_day: unitsTotal ? peakDay.day : '',
      peak_shift: unitsTotal ? peakCell.shift : '',
      fastest_burning_item: top(itemTotals)
    }
  });
});

// Inventory Purchase Orders Generator
// =========================================================================
// 📦 SUPPLIER PROCUREMENT & COMMUNICATION TIMELINE
// =========================================================================

// Historical & Active Purchase Orders
let purchaseOrders = [
  {
    po_number: 'PO-2026-0812',
    supplier_id: 1,
    supplier_name: 'NeedleCraft Supply Co.',
    supplier_email: 'orders@needlecraft.com',
    created_at: '2026-08-05T14:30:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-08-08',
    payment_status: 'Paid',
    payment_date: '2026-08-07',
    carrier: 'UPS',
    items: [
      { id: 1, sku: 'NDL-3RL-100', name: 'Sterile Tattoo Needles 3RL', category: 'Needles', orderQty: 60, unitPrice: 24.00, estCost: 1440.00 },
      { id: 2, sku: 'NDL-7M1-50', name: 'Magnum Tattoo Needles 7M1', category: 'Needles', orderQty: 40, unitPrice: 26.50, estCost: 1060.00 },
      { id: 7, sku: 'SKU-GLOVE-L', name: 'Disposable Black Nitrile Gloves L', category: 'Consumables', orderQty: 30, unitPrice: 18.50, estCost: 555.00 }
    ],
    totalCost: 3055.00,
    tracking_number: '1Z9999999999999999',
    lead_time_days: 3,
    notes: 'Restocked critical needle supplies for August guest artists.'
  },
  {
    po_number: 'PO-2026-0720',
    supplier_id: 2,
    supplier_name: 'Eternal Ink Direct',
    supplier_email: 'orders@eternalink.com',
    created_at: '2026-07-20T10:15:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-07-24',
    payment_status: 'Paid',
    payment_date: '2026-07-22',
    carrier: 'USPS Priority',
    items: [
      { id: 3, sku: 'INK-DYN-BLK-8', name: 'Dynamic Black Tattoo Ink 8oz', category: 'Inks', orderQty: 25, unitPrice: 32.00, estCost: 800.00 },
      { id: 4, sku: 'INK-LIN-BLK-4', name: 'Lining Black Pigment 4oz', category: 'Inks', orderQty: 18, unitPrice: 28.00, estCost: 504.00 }
    ],
    totalCost: 1304.00,
    tracking_number: '940011189956254899',
    lead_time_days: 4,
    notes: 'Mid-summer ink restock; included free wash bottle promo.'
  },
  {
    po_number: 'PO-2026-0708',
    supplier_id: 3,
    supplier_name: 'Piercing World Wholesale',
    supplier_email: 'b2b@piercingworld.com',
    created_at: '2026-07-08T11:45:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-07-13',
    payment_status: 'Paid',
    payment_date: '2026-07-10',
    carrier: 'FedEx Express',
    items: [
      { id: 5, sku: 'JW-TIT-CB-16G', name: 'ASTM F136 Titanium Curved Barbell', category: 'Jewelry', orderQty: 45, unitPrice: 14.50, estCost: 652.50 },
      { id: 6, sku: 'JW-14K-STUD-FL', name: '14k Solid Gold Flower Stud', category: 'Jewelry', orderQty: 15, unitPrice: 65.00, estCost: 975.00 }
    ],
    totalCost: 1627.50,
    tracking_number: 'FEDEX-77890123456',
    lead_time_days: 5,
    notes: 'Implant-grade jewelry certificates verified.'
  },
  {
    po_number: 'PO-2026-0615',
    supplier_id: 4,
    supplier_name: 'MedSafe Studio Depot',
    supplier_email: 'orders@medsafestudio.com',
    created_at: '2026-06-15T09:00:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-06-17',
    payment_status: 'Paid',
    payment_date: '2026-06-16',
    carrier: 'UPS Ground',
    items: [
      { id: 8, sku: 'SKU-MED-CAVI24', name: 'Cavicide Surface Disinfectant Spray 24oz', category: 'Hygiene', orderQty: 30, unitPrice: 16.75, estCost: 502.50 },
      { id: 9, sku: 'SKU-MED-AUTOBAG', name: 'Self-Sealing Autoclave Pouches 200pk', category: 'Hygiene', orderQty: 20, unitPrice: 22.00, estCost: 440.00 }
    ],
    totalCost: 942.50,
    tracking_number: 'UPS-1Z8829910',
    lead_time_days: 2,
    notes: 'Monthly sanitation & medical grade disinfectant shipment.'
  },
  {
    po_number: 'PO-2026-0525',
    supplier_id: 1,
    supplier_name: 'NeedleCraft Supply Co.',
    supplier_email: 'orders@needlecraft.com',
    created_at: '2026-05-25T15:20:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-05-28',
    payment_status: 'Paid',
    payment_date: '2026-05-26',
    carrier: 'UPS Express',
    items: [
      { id: 1, sku: 'NDL-3RL-100', name: 'Sterile Tattoo Needles 3RL', category: 'Needles', orderQty: 50, unitPrice: 24.00, estCost: 1200.00 },
      { id: 10, sku: 'SKU-GRIP-30MM', name: 'Ergonomic Memory Foam Grips 30mm', category: 'Disposables', orderQty: 35, unitPrice: 15.00, estCost: 525.00 }
    ],
    totalCost: 1725.00,
    tracking_number: '1Z333444555',
    lead_time_days: 3,
    notes: 'Spring season bulk cartridge order.'
  },
  {
    po_number: 'PO-2026-0410',
    supplier_id: 2,
    supplier_name: 'Eternal Ink Direct',
    supplier_email: 'orders@eternalink.com',
    created_at: '2026-04-10T13:10:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-04-14',
    payment_status: 'Paid',
    payment_date: '2026-04-12',
    carrier: 'USPS Priority',
    items: [
      { id: 3, sku: 'INK-DYN-BLK-8', name: 'Dynamic Black Tattoo Ink 8oz', category: 'Inks', orderQty: 30, unitPrice: 32.00, estCost: 960.00 },
      { id: 11, sku: 'INK-PRT-CLR-SET', name: 'Portrait Color Pigment Set (12 colors)', category: 'Inks', orderQty: 8, unitPrice: 110.00, estCost: 880.00 }
    ],
    totalCost: 1840.00,
    tracking_number: '940022334455',
    lead_time_days: 4,
    notes: 'Special color sets for realism artists.'
  },
  {
    po_number: 'PO-2026-0305',
    supplier_id: 1,
    supplier_name: 'NeedleCraft Supply Co.',
    supplier_email: 'orders@needlecraft.com',
    created_at: '2026-03-05T10:00:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-03-08',
    payment_status: 'Paid',
    payment_date: '2026-03-06',
    carrier: 'UPS Ground',
    items: [
      { id: 1, sku: 'NDL-3RL-100', name: 'Sterile Tattoo Needles 3RL', category: 'Needles', orderQty: 45, unitPrice: 24.00, estCost: 1080.00 },
      { id: 2, sku: 'NDL-7M1-50', name: 'Magnum Tattoo Needles 7M1', category: 'Needles', orderQty: 30, unitPrice: 26.50, estCost: 795.00 }
    ],
    totalCost: 1875.00,
    tracking_number: '1Z111222333',
    lead_time_days: 3,
    notes: 'Q1 needle replenishment.'
  },
  {
    po_number: 'PO-2026-0214',
    supplier_id: 3,
    supplier_name: 'Piercing World Wholesale',
    supplier_email: 'b2b@piercingworld.com',
    created_at: '2026-02-14T14:40:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-02-19',
    payment_status: 'Paid',
    payment_date: '2026-02-16',
    carrier: 'FedEx 2Day',
    items: [
      { id: 5, sku: 'JW-TIT-CB-16G', name: 'ASTM F136 Titanium Curved Barbell', category: 'Jewelry', orderQty: 50, unitPrice: 14.50, estCost: 725.00 },
      { id: 12, sku: 'SKU-TOOL-FORCEP', name: 'Stainless Steel Piercing Forceps', category: 'Equipment', orderQty: 10, unitPrice: 45.00, estCost: 450.00 }
    ],
    totalCost: 1175.00,
    tracking_number: 'FEDEX-99887766',
    lead_time_days: 5,
    notes: 'Valentine piercing promotion restock.'
  },
  {
    po_number: 'PO-2026-0118',
    supplier_id: 5,
    supplier_name: 'SkinCare Studio Pro',
    supplier_email: 'orders@skincarepro.com',
    created_at: '2026-01-18T11:20:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2026-01-21',
    payment_status: 'Paid',
    payment_date: '2026-01-19',
    carrier: 'UPS Ground',
    items: [
      { id: 13, sku: 'SKU-AFTER-BUTTER-50', name: 'Organic Tattoo Aftercare Butter 2oz (50pk)', category: 'Aftercare', orderQty: 40, unitPrice: 18.00, estCost: 720.00 },
      { id: 14, sku: 'SKU-DERM-WRAP', name: 'Sterile Dermal Barrier Film Roll 6in x 11yd', category: 'Aftercare', orderQty: 25, unitPrice: 34.00, estCost: 850.00 }
    ],
    totalCost: 1570.00,
    tracking_number: 'UPS-1Z99881122',
    lead_time_days: 3,
    notes: 'New Year client retail aftercare bundle stock.'
  },
  {
    po_number: 'PO-2025-1210',
    supplier_id: 1,
    supplier_name: 'NeedleCraft Supply Co.',
    supplier_email: 'orders@needlecraft.com',
    created_at: '2025-12-10T16:00:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2025-12-13',
    payment_status: 'Paid',
    payment_date: '2025-12-11',
    carrier: 'UPS Next Day',
    items: [
      { id: 1, sku: 'NDL-3RL-100', name: 'Sterile Tattoo Needles 3RL', category: 'Needles', orderQty: 65, unitPrice: 24.00, estCost: 1560.00 },
      { id: 2, sku: 'NDL-7M1-50', name: 'Magnum Tattoo Needles 7M1', category: 'Needles', orderQty: 45, unitPrice: 26.50, estCost: 1192.50 },
      { id: 7, sku: 'SKU-GLOVE-L', name: 'Disposable Black Nitrile Gloves L', category: 'Consumables', orderQty: 35, unitPrice: 18.50, estCost: 647.50 }
    ],
    totalCost: 3400.00,
    tracking_number: '1Z888777666',
    lead_time_days: 3,
    notes: 'Holiday season high-volume needle & supply order.'
  },
  {
    po_number: 'PO-2025-1115',
    supplier_id: 4,
    supplier_name: 'MedSafe Studio Depot',
    supplier_email: 'orders@medsafestudio.com',
    created_at: '2025-11-15T14:15:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2025-11-17',
    payment_status: 'Paid',
    payment_date: '2025-11-16',
    carrier: 'UPS Ground',
    items: [
      { id: 8, sku: 'SKU-MED-CAVI24', name: 'Cavicide Surface Disinfectant Spray 24oz', category: 'Hygiene', orderQty: 35, unitPrice: 16.75, estCost: 586.25 },
      { id: 9, sku: 'SKU-MED-AUTOBAG', name: 'Self-Sealing Autoclave Pouches 200pk', category: 'Hygiene', orderQty: 30, unitPrice: 22.00, estCost: 660.00 },
      { id: 15, sku: 'SKU-MED-SPORE', name: 'Biological Spore Test Indicator Vials 50pk', category: 'Hygiene', orderQty: 10, unitPrice: 85.00, estCost: 850.00 }
    ],
    totalCost: 2096.25,
    tracking_number: 'UPS-1Z77665544',
    lead_time_days: 2,
    notes: 'Biannual health board compliance restock.'
  },
  {
    po_number: 'PO-2025-1022',
    supplier_id: 2,
    supplier_name: 'Eternal Ink Direct',
    supplier_email: 'orders@eternalink.com',
    created_at: '2025-10-22T10:45:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2025-10-26',
    payment_status: 'Paid',
    payment_date: '2025-10-24',
    carrier: 'USPS Priority',
    items: [
      { id: 3, sku: 'INK-DYN-BLK-8', name: 'Dynamic Black Tattoo Ink 8oz', category: 'Inks', orderQty: 35, unitPrice: 32.00, estCost: 1120.00 },
      { id: 4, sku: 'INK-LIN-BLK-4', name: 'Lining Black Pigment 4oz', category: 'Inks', orderQty: 22, unitPrice: 28.00, estCost: 616.00 },
      { id: 16, sku: 'INK-GRAY-WSH-SET', name: 'Greywash Shader 4-Stage Set', category: 'Inks', orderQty: 12, unitPrice: 65.00, estCost: 780.00 }
    ],
    totalCost: 2516.00,
    tracking_number: '940044556677',
    lead_time_days: 4,
    notes: 'Halloween flash event ink batch.'
  },
  {
    po_number: 'PO-2025-0914',
    supplier_id: 3,
    supplier_name: 'Piercing World Wholesale',
    supplier_email: 'b2b@piercingworld.com',
    created_at: '2025-09-14T13:30:00.000Z',
    status: 'fulfilled',
    delivery_status: 'Delivered',
    delivery_date: '2025-09-19',
    payment_status: 'Paid',
    payment_date: '2025-09-16',
    carrier: 'FedEx Ground',
    items: [
      { id: 5, sku: 'JW-TIT-CB-16G', name: 'ASTM F136 Titanium Curved Barbell', category: 'Jewelry', orderQty: 60, unitPrice: 14.50, estCost: 870.00 },
      { id: 6, sku: 'JW-14K-STUD-FL', name: '14k Solid Gold Flower Stud', category: 'Jewelry', orderQty: 18, unitPrice: 65.00, estCost: 1170.00 }
    ],
    totalCost: 2040.00,
    tracking_number: 'FEDEX-55443322',
    lead_time_days: 5,
    notes: 'Fall piercing jewelry collection stock.'
  }
];

// Seeded Supplier Communication & Timeline History
let supplierTimelineLogs = [
  {
    id: 1,
    supplier_id: 1,
    supplier_name: 'NeedleCraft Supply Co.',
    type: 'po_dispatch',
    title: 'PO #PO-2026-0812 Dispatched',
    details: 'Automated electronic dispatch for 60x 3RL Needles, 40x 7M1 Magnums, and 30x Nitrile Gloves ($3,055.00).',
    sender: 'Auto-Reorder Engine',
    date: '2026-08-05T14:30:00.000Z',
    outcome: 'PO Acknowledged & In Transit (Tracking: 1Z9999999999999999)',
    metadata: { po_number: 'PO-2026-0812', total_cost: 3055.00, items_count: 130 }
  },
  {
    id: 2,
    supplier_id: 1,
    supplier_name: 'NeedleCraft Supply Co.',
    type: 'call',
    title: 'Phone Call with David Vance (Account Rep)',
    details: 'Discussed volume pricing tier for Q3 cartridges. David confirmed 12% discount on orders exceeding $2,500.',
    sender: 'Studio Manager',
    date: '2026-08-04T11:15:00.000Z',
    outcome: 'Volume tier activated on account #NC-88410',
    metadata: { duration_mins: 14, phone: '+1 (800) 555-4657' }
  },
  {
    id: 3,
    supplier_id: 2,
    supplier_name: 'Eternal Ink Direct',
    type: 'email',
    title: 'Inquiry on Dynamic Black Batch Certification',
    details: 'Sent email requesting SDS and heavy metal purity lab certificates for batch #DY-99201.',
    sender: 'Studio Admin',
    date: '2026-08-02T09:40:00.000Z',
    outcome: 'Certificates received and archived into Compliance Vault',
    metadata: { email: 'orders@eternalink.com' }
  },
  {
    id: 4,
    supplier_id: 3,
    supplier_name: 'Piercing World Wholesale',
    type: 'note',
    title: 'Updated Mill Certificates for ASTM F136 Titanium',
    details: 'Verified that all 14k gold flower studs and titanium threadless ends comply with established professional practice and ASTM F-136 / ASTM F-138 implant-grade material benchmarks.',
    sender: 'Marcus Chen / Quality Officer',
    date: '2026-07-28T16:00:00.000Z',
    outcome: 'Audit Status: 100% Compliant'
  },
  {
    id: 5,
    supplier_id: 4,
    supplier_name: 'MedSafe Studio Depot',
    type: 'call',
    title: 'Expedited Cavicide Delivery Coordination',
    details: 'Spoke with Elena Rostova regarding next-day priority courier for surface disinfectants prior to health inspection.',
    sender: 'Studio Manager',
    date: '2026-07-18T10:30:00.000Z',
    outcome: 'Next-day courier scheduled and delivered on time',
    metadata: { duration_mins: 8, phone: '+1 (877) 555-6337' }
  },
  {
    id: 6,
    supplier_id: 1,
    supplier_name: 'NeedleCraft Supply Co.',
    type: 'note',
    title: 'Payment Terms Review',
    details: 'Credit terms officially extended to Net 30 with $5,000 monthly spending limit.',
    sender: 'Accounts Payable',
    date: '2026-07-10T15:00:00.000Z',
    outcome: 'Terms updated in billing system'
  }
];

// =========================================================================
// 🚀 SUPPLIER COMMUNICATION TIMELINE ENDPOINTS
// =========================================================================

// 2. Supplier Communication History Timeline Endpoints
app.get('/api/inventory/suppliers/:id/timeline', (req, res) => {
  const supplierId = parseInt(req.params.id);
  const supplier = suppliers.find(s => s.id === supplierId);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const logs = supplierTimelineLogs.filter(l => l.supplier_id === supplierId);
  const pos = purchaseOrders.filter(p => p.supplier_id === supplierId || (p.supplier_name && p.supplier_name.toLowerCase() === supplier.name.toLowerCase()));
  
  const mergedTimeline = [
    ...logs,
    ...pos.map(po => ({
      id: `po-${po.po_number}`,
      supplier_id: supplierId,
      supplier_name: supplier.name,
      type: 'po_dispatch',
      title: `Purchase Order ${po.po_number} Issued`,
      details: `Order for ${po.items ? po.items.length : 0} items totaling ${money((po.totalCost || 0))}. Status: ${po.status.toUpperCase()}.`,
      sender: 'Studio Inventory Admin',
      date: po.created_at,
      outcome: po.tracking_number ? `Tracking: ${po.tracking_number}` : 'Order Processed',
      metadata: { po_number: po.po_number, total_cost: po.totalCost, items: po.items }
    }))
  ];

  mergedTimeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({
    supplier_id: supplierId,
    supplier_name: supplier.name,
    order_email: supplier.order_email || supplier.email,
    phone: supplier.phone,
    timeline: mergedTimeline
  });
});

app.post('/api/inventory/suppliers/:id/timeline', (req, res) => {
  const supplierId = parseInt(req.params.id);
  const supplier = suppliers.find(s => s.id === supplierId);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const { type = 'note', title, details, sender = 'Studio Manager', outcome = '', metadata = {} } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title / Subject is required' });
  }

  const newLog = {
    id: supplierTimelineLogs.length ? Math.max(...supplierTimelineLogs.map(l => typeof l.id === 'number' ? l.id : 0)) + 1 : 1,
    supplier_id: supplierId,
    supplier_name: supplier.name,
    type: ['email', 'call', 'note', 'po_dispatch', 'meeting'].includes(type) ? type : 'note',
    title: title.trim(),
    details: details ? details.trim() : '',
    sender: sender.trim(),
    date: new Date().toISOString(),
    outcome: outcome ? outcome.trim() : '',
    metadata: metadata || {}
  };

  supplierTimelineLogs.unshift(newLog);

  logActivity({
    category: 'inventory',
    action: 'SUPPLIER_COMMUNICATION_LOGGED',
    title: `Supplier Log: ${supplier.name} (${newLog.type.toUpperCase()})`,
    details: `${newLog.title} - ${newLog.details.slice(0, 80)}...`,
    user: newLog.sender,
    badgeColor: newLog.type === 'call' ? 'blue' : (newLog.type === 'email' ? 'emerald' : 'purple')
  });

  res.status(201).json(newLog);
});

app.delete('/api/inventory/suppliers/:id/timeline/:logId', (req, res) => {
  const supplierId = parseInt(req.params.id);
  const logId = parseInt(req.params.logId);
  const idx = supplierTimelineLogs.findIndex(l => l.id === logId && l.supplier_id === supplierId);
  if (idx === -1) return res.status(404).json({ error: 'Log entry not found' });

  const deleted = supplierTimelineLogs.splice(idx, 1)[0];
  res.json({ success: true, deleted });
});

app.get('/api/inventory/purchase-orders', (req, res) => {
  const { supplier_id, supplier_name } = req.query;
  let filtered = [...purchaseOrders];
  if (supplier_id && supplier_id !== 'all') {
    const sId = parseInt(supplier_id);
    filtered = filtered.filter(po => po.supplier_id === sId || String(po.supplier_id) === String(supplier_id));
  }
  if (supplier_name && supplier_name !== 'all') {
    const sName = supplier_name.toLowerCase().trim();
    filtered = filtered.filter(po => po.supplier_name && po.supplier_name.toLowerCase().includes(sName));
  }
  res.json(filtered);
});

// Dedicated endpoint to fetch all historical purchase orders for a specific supplier
app.get('/api/inventory/suppliers/:id/purchase-orders', (req, res) => {
  const sId = parseInt(req.params.id);
  const targetSupplier = suppliers.find(s => s.id === sId);
  const targetName = targetSupplier ? targetSupplier.name.toLowerCase() : '';
  const filtered = purchaseOrders.filter(po => 
    po.supplier_id === sId || 
    (targetName && po.supplier_name && po.supplier_name.toLowerCase() === targetName)
  );
  res.json({
    success: true,
    supplier_id: sId,
    supplier_name: targetSupplier ? targetSupplier.name : 'Unknown Supplier',
    supplier_email: targetSupplier ? (targetSupplier.order_email || targetSupplier.email) : 'orders@supplier.com',
    purchase_orders: filtered,
    total_spend: filtered.reduce((acc, p) => acc + (parseFloat(p.totalCost) || 0), 0),
    total_count: filtered.length
  });
});

// Dedicated Supplier Directory & Contact Management Endpoints
app.get('/api/inventory/suppliers', (req, res) => {
  const enriched = suppliers.map(s => {
    const matchedItems = inventory.filter(i => 
      i.supplier && (
        i.supplier.toLowerCase().includes(s.name.toLowerCase()) || 
        s.name.toLowerCase().includes(i.supplier.toLowerCase())
      )
    );
    return {
      ...s,
      item_count: matchedItems.length,
      supplied_items: matchedItems.map(i => ({ id: i.id, name: i.name, sku: i.sku, quantity: i.quantity, reorder_point: i.reorder_point }))
    };
  });
  res.json(enriched);
});

app.get('/api/inventory/suppliers/:id', (req, res) => {
  const idNum = parseInt(req.params.id);
  const supplier = suppliers.find(s => s.id === idNum);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  const matchedItems = inventory.filter(i => 
    i.supplier && (
      i.supplier.toLowerCase().includes(supplier.name.toLowerCase()) || 
      supplier.name.toLowerCase().includes(i.supplier.toLowerCase())
    )
  );
  res.json({
    ...supplier,
    item_count: matchedItems.length,
    supplied_items: matchedItems
  });
});

app.post('/api/inventory/suppliers', (req, res) => {
  const { 
    name, 
    contact_person, 
    phone, 
    email, 
    order_email, 
    website, 
    address, 
    lead_time_days, 
    payment_terms, 
    categories, 
    notes, 
    is_primary 
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Supplier name is required' });
  }

  const primaryFlag = Boolean(is_primary);
  if (primaryFlag) {
    suppliers.forEach(s => s.is_primary = false);
  }

  const newSupplier = {
    id: suppliers.length ? Math.max(...suppliers.map(s => s.id || 0)) + 1 : 1,
    name: name.trim(),
    contact_person: contact_person ? contact_person.trim() : '',
    phone: phone ? phone.trim() : '',
    email: email ? email.trim() : '', // never an invented address: purchase orders are emailed to it
    order_email: (order_email || email || '').trim(),
    website: website ? website.trim() : '',
    address: address ? address.trim() : '',
    lead_time_days: parseInt(lead_time_days) || 3,
    payment_terms: payment_terms ? payment_terms.trim() : '',
    categories: Array.isArray(categories) ? categories : (categories ? categories.split(',').map(c => c.trim()) : ['Supplies']),
    notes: notes ? notes.trim() : '',
    is_primary: primaryFlag || suppliers.length === 0,
    created_at: new Date().toISOString()
  };

  suppliers.push(newSupplier);

  if (newSupplier.is_primary) {
    supplierConfig = {
      supplier_name: newSupplier.name,
      supplier_email: newSupplier.order_email || newSupplier.email,
      contact_person: newSupplier.contact_person,
      phone: newSupplier.phone,
      auto_email_enabled: true
    };
  }

  logActivity({
    category: 'inventory',
    action: 'SUPPLIER_CREATED',
    title: `New Supplier Added: ${newSupplier.name}`,
    details: `Added vendor "${newSupplier.name}" (Direct Order: ${newSupplier.order_email}, Phone: ${newSupplier.phone}, Lead Time: ${newSupplier.lead_time_days}d).`,
    user: 'Admin Manager',
    badgeColor: 'emerald'
  });

  res.status(201).json(newSupplier);
});

app.put('/api/inventory/suppliers/:id', (req, res) => {
  const idNum = parseInt(req.params.id);
  const supplier = suppliers.find(s => s.id === idNum);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const oldName = supplier.name;
  const { 
    name, 
    contact_person, 
    phone, 
    email, 
    order_email, 
    website, 
    address, 
    lead_time_days, 
    payment_terms, 
    categories, 
    notes, 
    is_primary 
  } = req.body;

  if (name && name.trim()) supplier.name = name.trim();
  if (contact_person !== undefined) supplier.contact_person = contact_person.trim();
  if (phone !== undefined) supplier.phone = phone.trim();
  if (email !== undefined) supplier.email = email.trim();
  if (order_email !== undefined) supplier.order_email = order_email.trim();
  if (website !== undefined) supplier.website = website.trim();
  if (address !== undefined) supplier.address = address.trim();
  if (lead_time_days !== undefined) supplier.lead_time_days = parseInt(lead_time_days) || 3;
  if (payment_terms !== undefined) supplier.payment_terms = payment_terms.trim();
  if (categories !== undefined) {
    supplier.categories = Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim());
  }
  if (notes !== undefined) supplier.notes = notes.trim();

  if (is_primary !== undefined) {
    const pFlag = Boolean(is_primary);
    if (pFlag) {
      suppliers.forEach(s => s.is_primary = false);
      supplier.is_primary = true;
    } else {
      supplier.is_primary = false;
    }
  }

  // If name changed, update linked inventory items
  if (oldName !== supplier.name) {
    inventory.forEach(i => {
      if (i.supplier === oldName) i.supplier = supplier.name;
    });
  }

  if (supplier.is_primary) {
    supplierConfig = {
      supplier_name: supplier.name,
      supplier_email: supplier.order_email || supplier.email,
      contact_person: supplier.contact_person,
      phone: supplier.phone,
      auto_email_enabled: supplierConfig.auto_email_enabled
    };
  }

  logActivity({
    category: 'inventory',
    action: 'SUPPLIER_UPDATED',
    title: `Supplier Profile Updated: ${supplier.name}`,
    details: `Updated contact info (Direct Order: ${supplier.order_email}, Phone: ${supplier.phone})`,
    user: 'Admin Manager',
    badgeColor: 'blue'
  });

  res.json(supplier);
});

app.delete('/api/inventory/suppliers/:id', (req, res) => {
  const idNum = parseInt(req.params.id);
  const idx = suppliers.findIndex(s => s.id === idNum);
  if (idx === -1) return res.status(404).json({ error: 'Supplier not found' });

  const removed = suppliers.splice(idx, 1)[0];
  if (removed.is_primary && suppliers.length > 0) {
    suppliers[0].is_primary = true;
    supplierConfig.supplier_name = suppliers[0].name;
    supplierConfig.supplier_email = suppliers[0].order_email || suppliers[0].email;
    supplierConfig.contact_person = suppliers[0].contact_person;
    supplierConfig.phone = suppliers[0].phone;
  }

  logActivity({
    category: 'inventory',
    action: 'SUPPLIER_DELETED',
    title: `Supplier Removed: ${removed.name}`,
    details: `Deleted vendor "${removed.name}" from active studio directory.`,
    user: 'Admin Manager',
    badgeColor: 'red'
  });

  res.json({ success: true, removed });
});

app.post('/api/inventory/send-po-email', (req, res) => {
  const { supplierEmail } = req.body;
  const targetEmail = supplierEmail || supplierConfig.supplier_email;
  const lowStockItems = inventory.filter(i => i.quantity <= (i.reorder_point !== undefined ? i.reorder_point : 10));
  const itemsToReorder = lowStockItems.length ? lowStockItems.map(i => {
    const rPoint = i.reorder_point !== undefined ? i.reorder_point : 10;
    const qtyNeeded = Math.max(20, rPoint * 2 - i.quantity);
    const estCost = qtyNeeded * (i.price || 15);
    return { id: i.id, name: i.name, sku: i.sku, currentQty: i.quantity, orderQty: qtyNeeded, estCost };
  }) : [];
  if (!itemsToReorder.length) return res.status(400).json({ error: 'No items are below their reorder level' });

  const totalCost = itemsToReorder.reduce((s, i) => s + i.estCost, 0);
  const poNumber = `PO-${Date.now().toString().slice(-6)}`;

  const po = {
    po_number: poNumber,
    created_at: new Date().toISOString(),
    items: itemsToReorder,
    totalCost,
    status: 'ready',
    supplier_email: targetEmail
  };
  purchaseOrders.unshift(po);

  logActivity({
    category: 'inventory',
    action: 'PO_PREPARED',
    title: `PO Prepared: ${poNumber}`,
    details: `Purchase order prepared for ${targetEmail || 'the supplier'} for ${itemsToReorder.length} item(s). Total: ${money(totalCost)}.`,
    user: 'Admin Manager',
    badgeColor: 'purple'
  });

  const compose = { to_email: targetEmail || '', subject: `Purchase order ${poNumber}`, body: itemsToReorder.map(i => `${i.orderQty} x ${i.name}${i.sku ? ` (${i.sku})` : ''}`).join('\n') + `\n\nEstimated total: ${money(totalCost)}` };
  res.json({ compose, success: true, po });
});

// GET all Historical Purchase Orders with filters
app.get('/api/inventory/purchase-orders', (req, res) => {
  const { supplier, delivery_status, payment_status, search } = req.query;
  let filtered = [...purchaseOrders];

  if (supplier && supplier !== 'ALL' && supplier !== 'all') {
    filtered = filtered.filter(p => 
      (p.supplier_name || p.supplier || '').toLowerCase().includes(supplier.toLowerCase()) || 
      (p.supplier_id && String(p.supplier_id) === String(supplier))
    );
  }

  if (delivery_status && delivery_status !== 'ALL') {
    filtered = filtered.filter(p => (p.delivery_status || '').toLowerCase() === delivery_status.toLowerCase());
  }

  if (payment_status && payment_status !== 'ALL') {
    filtered = filtered.filter(p => (p.payment_status || '').toLowerCase() === payment_status.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p => 
      (p.po_number || '').toLowerCase().includes(s) ||
      (p.supplier_name || p.supplier || '').toLowerCase().includes(s) ||
      (p.carrier || '').toLowerCase().includes(s) ||
      (p.tracking_number || '').toLowerCase().includes(s) ||
      (Array.isArray(p.items) && p.items.some(it => (it.name || '').toLowerCase().includes(s) || (it.sku || '').toLowerCase().includes(s)))
    );
  }

  res.json(filtered);
});

app.post('/api/inventory/purchase-orders', (req, res) => {
  const body = req.body || {};
  let itemsToReorder = [];
  let supplierName = body.supplier_name || body.supplier || 'NeedleCraft Supply Co.';
  let supplierId = body.supplier_id ? parseInt(body.supplier_id) : (suppliers[0] ? suppliers[0].id : 1);
  let poNum = body.po_number || `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  let shippingCost = parseFloat(body.shipping_cost || body.freight) || 0.0;
  let taxAmount = parseFloat(body.tax_amount || body.tax) || 0.0;
  let notes = body.notes || 'Automated studio purchase order requisition.';
  let paymentTerms = body.payment_terms || body.terms || 'Net 30';
  let shippingMethod = body.shipping_method || 'FedEx Express Freight';
  let deliveryDate = body.delivery_date || body.expected_delivery || studioDay(new Date(Date.now() + 3*86400000));

  if (Array.isArray(body.items) && body.items.length > 0) {
    itemsToReorder = body.items.map(item => {
      const orderQty = parseInt(item.order_qty || item.quantity || item.qty || item.orderQty) || 20;
      const unitCost = parseFloat(item.unit_cost || item.price || item.unitCost || item.cost) || 15.0;
      const estCost = orderQty * unitCost;
      return {
        id: item.id || item.item_id || Math.floor(Math.random() * 90000) + 1000,
        name: item.name || item.item_name || 'Studio Supply SKU',
        sku: item.sku || 'SKU-PO-ITEM',
        category: item.category || item.item_type || 'Supplies',
        current_quantity: item.current_quantity ?? item.currentQty ?? item.quantity ?? 10,
        reorder_threshold: item.reorder_threshold ?? item.reorder_point ?? 10,
        order_qty: orderQty,
        unit_cost: unitCost,
        est_cost: estCost,
        total_cost: estCost
      };
    });
  } else {
    // Fallback to low-stock items
    const lowStockItems = inventory.filter(i => {
      const thresh = (typeof getItemEffectiveThreshold === 'function') ? getItemEffectiveThreshold(i) : (i.reorder_point || 10);
      return i.quantity <= thresh;
    });
    if (!lowStockItems.length) {
      return res.status(400).json({ error: 'No items selected and no items currently below reorder threshold' });
    }
    itemsToReorder = lowStockItems.map(i => {
      const thresh = (typeof getItemEffectiveThreshold === 'function') ? getItemEffectiveThreshold(i) : (i.reorder_point || 10);
      const qtyNeeded = Math.max(20, thresh * 2 - i.quantity);
      const unitCost = parseFloat(i.price || i.cost || i.unit_cost) || 15.0;
      const estCost = qtyNeeded * unitCost;
      return {
        id: i.id,
        name: i.name,
        sku: i.sku,
        category: i.category || i.item_type || 'Supplies',
        current_quantity: i.quantity,
        reorder_threshold: thresh,
        order_qty: qtyNeeded,
        unit_cost: unitCost,
        est_cost: estCost,
        total_cost: estCost
      };
    });
  }

  const itemsSubtotal = itemsToReorder.reduce((sum, item) => sum + (item.est_cost || item.total_cost || 0), 0);
  const grandTotal = itemsSubtotal + shippingCost + taxAmount;

  const po = {
    po_number: poNum,
    id: `PO-${Date.now()}`,
    created_at: new Date().toISOString(),
    issue_date: studioDay(),
    expected_delivery: deliveryDate,
    supplier_id: supplierId,
    supplier_name: supplierName,
    payment_terms: paymentTerms,
    shipping_method: shippingMethod,
    items: itemsToReorder,
    items_count: itemsToReorder.length,
    subtotal: itemsSubtotal,
    shipping_cost: shippingCost,
    tax_amount: taxAmount,
    totalCost: grandTotal,
    total_amount: grandTotal,
    notes: notes,
    status: 'dispatched_approved',
    dispatched_by: 'Studio Manager'
  };

  purchaseOrders.unshift(po);

  // Also log into supplier communication timeline if matching supplier exists
  const matchedSupplier = suppliers.find(s => s.id === supplierId || (s.name && s.name.toLowerCase() === supplierName.toLowerCase()));
  if (matchedSupplier && Array.isArray(supplierTimelineLogs)) {
    supplierTimelineLogs.unshift({
      id: supplierTimelineLogs.length + 1,
      supplier_id: matchedSupplier.id,
      supplier_name: matchedSupplier.name,
      type: 'purchase_order',
      title: `Purchase Order Ready: ${poNum}`,
      details: `Generated requisition for ${itemsToReorder.length} item(s) totaling ${money(grandTotal)}. Delivery requested via ${shippingMethod}.`,
      sender: 'Studio Manager',
      date: new Date().toISOString(),
      outcome: `Requisition Issued (${money(grandTotal)})`,
      metadata: { po_number: poNum, total: grandTotal, items_count: itemsToReorder.length }
    });
  }

  logActivity({
    category: 'inventory',
    action: 'PO_GENERATED',
    title: `Purchase Order Issued: ${po.po_number}`,
    details: `Generated Requisition PO for ${itemsToReorder.length} item(s) to ${supplierName}. Grand Total: ${money(grandTotal)}`,
    user: 'Studio Manager',
    badgeColor: 'emerald'
  });

  const compose = { to_email: (matchedSupplier && (matchedSupplier.email || matchedSupplier.contact_email)) || '', subject: `Purchase order ${po.po_number}`, body: itemsToReorder.map(i => `${i.order_qty || i.quantity || ''} x ${i.name || i.item_name || ''}`).join('\n') + `\n\nTotal: ${money(grandTotal)}` };
  res.status(201).json({ compose, success: true, po });
});

// Update Purchase Order Delivery Status and Payment Date
app.put('/api/inventory/purchase-orders/:po_number/status', (req, res) => {
  const { po_number } = req.params;
  const { delivery_status, delivery_date, payment_status, payment_date, tracking_number, notes } = req.body || {};

  const po = purchaseOrders.find(p => p.po_number === po_number);
  if (!po) {
    return res.status(404).json({ error: `Purchase Order ${po_number} not found` });
  }

  if (delivery_status !== undefined) po.delivery_status = delivery_status;
  if (delivery_date !== undefined) po.delivery_date = delivery_date;
  if (payment_status !== undefined) po.payment_status = payment_status;
  if (payment_date !== undefined) po.payment_date = payment_date;
  if (tracking_number !== undefined) po.tracking_number = tracking_number;
  if (notes !== undefined) po.notes = notes;

  logActivity({
    category: 'inventory',
    action: 'PO_STATUS_UPDATED',
    title: `PO Status Updated: ${po_number}`,
    details: `Updated ${po.supplier_name || 'supplier'} PO: Delivery [${po.delivery_status || 'N/A'}] | Payment [${po.payment_status || 'N/A'} (Date: ${po.payment_date || 'Pending'})]`,
    user: 'Studio Manager',
    badgeColor: 'blue'
  });

  res.json({ success: true, po });
});

// CSV Import Endpoints
app.post('/api/clients/import-csv', (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || !rows.length) {
    return res.status(400).json({ error: 'No valid row data provided' });
  }

  let importedCount = 0;
  rows.forEach(r => {
    if (r.name) {
      clients.push({
        id: clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        name: r.name,
        email: r.email || '',
        phone: r.phone || '',
        notes: r.notes || '',
        assigned_staff_id: null,
        assigned_staff_name: 'Unassigned',
        dob: r.dob || '',
        allergies: r.allergies || '',
        medical_history: r.medical_history || '',
        created_at: new Date().toISOString()
      });
      importedCount++;
    }
  });

  logActivity({
    category: 'client',
    action: 'CSV_IMPORT',
    title: `Batch Client CSV Import Completed`,
    details: `Imported ${importedCount} client records into studio database.`,
    user: 'Admin Manager',
    badgeColor: 'purple'
  });

  res.json({ success: true, count: importedCount });
});

app.post('/api/inventory/import-csv', (req, res) => {
  const { rows, mode = 'upsert' } = req.body;
  if (!Array.isArray(rows) || !rows.length) {
    return res.status(400).json({ error: 'No valid row data provided' });
  }

  let importedCount = 0;
  let updatedCount = 0;
  let newCount = 0;
  let skippedCount = 0;
  const validationErrors = [];
  const processedRows = [];

  rows.forEach((r, idx) => {
    const rowNum = idx + 1;
    const rowErrors = [];

    const name = (r.name || r.Name || r.item_name || r.title || '').toString().trim();
    const rawSku = (r.sku || r.SKU || '').toString().trim();
    const rawCategory = (r.category || r.Category || r.item_type || r.type || '').toString().trim();
    const rawQty = r.quantity !== undefined ? r.quantity : (r.Quantity !== undefined ? r.Quantity : (r.stock !== undefined ? r.stock : (r.qty !== undefined ? r.qty : '')));
    const rawPrice = r.unitcost !== undefined ? r.unitcost : (r.UnitCost !== undefined ? r.UnitCost : (r.unit_cost !== undefined ? r.unit_cost : (r.price !== undefined ? r.price : (r.Price !== undefined ? r.Price : (r.cost !== undefined ? r.cost : '')))));
    const rawReorder = r.reorderpoint !== undefined ? r.reorderpoint : (r.ReorderPoint !== undefined ? r.ReorderPoint : (r.reorder_point !== undefined ? r.reorder_point : (r.reorder_threshold !== undefined ? r.reorder_threshold : (r.min_stock !== undefined ? r.min_stock : ''))));
    const supplier = (r.supplier || r.Supplier || r.vendor || r.Vendor || '').toString().trim();

    // 1. Name validation
    if (!name) {
      rowErrors.push({ row: rowNum, field: 'Name', error: 'Item Name is required and cannot be blank' });
    }

    // 2. Quantity validation
    // a blank cell is null: it leaves an existing item's value alone (it set price 15.00, stock 0, reorder 5)
    let qty = null;
    if (rawQty === '' || rawQty === null || rawQty === undefined) {
      qty = null;
    } else {
      const parsedQty = Number(rawQty);
      if (isNaN(parsedQty) || parsedQty < 0 || !Number.isInteger(parsedQty)) {
        rowErrors.push({ row: rowNum, field: 'Quantity', error: `Quantity '${rawQty}' must be a non-negative integer (e.g. 0, 10, 50)` });
      } else {
        qty = parsedQty;
      }
    }

    // 3. UnitCost validation
    let unitPrice = null;
    if (rawPrice === '' || rawPrice === null || rawPrice === undefined) {
      unitPrice = null;
    } else {
      const cleanPriceStr = rawPrice.toString().replace('$', '').trim();
      const parsedPrice = Number(cleanPriceStr);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        rowErrors.push({ row: rowNum, field: 'UnitCost', error: `UnitCost '${rawPrice}' must be a non-negative numeric value (e.g. 18.50)` });
      } else {
        unitPrice = Math.round(parsedPrice * 100) / 100;
      }
    }

    // 4. ReorderPoint validation
    let reorderThreshold = null;
    if (rawReorder === '' || rawReorder === null || rawReorder === undefined) {
      reorderThreshold = null;
    } else {
      const parsedReorder = Number(rawReorder);
      if (isNaN(parsedReorder) || parsedReorder < 0 || !Number.isInteger(parsedReorder)) {
        rowErrors.push({ row: rowNum, field: 'ReorderPoint', error: `ReorderPoint '${rawReorder}' must be a non-negative integer (e.g. 5, 20)` });
      } else {
        reorderThreshold = parsedReorder;
      }
    }

    const sku = rawSku;
    const category = rawCategory;

    if (rowErrors.length > 0) {
      validationErrors.push(...rowErrors);
      skippedCount++;
      return;
    }

    // Look for existing item matching SKU or Name (case-insensitive)
    const existing = inventory.find(i => 
      (i.sku && sku && i.sku.toString().trim().toLowerCase() === sku.toLowerCase()) ||
      (i.name && name && i.name.toString().trim().toLowerCase() === name.toLowerCase())
    );

    if (existing) {
      if (qty !== null) existing.quantity = mode === 'add' ? (parseInt(existing.quantity) || 0) + qty : qty;
      if (unitPrice !== null) existing.price = unitPrice;
      if (reorderThreshold !== null) existing.reorder_point = reorderThreshold;
      if (supplier) existing.supplier = supplier;
      if (category) existing.item_type = category;
      if (name) existing.name = name;
      if (qty !== null) existing.last_restocked = studioDay();
      updatedCount++;
      processedRows.push({ ...existing, action: 'updated', row: rowNum });
    } else {
      const maxId = inventory.length ? Math.max(...inventory.map(i => i.id || 0)) : 0;
      const createdItem = {
        id: maxId + 1,
        name: name,
        item_type: category || 'Supplies',
        sku: sku || `SKU-${maxId + 1}`,
        quantity: qty ?? 0,
        reorder_point: reorderThreshold ?? 5,
        price: unitPrice ?? 0,
        supplier: supplier,
        lead_time_days: 3,
        last_restocked: studioDay()
      };
      inventory.push(createdItem);
      newCount++;
      processedRows.push({ ...createdItem, action: 'created', row: rowNum });
    }
    importedCount++;
  });

  const importBatchRecord = {
    id: `imp-hist-${Date.now()}`,
    timestamp: new Date().toISOString(),
    batchName: `Batch Catalog Import (${importedCount} records)`,
    recordsImported: importedCount,
    insertedCount: newCount,
    updatedCount: updatedCount,
    skippedCount: skippedCount,
    status: validationErrors.length > 0 && importedCount === 0 ? 'Failed' : (validationErrors.length > 0 ? 'Partial' : 'Completed'),
    source: 'Interactive CSV Batch Import'
  };
  csvImportHistory.unshift(importBatchRecord);
  if (csvImportHistory.length > 20) csvImportHistory.length = 20;

  logActivity({
    category: 'inventory',
    action: 'CSV_IMPORT',
    title: `Batch Inventory CSV Import Completed (${importedCount} Items)`,
    details: `Processed ${importedCount} items (${newCount} new created, ${updatedCount} updated, ${skippedCount} invalid skipped).`,
    user: 'Admin Manager',
    badgeColor: 'amber'
  });

  res.json({
    success: true,
    count: importedCount,
    newCount: newCount,
    updatedCount: updatedCount,
    skippedCount: skippedCount,
    validationErrors: validationErrors,
    processedRows: processedRows,
    inventory: inventory,
    batchRecord: importBatchRecord
  });
});

// CSV Batch Import History Records (Tracks last 5+ batch imports)
let csvImportHistory = [
  {
    id: 'imp-hist-5',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    batchName: 'Piercing Supplies Reorder Sync',
    recordsImported: 24,
    insertedCount: 18,
    updatedCount: 6,
    skippedCount: 0,
    status: 'Completed',
    source: 'Batch CSV Import'
  },
  {
    id: 'imp-hist-4',
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    batchName: 'Tattoo Needles & Cartridges Import',
    recordsImported: 42,
    insertedCount: 30,
    updatedCount: 12,
    skippedCount: 0,
    status: 'Completed',
    source: 'Catalog Spreadsheet Import'
  },
  {
    id: 'imp-hist-3',
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
    batchName: 'Sterilization & Hygiene Lot Batch',
    recordsImported: 16,
    insertedCount: 10,
    updatedCount: 6,
    skippedCount: 0,
    status: 'Completed',
    source: 'Batch CSV Import'
  },
  {
    id: 'imp-hist-2',
    timestamp: new Date(Date.now() - 3600000 * 7).toISOString(),
    batchName: 'Titanium Jewelry ASTM F-136 Restock',
    recordsImported: 35,
    insertedCount: 22,
    updatedCount: 13,
    skippedCount: 0,
    status: 'Completed',
    source: 'Supplier Catalog Batch'
  },
  {
    id: 'imp-hist-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    batchName: 'Studio Disposables & Ink Pigments Import',
    recordsImported: 29,
    insertedCount: 19,
    updatedCount: 10,
    skippedCount: 0,
    status: 'Completed',
    source: 'Batch CSV Import'
  }
];

app.get('/api/inventory/import-history', (req, res) => {
  res.json({
    success: true,
    history: csvImportHistory.slice(0, 5)
  });
});

// ==========================================
// AUTOMATED REMOTE CSV SYNCHRONIZATION ENGINE
// ==========================================

function parseCSVText(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return [];

  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;
    const row = {};
    headers.forEach((h, index) => {
      row[h] = values[index] !== undefined ? values[index] : '';
    });
    rows.push(row);
  }
  return rows;
}

const syncState = {
  enabled: process.env.SYNC_ENABLED === 'true', // off until the studio turns it on
  intervalMinutes: parseInt(process.env.SYNC_INTERVAL_MINUTES || '30', 10) || 30,
  clientsUrl: process.env.SYNC_CLIENTS_CSV_URL || process.env.CLIENT_CSV_URL || process.env.SYNC_CLIENT_CSV_URL || '',
  inventoryUrl: process.env.SYNC_INVENTORY_CSV_URL || process.env.INVENTORY_CSV_URL || process.env.SYNC_INVENTORY_CSV_URL || '',
  lastSyncTime: null,
  lastSuccessfulSyncTime: null,
  nextSyncTime: null,
  syncCount: 0,
  status: 'idle',
  lastError: null,
  lastStats: {
    clientsProcessed: 0,
    clientsCreated: 0,
    clientsUpdated: 0,
    inventoryProcessed: 0,
    inventoryCreated: 0,
    inventoryUpdated: 0
  }
};

let syncTimer = null;

async function runAutomatedCsvSync(triggeredBy = 'Automated Schedule') {
  if (syncState.status === 'syncing') {
    return { status: 'already_running', state: syncState };
  }
  // nothing to read is not a sync: it was recorded as a successful run
  const hasUrl = (u) => !!u && u.trim().startsWith('http');
  if (!hasUrl(syncState.clientsUrl) && !hasUrl(syncState.inventoryUrl)) {
    return { success: false, error: 'No CSV address is set', state: syncState };
  }

  syncState.status = 'syncing';
  syncState.lastError = null;
  const startTime = new Date();

  const stats = {
    clientsProcessed: 0,
    clientsCreated: 0,
    clientsUpdated: 0,
    inventoryProcessed: 0,
    inventoryCreated: 0,
    inventoryUpdated: 0
  };

  try {
    // 1. Sync Clients CSV if URL is configured
    if (syncState.clientsUrl && syncState.clientsUrl.trim().startsWith('http')) {
      const res = await fetch(syncState.clientsUrl.trim(), {
        headers: { 'User-Agent': 'Studio-CRM-Sync/1.0' }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch Clients CSV (${res.status} ${res.statusText})`);
      }
      const text = await res.text();
      const rows = parseCSVText(text);
      stats.clientsProcessed = rows.length;

      rows.forEach(r => {
        const name = r.name || r.client_name || r.full_name;
        if (!name) return;

        // A blank cell stays blank. It was filled with a made-up email and phone, birth date
        // 1990-01-01 (an adult) and allergies "None": "unknown" shown as "no allergies".
        const email = r.email || r.client_email || '';
        const phone = r.phone || r.mobile || r.telephone || '';
        const notes = r.notes || r.comments || '';
        const profession = r.profession || r.title || '';

        const existing = clients.find(c =>
          (email && c.email && c.email.toLowerCase() === email.toLowerCase()) ||
          (phone && c.phone && c.phone === phone) ||
          (c.name && c.name.toLowerCase() === name.toLowerCase())
        );

        if (existing) {
          delete existing.archived; // matched again: back on the list, not updated while hidden
          delete existing.archived_at;
          existing.name = name || existing.name;
          if (r.email) existing.email = r.email;
          if (r.phone) existing.phone = r.phone;
          if (r.profession) existing.profession = r.profession;
          if (r.dob) existing.dob = r.dob;
          if (r.allergies) existing.allergies = r.allergies;
          if (r.notes) existing.notes = r.notes; // a sync is not a visit: lastVisit is left alone
          stats.clientsUpdated++;
        } else {
          const maxId = clients.length ? Math.max(...clients.map(c => c.id)) : 0;
          clients.push({
            id: maxId + 1,
            name,
            email,
            phone,
            profession,
            notes,
            assigned_staff_id: null,
            assigned_staff_name: 'Unassigned',
            dob: r.dob || '',
            allergies: r.allergies || '',
            medical_history: r.medical_history || '',
            created_at: new Date().toISOString()
          });
          stats.clientsCreated++;
        }
      });

      if (stats.clientsCreated > 0 || stats.clientsUpdated > 0) {
        logActivity({
          category: 'client',
          action: 'REMOTE_CSV_SYNC',
          title: `Automated Remote Client CSV Sync (${triggeredBy})`,
          details: `Processed ${stats.clientsProcessed} records from remote CSV. Created: ${stats.clientsCreated}, Updated: ${stats.clientsUpdated}.`,
          user: 'Auto-Sync Engine',
          badgeColor: 'purple'
        });
      }
    }

    // 2. Sync Inventory CSV if URL is configured
    if (syncState.inventoryUrl && syncState.inventoryUrl.trim().startsWith('http')) {
      const res = await fetch(syncState.inventoryUrl.trim(), {
        headers: { 'User-Agent': 'Studio-CRM-Sync/1.0' }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch Inventory CSV (${res.status} ${res.statusText})`);
      }
      const text = await res.text();
      const rows = parseCSVText(text);
      stats.inventoryProcessed = rows.length;

      rows.forEach(r => {
        const name = r.name || r.item_name || r.title;
        if (!name) return;

        // A blank cell changes nothing. A blank quantity set the item's real stock to 10, and a
        // new item got the price 10.00 and a random SKU.
        const num = (v, parse) => { const n = parse(v); return v != null && String(v).trim() !== '' && Number.isFinite(n) ? n : null; };
        const sku = r.sku || r.item_sku || '';
        const quantity = num(r.quantity ?? r.qty ?? r.stock, (v) => parseInt(v, 10));
        const reorder_point = num(r.reorder_point ?? r.min_qty, (v) => parseInt(v, 10));
        const price = num(r.price ?? r.cost, parseFloat);
        const item_type = r.item_type || r.category || 'Supplies';

        const existing = inventory.find(i =>
          (i.sku && sku && i.sku.toLowerCase() === sku.toLowerCase()) ||
          (i.name && i.name.toLowerCase() === name.toLowerCase())
        );

        if (existing) {
          if (quantity !== null) existing.quantity = quantity;
          if (price !== null) existing.price = price;
          if (reorder_point !== null) existing.reorder_point = reorder_point;
          if (r.item_type || r.category) existing.item_type = item_type;
          stats.inventoryUpdated++;
        } else {
          const maxId = inventory.length ? Math.max(...inventory.map(i => i.id)) : 0;
          inventory.push({
            id: maxId + 1,
            name,
            item_type,
            sku: sku || `SKU-${maxId + 1}`,
            quantity: quantity ?? 0,
            reorder_point: reorder_point ?? 5,
            price: price ?? 0
          });
          stats.inventoryCreated++;
        }
      });

      if (stats.inventoryCreated > 0 || stats.inventoryUpdated > 0) {
        logActivity({
          category: 'inventory',
          action: 'REMOTE_CSV_SYNC',
          title: `Automated Remote Inventory CSV Sync (${triggeredBy})`,
          details: `Processed ${stats.inventoryProcessed} catalog items from remote CSV. Created: ${stats.inventoryCreated}, Updated: ${stats.inventoryUpdated}.`,
          user: 'Auto-Sync Engine',
          badgeColor: 'amber'
        });
      }
    }

    syncState.status = 'idle';
    syncState.lastSyncTime = startTime.toISOString();
    syncState.lastSuccessfulSyncTime = startTime.toISOString();
    syncState.syncCount++;
    syncState.lastStats = stats;

    const intervalMs = Math.max(1, syncState.intervalMinutes) * 60 * 1000;
    syncState.nextSyncTime = new Date(Date.now() + intervalMs).toISOString();

    return { success: true, stats, state: syncState };
  } catch (err) {
    console.error('[CSV Sync Engine Error]:', err.message);
    syncState.status = 'error';
    syncState.lastError = err.message;
    syncState.lastSyncTime = startTime.toISOString();

    logActivity({
      category: 'system',
      action: 'SYNC_ERROR',
      title: `Remote CSV Sync Error (${triggeredBy})`,
      details: `CSV Synchronization failed: ${err.message}`,
      user: 'Auto-Sync Engine',
      badgeColor: 'red'
    });

    return { success: false, error: err.message, state: syncState };
  }
}

function resetSyncSchedule() {
  if (syncTimer) clearInterval(syncTimer);
  if (!syncState.enabled) {
    syncState.status = 'disabled';
    syncState.nextSyncTime = null;
    return;
  }

  const intervalMs = Math.max(1, syncState.intervalMinutes) * 60 * 1000;
  syncState.nextSyncTime = new Date(Date.now() + intervalMs).toISOString();
  syncTimer = setInterval(() => {
    runAutomatedCsvSync('Automated Schedule');
  }, intervalMs);
}

// REST Endpoints for CSV Synchronization
app.get('/api/sync/status', (req, res) => {
  res.json(syncState);
});

app.get('/api/inventory/sync-status', (req, res) => {
  res.json(syncState);
});

app.post('/api/sync/trigger', async (req, res) => {
  const result = await runAutomatedCsvSync(req.body.user ? `Manual Trigger by ${req.body.user}` : 'Manual Trigger');
  res.json(result);
});

app.post('/api/sync/config', (req, res) => {
  if (req.body.clientsUrl !== undefined) syncState.clientsUrl = req.body.clientsUrl;
  if (req.body.inventoryUrl !== undefined) syncState.inventoryUrl = req.body.inventoryUrl;
  if (req.body.intervalMinutes !== undefined) syncState.intervalMinutes = parseInt(req.body.intervalMinutes, 10) || 30;
  if (req.body.enabled !== undefined) syncState.enabled = Boolean(req.body.enabled);

  resetSyncSchedule();

  logActivity({
    category: 'system',
    action: 'SYNC_CONFIG_UPDATED',
    title: `CSV Auto-Sync Settings Updated`,
    details: `Updated interval to ${syncState.intervalMinutes}m. Enabled: ${syncState.enabled}. Clients URL: ${syncState.clientsUrl || 'None'}, Inventory URL: ${syncState.inventoryUrl || 'None'}`,
    user: req.body.user || 'Admin Manager',
    badgeColor: 'blue'
  });

  res.json({ success: true, state: syncState });
});

// Artist Commissions & Financial Splits
app.get('/api/staff/commissions', (req, res) => {
  const report = staff.map(s => {
    const artistTransactions = financial.filter(f => Number(f.staff_id) === Number(s.id));
    const grossRevenue = artistTransactions.reduce((sum, f) => sum + f.amount, 0);
    const splitPercent = s.role === 'artist' ? 60 : (s.role === 'piercer' ? 50 : (s.role === 'apprentice' ? 40 : 100));
    const artistCommission = (grossRevenue * splitPercent) / 100;
    const studioShare = grossRevenue - artistCommission;

    return {
      staff_id: s.id,
      name: s.name,
      role: s.role,
      grossRevenue,
      splitPercent,
      artistCommission,
      studioShare,
      completedJobs: artistTransactions.length
    };
  });

  res.json(report);
});

// Digital Aftercare Instructions Generator & Templates Store
const aftercareTemplates = [
  {
    id: 'tattoo',
    title: 'Tattoo Healing & Clean Care Protocol',
    category: 'Tattoo',
    description: 'Standard 14-day healing instructions for custom black & grey and color tattoos.',
    steps: [
      'Leave protective dermal wrap or bandage on for 2 to 4 hours after session.',
      'Wash gently with warm water and fragrance-free antibacterial soap using clean hands.',
      'Pat dry thoroughly with a clean paper towel — DO NOT rub or use cloth towels.',
      'Apply a paper-thin coat of recommended specialty tattoo ointment 2-3 times daily for the first 3 days.',
      'Do not submerge tattoo in water (pools, hot tubs, baths, ocean) for at least 2 weeks.',
      'Avoid direct sunlight and UV exposure. Never pick, peel, or scratch scabs during healing.'
    ]
  },
  {
    id: 'piercing',
    title: 'Body Piercing & Saline Wash Routine',
    category: 'Piercing',
    description: 'Aseptic saline wash routine for lobe, cartilage, nose, and body piercings.',
    steps: [
      'Spray piercing 2 times daily with sterile 0.9% saline solution wash.',
      'Wash hands thoroughly with soap and water before touching or cleaning piercing area.',
      'Do not twist, rotate, or force jewelry move during initial healing period.',
      'Avoid sleeping directly on fresh ear piercings — use a travel neck pillow if needed.',
      'Check threaded or threadless jewelry ball ends gently with clean hands once a week.'
    ]
  },
  {
    id: 'fine-line',
    title: 'Fine-Line & Micro-Realism Tattoo Care',
    category: 'Fine-Line',
    description: 'Delicate single-needle and fine line preservation guide for optimal line clarity.',
    steps: [
      'Keep SecondSkin / Saniderm foil on for 24 to 48 hours unless excessive fluid accumulates.',
      'Remove foil under warm running water by pulling gently parallel to skin.',
      'Use ultra-light unscented lotion sparingly — fine line tattoos require minimal heavy grease.',
      'Avoid tight synthetic clothing rubbing directly over delicate line work.',
      'Apply high SPF 50+ sunscreen once completely healed to preserve crisp needle lines.'
    ]
  },
  {
    id: 'pmu',
    title: 'Cosmetic PMU / Powder Brow & Lip Blush Aftercare',
    category: 'PMU',
    description: 'Pigment retention guidelines for microblading, powder brows, and lip blushing.',
    steps: [
      'Gently blot excess lymph fluid with clean sterile tissue every hour for the first 6 hours.',
      'Keep area dry of water, sweat, and steam for 7 days post-treatment.',
      'Apply rice-grain size amount of provided PMU healing balm twice daily with a clean cotton swab.',
      'Do not apply makeup, skin serums, or active AHA/BHA exfoliants near treated area for 10 days.',
      'Expect mild flaking and fading during week 1 — pigment will blossom back during weeks 2-4.'
    ]
  }
];

// GET Templates
app.get('/api/aftercare/templates', (req, res) => res.json(aftercareTemplates));

// The desk gave the client an aftercare sheet (Henry, 2026-10-18): which sheet, for which appointment,
// by whom and when, kept on the client's record so the studio (or a health inspector) can see it was given.
app.post('/api/clients/:id/aftercare', (req, res) => {
  const client = clients.find((c) => c.id === Number(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  const b = req.body || {};
  const tpl = aftercareTemplates.find((t) => t.id === b.template_id);
  if (!tpl) return res.status(400).json({ error: 'Choose an aftercare sheet' });
  const appt = b.appointment_id ? appointments.find((a) => String(a.id) === String(b.appointment_id)) : null;
  if (b.appointment_id && !appt) return res.status(400).json({ error: 'That appointment was not found' });
  const entry = {
    template_id: tpl.id, title: tpl.title,
    lang: AFTERCARE_LANGS.includes(b.lang) ? b.lang : 'en',
    appointment_id: appt ? appt.id : null,
    procedure: appt ? [appt.service_type || appt.service || '', dayOf(appt.datetime || appt.date)].filter(Boolean).join(', ') : '',
    given_by: String(b.given_by || '').slice(0, 80) || 'Front desk',
    given_at: new Date().toISOString()
  };
  client.aftercare_given = [entry].concat(client.aftercare_given || []).slice(0, 200);
  logActivity({ category: 'compliance', action: 'AFTERCARE_GIVEN', title: `Aftercare given: ${client.name}`,
    details: tpl.title + (entry.procedure ? ` (${entry.procedure})` : ''), user: entry.given_by, badgeColor: 'emerald' });
  res.status(201).json({ ok: true, entry, aftercare_given: client.aftercare_given });
});

// POST New Template
app.post('/api/aftercare/templates', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) {
    return res.status(400).json({ error: 'Template title is required' });
  }

  const rawSteps = Array.isArray(req.body.steps)
    ? req.body.steps.map(s => String(s).trim()).filter(Boolean)
    : (req.body.steps ? req.body.steps.split('\n').map(s => s.trim()).filter(Boolean) : []);

  const newTemplate = {
    id: req.body.id || `custom-${Date.now()}`,
    title: title,
    category: req.body.category || 'General',
    description: req.body.description || '',
    steps: rawSteps.length ? rawSteps : ['Follow general studio hygiene guidelines.']
  };

  aftercareTemplates.push(newTemplate);

  logActivity({
    category: 'compliance',
    action: 'AFTERCARE_TEMPLATE_CREATED',
    title: `Aftercare Template Created: ${newTemplate.title}`,
    details: `Created new ${newTemplate.category} aftercare guide with ${newTemplate.steps.length} care steps`,
    user: req.body.staff_name || 'Studio Staff',
    badgeColor: 'purple'
  });

  res.status(201).json(aftercareTemplates);
});

// PATCH / UPDATE Existing Template
app.patch('/api/aftercare/templates/:id', (req, res) => {
  const template = aftercareTemplates.find(t => String(t.id) === String(req.params.id));
  if (!template) {
    return res.status(404).json({ error: 'Aftercare template not found' });
  }

  // one language at a time: English is the sheet itself, another language goes in its translations
  // (Settings, Aftercare sheets); a language left empty prints the English
  const lang = AFTERCARE_LANGS.includes(req.body.lang) ? req.body.lang : 'en';
  const target = lang === 'en' ? template : ((template.translations = template.translations || {})[lang] = template.translations[lang] || {});
  if (req.body.title !== undefined && (String(req.body.title).trim() || lang !== 'en')) target.title = String(req.body.title).trim();
  if (req.body.category) template.category = req.body.category.trim();
  if (req.body.description !== undefined) target.description = String(req.body.description).trim();
  if (req.body.steps !== undefined) {
    const rawSteps = Array.isArray(req.body.steps)
      ? req.body.steps.map(s => String(s).trim()).filter(Boolean)
      : (req.body.steps ? String(req.body.steps).split('\n').map(s => s.trim()).filter(Boolean) : []);
    target.steps = rawSteps;
  }
  if (!template.steps || !template.steps.length) template.steps = ['Follow the studio\'s aftercare advice.'];

  logActivity({
    category: 'compliance',
    action: 'AFTERCARE_TEMPLATE_UPDATED',
    title: `Aftercare Template Updated: ${template.title}`,
    details: `Updated template details and ${template.steps.length} care steps`,
    user: req.body.staff_name || 'Studio Staff',
    badgeColor: 'blue'
  });

  res.json(aftercareTemplates);
});

// DELETE Template
app.delete('/api/aftercare/templates/:id', (req, res) => {
  const index = aftercareTemplates.findIndex(t => String(t.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Aftercare template not found' });
  }

  const removed = aftercareTemplates.splice(index, 1)[0];

  logActivity({
    category: 'compliance',
    action: 'AFTERCARE_TEMPLATE_REMOVED',
    title: `Aftercare Template Deleted: ${removed.title}`,
    details: `Removed custom template "${removed.title}"`,
    user: 'Studio Staff',
    badgeColor: 'red'
  });

  res.json(aftercareTemplates);
});

// Shared Portfolio Gallery & Client Session Work Photos Store
const galleryWorks = [
  {
    id: 101,
    staff_id: 2,
    staff_name: 'Jaxon Vance',
    client_id: 1,
    client_name: 'Alex Rivera',
    service_type: 'Japanese Traditional Sleeve',
    session_date: '2026-07-20',
    session_duration_hours: 3.5,
    notes: 'Shading completed on upper shoulder dragon scale shading. Line work fully healed from Session 1.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23111827"/><path d="M150,300 Q250,80 350,300 T550,200" stroke="%23EF4444" stroke-width="8" fill="none"/><path d="M100,200 Q300,380 500,100" stroke="%23F59E0B" stroke-width="5" stroke-dasharray="10,5" fill="none"/><circle cx="350" cy="180" r="45" stroke="%2334D399" stroke-width="4" fill="%231F2937"/><text x="300" y="360" fill="%23F3F4F6" font-family="sans-serif" font-size="20" font-weight="bold">Japanese Dragon Sleeve - Session 2</text><text x="300" y="385" fill="%239CA3AF" font-family="sans-serif" font-size="14">Artist: Jaxon Vance | Client: Alex Rivera</text></svg>',
    likes_count: 14,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 102,
    staff_id: 3,
    staff_name: 'Maya Lin',
    client_id: 2,
    client_name: 'Samantha Chen',
    service_type: 'Titanium Ear Curation',
    session_date: '2026-07-18',
    session_duration_hours: 1.0,
    notes: 'Triple helix and tragus curation using solid ASTM F-136 titanium bezel-set opal studs.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F172A"/><circle cx="300" cy="200" r="110" fill="none" stroke="%2338BDF8" stroke-width="6"/><circle cx="250" cy="140" r="14" fill="%23F472B6"/><circle cx="285" cy="115" r="14" fill="%23F472B6"/><circle cx="325" cy="105" r="14" fill="%23F472B6"/><circle cx="210" cy="210" r="16" fill="%2338BDF8"/><text x="300" y="360" fill="%23F8FAFC" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Ear Curation - Titanium Opal</text><text x="300" y="385" fill="%2394A3B8" font-family="sans-serif" font-size="14" text-anchor="middle">Artist: Maya Lin | Client: Samantha Chen</text></svg>',
    likes_count: 22,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 103,
    staff_id: 4,
    staff_name: 'Soren Frost',
    client_id: 4,
    client_name: 'Elena Rostova',
    service_type: 'Single-Needle Botanical',
    session_date: '2026-07-22',
    session_duration_hours: 2.2,
    notes: 'Delicate lavender and wild fern forearm piece using 3RL single-needle precision shading.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2318181B"/><path d="M300,320 C280,240 320,160 300,80" stroke="%23A7F3D0" stroke-width="3" fill="none"/><path d="M300,240 Q240,210 220,190" stroke="%2334D399" stroke-width="2" fill="none"/><path d="M300,180 Q360,150 380,130" stroke="%2334D399" stroke-width="2" fill="none"/><circle cx="300" cy="80" r="8" fill="%23F472B6"/><circle cx="285" cy="95" r="6" fill="%23C084FC"/><circle cx="315" cy="95" r="6" fill="%23C084FC"/><text x="300" y="360" fill="%23F4F4F5" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Single-Needle Botanical Fern</text><text x="300" y="385" fill="%23A1A1AA" font-family="sans-serif" font-size="14" text-anchor="middle">Artist: Soren Frost | Client: Elena Rostova</text></svg>',
    likes_count: 31,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 104,
    staff_id: 2,
    staff_name: 'Jaxon Vance',
    client_id: 3,
    client_name: 'Marcus Brody',
    service_type: 'Black & Grey Realism',
    session_date: '2026-07-15',
    session_duration_hours: 4.0,
    notes: 'Pocket watch and compass chest piece with high-contrast smooth gradient drop shadows.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23111827"/><circle cx="300" cy="180" r="75" stroke="%239CA3AF" stroke-width="6" fill="%231F2937"/><line x1="300" y1="180" x2="330" y2="140" stroke="%23F3F4F6" stroke-width="4"/><line x1="300" y1="180" x2="260" y2="180" stroke="%23F59E0B" stroke-width="3"/><text x="300" y="360" fill="%23F3F4F6" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Black &amp; Grey Compass Realism</text><text x="300" y="385" fill="%239CA3AF" font-family="sans-serif" font-size="14" text-anchor="middle">Artist: Jaxon Vance | Client: Marcus Brody</text></svg>',
    likes_count: 19,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString()
  }
];

// Gallery API Routes
// The gallery and a client's "Work and photos" tab are one store (clientTattooWork): a photo added in
// either place shows in both, and a delete removes it from both (GitHub issue #14). galleryWorks is only
// read at start, to move a studio's older gallery photos across (moveGalleryIntoClientWork).
const nextWorkId = () => clientTattooWork.reduce((m, w) => Math.max(m, Number(w.id) || 0), 0) + 1;
// a typed name finds the client when it matches exactly (any case), so the photo lands on the profile
function findClientFor(client_id, client_name) {
  const byId = clients.find(c => c.id === parseInt(client_id, 10));
  if (byId) return byId;
  const name = String(client_name || '').trim().toLowerCase();
  return name ? clients.find(c => String(c.name || '').trim().toLowerCase() === name) || null : null;
}
function galleryView(w) {
  const artist = staff.find(s => s.id === parseInt(w.staff_id, 10)) || staff.find(s => s.name && s.name === w.artist);
  return {
    id: w.id,
    staff_id: artist ? artist.id : null,
    staff_name: w.artist || (artist ? artist.name : ''),
    client_id: w.client_id || null,
    client_name: w.client_name || '',
    service_type: w.title || w.category || '',
    session_date: w.date || '',
    session_duration_hours: w.session_duration_hours || null,
    notes: w.notes || w.description || '',
    image_url: w.image_url || '',
    likes_count: w.likes_count || 0,
    created_at: w.created_at || w.date || ''
  };
}
function workFromGallery(g, id) {
  return {
    id,
    client_id: g.client_id || null,
    client_name: g.client_name || '',
    title: g.service_type || '',
    category: 'Tattoo Session',
    date: g.session_date || '',
    artist: g.staff_name || '',
    staff_id: g.staff_id || null,
    session_duration_hours: g.session_duration_hours || null,
    image_url: g.image_url || '',
    notes: g.notes || '',
    description: '',
    tags: [],
    likes_count: g.likes_count || 0,
    created_at: g.created_at || new Date().toISOString()
  };
}
function moveGalleryIntoClientWork() {
  if (!galleryWorks.length) return false;
  for (const g of galleryWorks.splice(0, galleryWorks.length).reverse()) {
    const c = findClientFor(g.client_id, g.client_name);
    clientTattooWork.unshift(workFromGallery({ ...g, client_id: c ? c.id : null, client_name: c ? c.name : g.client_name }, nextWorkId()));
  }
  return true;
}

app.get('/api/gallery', (req, res) => {
  let result = clientTattooWork.map(galleryView);
  const { staff_id, client_id, search } = req.query;

  if (staff_id) {
    result = result.filter(w => w.staff_id === parseInt(staff_id));
  }
  if (client_id) {
    result = result.filter(w => w.client_id === parseInt(client_id));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(w => [w.service_type, w.notes, w.client_name, w.staff_name].join(' ').toLowerCase().includes(q));
  }

  res.json(result);
});

app.post('/api/gallery', (req, res) => {
  const { staff_id, client_id, client_name, service_type, session_date, session_duration_hours, image_url, notes } = req.body;
  if (!image_url) return res.status(400).json({ error: 'Take or choose a photo first' });

  const staffMember = staff.find(s => s.id === parseInt(staff_id));
  const clientObj = findClientFor(client_id, client_name);

  const work = workFromGallery({
    staff_id: staffMember ? staffMember.id : null,
    staff_name: staffMember ? staffMember.name : '',
    client_id: clientObj ? clientObj.id : null,
    client_name: clientObj ? clientObj.name : String(client_name || '').trim(),
    service_type: service_type || '',
    session_date: session_date || studioDay(),
    session_duration_hours: parseFloat(session_duration_hours) || null,
    notes: notes || '',
    image_url
  }, nextWorkId());
  clientTattooWork.unshift(work);

  logActivity({
    category: 'staff',
    action: 'GALLERY_WORK_UPLOADED',
    title: `New Portfolio Work Uploaded${work.artist ? ': ' + work.artist : ''}`,
    details: `Uploaded session photo${work.client_name ? ' for ' + work.client_name : ''} (${work.title || 'work'}, ${work.date})`,
    user: work.artist || 'Studio Staff',
    badgeColor: 'purple'
  });

  res.status(201).json(galleryView(work));
});

app.delete('/api/gallery/:id', (req, res) => {
  const index = clientTattooWork.findIndex(w => Number(w.id) === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Work not found' });
  const removed = clientTattooWork.splice(index, 1)[0];
  res.json({ success: true, removed: galleryView(removed) });
});

// Before & After pairs: two portfolio photos (the same photos as the client profiles), linked by id.
// A pair whose photo was deleted is no longer listed.
const galleryPairs = [];
app.get('/api/gallery-pairs', (req, res) => {
  const byId = new Map(clientTattooWork.map((w) => [Number(w.id), galleryView(w)]));
  res.json(galleryPairs.filter((p) => byId.has(p.before_id) && byId.has(p.after_id))
    .map((p) => ({ ...p, before: byId.get(p.before_id), after: byId.get(p.after_id) })));
});
app.post('/api/gallery-pairs', (req, res) => {
  const b = req.body || {};
  const before_id = parseInt(b.before_id), after_id = parseInt(b.after_id);
  const has = (id) => clientTattooWork.some((w) => Number(w.id) === id);
  if (!has(before_id) || !has(after_id)) return res.status(400).json({ error: 'Pick a Before and an After photo from the gallery' });
  if (before_id === after_id) return res.status(400).json({ error: 'Before and After must be two different photos' });
  const pair = { id: galleryPairs.reduce((m, x) => Math.max(m, x.id), 0) + 1, title: String(b.title || '').trim(), notes: String(b.notes || '').trim(),
    before_id, after_id, created_at: new Date().toISOString() };
  galleryPairs.unshift(pair);
  res.status(201).json(pair);
});
app.delete('/api/gallery-pairs/:id', (req, res) => {
  const idx = galleryPairs.findIndex((p) => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Pair not found' });
  res.json({ success: true, removed: galleryPairs.splice(idx, 1)[0] });
});

// Tattoo & PMU Flash Gallery Store
const flashDesigns = [
  {
    id: 501,
    title: 'Sacred Geometry Panther & Dagger',
    artist_id: 2,
    artist_name: 'Jaxon Vance',
    category: 'Tattoo - Traditional',
    price: 280,
    deposit: 50,
    est_duration_hours: 2.5,
    status: 'available', // available, claimed, reserved
    claimed_by_client_name: null,
    needle_specs: 'Kwadron 7RL 0.35mm Line + 11RM Bugpin Shading',
    pigment_palette: 'Dynamic Triple Black, Eternal Crimson Red, Golden Yellow',
    notes: 'Classic bold American Traditional panther head pierced with ornate dagger. Ideal for forearm or calf placement.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23111827"/><path d="M180,260 L420,140 M400,120 L440,160 L410,170 L370,130 Z" stroke="%23F59E0B" stroke-width="8" fill="%23FBBF24"/><path d="M220,120 C280,80 340,120 380,200 C340,280 260,280 200,220 Z" fill="%231F2937" stroke="%23EF4444" stroke-width="5"/><circle cx="270" cy="170" r="12" fill="%23F59E0B"/><path d="M230,220 Q280,260 330,210" stroke="%23F3F4F6" stroke-width="6" fill="none"/><text x="300" y="355" fill="%23F9FAFB" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Panther &amp; Dagger - Traditional Flash</text><text x="300" y="380" fill="%2334D399" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">$280 ($50 Deposit) • Est: 2.5h • Kwadron 7RL</text></svg>',
    stencil_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FFFFFF"/><path d="M180,260 L420,140 M400,120 L440,160 L410,170 L370,130 Z" stroke="%23000000" stroke-width="4" fill="none"/><path d="M220,120 C280,80 340,120 380,200 C340,280 260,280 200,220 Z" fill="none" stroke="%23000000" stroke-width="4"/><circle cx="270" cy="170" r="12" fill="none" stroke="%23000000" stroke-width="3"/><path d="M230,220 Q280,260 330,210" stroke="%23000000" stroke-width="4" fill="none"/><text x="300" y="360" fill="%23000000" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">STENCIL LINE ART - PANTHER &amp; DAGGER</text></svg>',
    likes_count: 28,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 502,
    title: 'Botanical Lunar Moth & Cherry Blossom',
    artist_id: 4,
    artist_name: 'Soren Frost',
    category: 'Tattoo - Neo-Traditional',
    price: 350,
    deposit: 75,
    est_duration_hours: 3.5,
    status: 'available',
    claimed_by_client_name: null,
    needle_specs: '3RL 0.25mm Fine Line + 9Mag Soft Shading',
    pigment_palette: 'Solid Ink Plum, Sage Green, Deep Amethyst, Soft Gold',
    notes: 'Symmetrical lunar moth resting on blooming cherry blossom sprigs. Perfect center chest or sternum piece.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F172A"/><path d="M300,100 L200,220 Q300,250 300,320 Q300,250 400,220 Z" fill="%238B5CF6" stroke="%23C084FC" stroke-width="4"/><circle cx="300" cy="140" r="18" fill="%23FBBF24"/><circle cx="240" cy="180" r="12" fill="%23EC4899"/><circle cx="360" cy="180" r="12" fill="%23EC4899"/><text x="300" y="355" fill="%23F8FAFC" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Lunar Moth &amp; Cherry Blossom Flash</text><text x="300" y="380" fill="%2334D399" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">$350 ($75 Deposit) • Est: 3.5h • 3RL Fine Line</text></svg>',
    stencil_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FFFFFF"/><path d="M300,100 L200,220 Q300,250 300,320 Q300,250 400,220 Z" fill="none" stroke="%23000000" stroke-width="3"/><circle cx="300" cy="140" r="18" fill="none" stroke="%23000000" stroke-width="3"/><circle cx="240" cy="180" r="12" fill="none" stroke="%23000000" stroke-width="2"/><circle cx="360" cy="180" r="12" fill="none" stroke="%23000000" stroke-width="2"/><text x="300" y="360" fill="%23000000" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">STENCIL LINE ART - LUNAR MOTH</text></svg>',
    likes_count: 42,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 503,
    title: 'Powder Ombré Gradient Eyebrows',
    artist_id: 3,
    artist_name: 'Maya Lin',
    category: 'PMU - Powder Brows',
    price: 450,
    deposit: 100,
    est_duration_hours: 2.0,
    status: 'available',
    claimed_by_client_name: null,
    needle_specs: '1RL 0.25mm Nano Cartridge (0.25mm Taper)',
    pigment_palette: 'Li Pigments Dark Fudge & Warm Hazelnut (Fitzpatrick III-V)',
    notes: 'Soft pixelated powder effect with airy front transitions and defined tails. Includes 6-week touch-up session.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2318181B"/><path d="M120,180 C200,140 320,130 460,190 C340,175 220,185 120,180 Z" fill="%23D97706" opacity="0.85" stroke="%23FBBF24" stroke-width="2"/><path d="M140,220 C220,180 340,170 480,230 C360,215 240,225 140,220 Z" fill="%23B45309" opacity="0.85" stroke="%23FBBF24" stroke-width="2"/><text x="300" y="355" fill="%23F4F4F5" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Powder Ombré Brows - PMU Master Flash</text><text x="300" y="380" fill="%2334D399" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">$450 ($100 Deposit) • Est: 2.0h • 1RL 0.25 Nano</text></svg>',
    stencil_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FFFFFF"/><path d="M120,180 C200,140 320,130 460,190 C340,175 220,185 120,180 Z" fill="none" stroke="%23000000" stroke-width="3"/><path d="M140,220 C220,180 340,170 480,230 C360,215 240,225 140,220 Z" fill="none" stroke="%23000000" stroke-width="3"/><text x="300" y="360" fill="%23000000" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">PMU MAP STENCIL - POWDER BROWS</text></svg>',
    likes_count: 51,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 504,
    title: 'Aquarelle Lip Blush Tint & Contour',
    artist_id: 3,
    artist_name: 'Maya Lin',
    category: 'PMU - Lip Blush',
    price: 480,
    deposit: 100,
    est_duration_hours: 2.5,
    status: 'available',
    claimed_by_client_name: null,
    needle_specs: '3RS 0.30mm Shader Cartridge for seamless color saturation',
    pigment_palette: 'Permablend Sweet Melissa & Dusty Pink Neutralizer',
    notes: 'Natural translucent lip flush enhancing border definition and restoring youthfulness to pale or uneven lips.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23111827"/><path d="M180,200 Q250,150 300,180 Q350,150 420,200 Q300,300 180,200 Z" fill="%23F43F5E" opacity="0.9" stroke="%23FDA4AF" stroke-width="4"/><text x="300" y="355" fill="%23F9FAFB" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Aquarelle Lip Blush - Cosmetic PMU</text><text x="300" y="380" fill="%2334D399" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">$480 ($100 Deposit) • Est: 2.5h • 3RS Shader</text></svg>',
    stencil_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FFFFFF"/><path d="M180,200 Q250,150 300,180 Q350,150 420,200 Q300,300 180,200 Z" fill="none" stroke="%23000000" stroke-width="3"/><text x="300" y="360" fill="%23000000" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">PMU MAP STENCIL - LIP BLUSH CONTOUR</text></svg>',
    likes_count: 38,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 505,
    title: 'Single-Needle Astronomical Constellation & Compass',
    artist_id: 4,
    artist_name: 'Soren Frost',
    category: 'Tattoo - Fine-Line',
    price: 180,
    deposit: 40,
    est_duration_hours: 1.5,
    status: 'available',
    claimed_by_client_name: null,
    needle_specs: '1RL 0.20mm Precision + 3RL Micro Shading',
    pigment_palette: 'Panthera Dark Sumi Black',
    notes: 'Micro-fine geometric star map and celestial compass dial. Highly popular for wrist or inner forearm.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F172A"/><circle cx="300" cy="180" r="90" stroke="%2338BDF8" stroke-width="2" fill="none" stroke-dasharray="6,4"/><line x1="300" y1="70" x2="300" y2="290" stroke="%2360A5FA" stroke-width="2"/><line x1="190" y1="180" x2="410" y2="180" stroke="%2360A5FA" stroke-width="2"/><circle cx="300" cy="180" r="8" fill="%23FBBF24"/><text x="300" y="355" fill="%23F8FAFC" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Constellation &amp; Compass - Fine Line</text><text x="300" y="380" fill="%2334D399" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">$180 ($40 Deposit) • Est: 1.5h • 1RL Precision</text></svg>',
    stencil_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FFFFFF"/><circle cx="300" cy="180" r="90" stroke="%23000000" stroke-width="2" fill="none" stroke-dasharray="4,3"/><line x1="300" y1="70" x2="300" y2="290" stroke="%23000000" stroke-width="2"/><line x1="190" y1="180" x2="410" y2="180" stroke="%23000000" stroke-width="2"/><circle cx="300" cy="180" r="8" fill="none" stroke="%23000000" stroke-width="2"/><text x="300" y="360" fill="%23000000" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">STENCIL LINE ART - ASTRONOMICAL COMPASS</text></svg>',
    likes_count: 33,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 506,
    title: 'Irezumi Koi Fish & Wave Swirls',
    artist_id: 2,
    artist_name: 'Jaxon Vance',
    category: 'Tattoo - Japanese Irezumi',
    price: 420,
    deposit: 80,
    est_duration_hours: 4.0,
    status: 'claimed',
    claimed_by_client_name: 'Alex Rivera',
    needle_specs: '9RL Bold Line + 15RM Curved Magnum Shading',
    pigment_palette: 'Intenze Obsidian Black, Vermillion Red, Ocean Blue',
    notes: 'Upstream swimming koi fish surrounded by swirling Japanese finger waves and maple leaves.',
    image_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23111827"/><path d="M180,240 Q280,100 420,220 Q320,320 180,240 Z" fill="%233B82F6" stroke="%2360A5FA" stroke-width="5"/><path d="M220,180 Q300,120 380,180" stroke="%23EF4444" stroke-width="6" fill="none"/><text x="300" y="355" fill="%23F9FAFB" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">Japanese Koi &amp; Finger Waves (Claimed)</text><text x="300" y="380" fill="%23FBBF24" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Claimed by Alex Rivera • $420 • 4.0h</text></svg>',
    stencil_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FFFFFF"/><path d="M180,240 Q280,100 420,220 Q320,320 180,240 Z" fill="none" stroke="%23000000" stroke-width="4"/><path d="M220,180 Q300,120 380,180" stroke="%23000000" stroke-width="3" fill="none"/><text x="300" y="360" fill="%23000000" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">STENCIL LINE ART - IREZUMI KOI FISH</text></svg>',
    likes_count: 64,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

// Flash Gallery API Endpoints
// A blank field stays blank: no invented price, deposit, time, needles or pigments (a blank price
// prints as POA). Status: available, claimed (one client has it) or repeatable (sold again and again).
// Each claim is kept in `bookings` (client, date), so the studio can see what sells.
const flashSheets = [];
const FLASH_STATUSES = ['available', 'claimed', 'repeatable'];
const flashNum = (v) => (v === '' || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v));
const flashText = (v) => (v === undefined || v === null ? '' : String(v).trim());
const nextFlashId = () => flashDesigns.reduce((m, f) => Math.max(m, Number(f.id) || 0), 500) + 1;

// the editable fields of a design, from a request body; only the fields the body has
function flashFields(body) {
  const out = {};
  if ('title' in body) out.title = flashText(body.title);
  if ('category' in body) out.category = flashText(body.category);
  if ('size' in body) out.size = flashText(body.size);
  if ('price' in body) out.price = flashNum(body.price);
  if ('deposit' in body) out.deposit = flashNum(body.deposit);
  if ('est_duration_hours' in body) out.est_duration_hours = flashNum(body.est_duration_hours);
  if ('needle_specs' in body) out.needle_specs = flashText(body.needle_specs);
  if ('pigment_palette' in body) out.pigment_palette = flashText(body.pigment_palette);
  if ('notes' in body) out.notes = flashText(body.notes);
  if ('sheet_id' in body) out.sheet_id = flashNum(body.sheet_id);
  if ('span' in body) out.span = Number(body.span) === 2 ? 2 : 1;
  if ('artist_id' in body) {
    const artist = staff.find((s) => String(s.id) === String(body.artist_id));
    out.artist_id = artist ? artist.id : null;
    out.artist_name = artist ? artist.name : '';
  }
  if (body.image_url) out.image_url = String(body.image_url);
  if (body.status && FLASH_STATUSES.includes(body.status) && body.status !== 'claimed') out.status = body.status;
  return out;
}

app.get('/api/flash', (req, res) => {
  let result = [...flashDesigns];
  const { category, status, search } = req.query;

  if (category) {
    result = result.filter(f => f.category === category);
  }
  if (status) {
    result = result.filter(f => f.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(f => [f.title, f.category, f.notes, f.artist_name].some((t) => String(t || '').toLowerCase().includes(q)));
  }

  res.json(result);
});

app.post('/api/flash', (req, res) => {
  const fields = flashFields(req.body || {});
  if (!fields.title) return res.status(400).json({ error: 'A flash design needs a title' });
  const newFlash = {
    id: nextFlashId(),
    title: '', artist_id: null, artist_name: '', category: '', size: '',
    price: null, deposit: null, est_duration_hours: null,
    needle_specs: '', pigment_palette: '', notes: '', image_url: '',
    sheet_id: null, span: 1, order: 0,
    status: 'available', claimed_by_client_id: null, claimed_by_client_name: null, bookings: [],
    likes_count: 0,
    created_at: new Date().toISOString(),
    ...fields,
  };
  // new designs go first, ahead of the others in their sheet
  flashDesigns.forEach((f) => { f.order = (Number(f.order) || 0) + 1; });
  flashDesigns.unshift(newFlash);

  logActivity({
    category: 'staff',
    action: 'FLASH_DESIGN_CREATED',
    title: `New Flash Design Added: ${newFlash.title}`,
    details: [newFlash.category, newFlash.artist_name].filter(Boolean).join(' · '),
    user: newFlash.artist_name || undefined,
    badgeColor: 'purple'
  });

  res.status(201).json(newFlash);
});

app.put('/api/flash/:id', (req, res) => {
  const flash = flashDesigns.find(f => f.id === parseInt(req.params.id));
  if (!flash) return res.status(404).json({ error: 'Flash design not found' });
  const fields = flashFields(req.body || {});
  if ('title' in fields && !fields.title) return res.status(400).json({ error: 'A flash design needs a title' });
  // a claimed design stays claimed until it is made available again
  if (flash.status === 'claimed') delete fields.status;
  Object.assign(flash, fields);
  res.json(flash);
});

// the order on the sheet: ids in the new order
app.put('/api/flash-order', (req, res) => {
  const ids = Array.isArray(req.body && req.body.ids) ? req.body.ids.map(Number) : [];
  ids.forEach((id, i) => { const f = flashDesigns.find((x) => x.id === id); if (f) f.order = i; });
  res.json({ success: true });
});

app.post('/api/flash/:id/claim', (req, res) => {
  const flash = flashDesigns.find(f => f.id === parseInt(req.params.id));
  if (!flash) return res.status(404).json({ error: 'Flash design not found' });
  if (flash.status === 'claimed') return res.status(409).json({ error: 'This design is already claimed' });
  const client = clients.find((c) => String(c.id) === String(req.body.client_id));
  const clientName = client ? client.name : flashText(req.body.client_name);
  if (!clientName) return res.status(400).json({ error: 'Choose the client' });
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(req.body.date || '')) ? req.body.date : studioDay();

  if (!Array.isArray(flash.bookings)) flash.bookings = [];
  flash.bookings.push({ client_id: client ? client.id : null, client_name: clientName, date });
  if (flash.status !== 'repeatable') {
    flash.status = 'claimed';
    flash.claimed_by_client_id = client ? client.id : null;
    flash.claimed_by_client_name = clientName;
  }

  logActivity({
    category: 'appointment',
    action: 'FLASH_CLAIMED',
    title: `Flash Design Claimed: ${flash.title}`,
    details: `Claimed by client ${clientName} on ${date}` + (flash.artist_name ? `. Artist: ${flash.artist_name}` : ''),
    user: 'Studio Front Desk',
    badgeColor: 'green'
  });

  res.json({ success: true, flash });
});

// make a claimed design available again: the reservation is cancelled, so its booking goes too
app.post('/api/flash/:id/release', (req, res) => {
  const flash = flashDesigns.find(f => f.id === parseInt(req.params.id));
  if (!flash) return res.status(404).json({ error: 'Flash design not found' });
  if (flash.status !== 'claimed') return res.status(409).json({ error: 'This design is not claimed' });
  if (Array.isArray(flash.bookings) && flash.bookings.length) flash.bookings.pop();
  flash.status = 'available';
  flash.claimed_by_client_id = null;
  flash.claimed_by_client_name = null;
  res.json({ success: true, flash });
});

app.delete('/api/flash/:id', (req, res) => {
  const idx = flashDesigns.findIndex(f => f.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Flash design not found' });

  const removed = flashDesigns.splice(idx, 1)[0];
  res.json({ success: true, removed });
});

// Flash sheets: a named set of designs with the header a printed sheet carries
const sheetFields = (b) => ({ name: flashText(b.name), artist: flashText(b.artist), contact: flashText(b.contact), date: flashText(b.date) });
app.get('/api/flash-sheets', (req, res) => res.json(flashSheets));
app.post('/api/flash-sheets', (req, res) => {
  const s = sheetFields(req.body || {});
  if (!s.name) return res.status(400).json({ error: 'A sheet needs a name' });
  const sheet = { id: flashSheets.reduce((m, x) => Math.max(m, x.id), 0) + 1, ...s };
  flashSheets.push(sheet);
  res.status(201).json(sheet);
});
app.put('/api/flash-sheets/:id', (req, res) => {
  const sheet = flashSheets.find((s) => s.id === parseInt(req.params.id));
  if (!sheet) return res.status(404).json({ error: 'Sheet not found' });
  const s = sheetFields(req.body || {});
  if (!s.name) return res.status(400).json({ error: 'A sheet needs a name' });
  Object.assign(sheet, s);
  res.json(sheet);
});
// deleting a sheet keeps its designs: they go back to "no sheet"
app.delete('/api/flash-sheets/:id', (req, res) => {
  const idx = flashSheets.findIndex((s) => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Sheet not found' });
  const [removed] = flashSheets.splice(idx, 1);
  flashDesigns.forEach((f) => { if (f.sheet_id === removed.id) f.sheet_id = null; });
  res.json({ success: true, removed });
});

// Studio Stations & Sanitization Data
let studioStations = [
  { id: 1, name: 'Station 1 — Main Studio', type: 'Tattoo Booth', status: 'ready', assignedStaff: 'Jaxon Vance', currentClient: 'Elena Rostova', lastSanitized: new Date(Date.now() - 45*60000).toISOString(), autoclaveCycle: 'CYCLE-8041-PASSED' },
  { id: 2, name: 'Station 2 — VIP Private Suite', type: 'Custom Art Suite', status: 'in_use', assignedStaff: 'Kai Thorne', currentClient: 'Marcus Aurelius Vance', lastSanitized: new Date(Date.now() - 120*60000).toISOString(), autoclaveCycle: 'CYCLE-8040-PASSED' },
  { id: 3, name: 'Station 3 — Piercing Suite B', type: 'Aseptic Piercing Suite', status: 'ready', assignedStaff: 'Maya Lin', currentClient: null, lastSanitized: new Date(Date.now() - 15*60000).toISOString(), autoclaveCycle: 'CYCLE-8042-PASSED' },
  { id: 4, name: 'Station 4 — Fine-Line Studio', type: 'Fine-Line Tattoo', status: 'sanitizing', assignedStaff: 'Soren Frost', currentClient: null, lastSanitized: new Date().toISOString(), autoclaveCycle: 'CYCLE-8043-IN_PROGRESS' }
];

// API Endpoints for Studio Stations
app.get('/api/stations', (req, res) => {
  res.json(studioStations);
});

// The studio's own stations (Henry, 2026-10-18: a branding area, piercing, tattoo...): there were always
// four, with no way to add, rename or remove one. Each can have a type and a usual artist.
const stationFields = (b, st) => {
  if (b.name !== undefined) st.name = String(b.name).trim().slice(0, 60) || st.name;
  if (b.type !== undefined) st.type = String(b.type).trim().slice(0, 40);
  if (b.assignedStaff !== undefined) st.assignedStaff = String(b.assignedStaff).trim().slice(0, 80);
  return st;
};
app.post('/api/stations', (req, res) => {
  const name = String((req.body || {}).name || '').trim();
  if (!name) return res.status(400).json({ error: 'Give the station a name' });
  const id = studioStations.length ? Math.max(...studioStations.map((s) => Number(s.id) || 0)) + 1 : 1;
  const st = stationFields(req.body, { id, name, type: '', status: 'ready', currentClient: null, assignedStaff: '', autoclaveCycle: '', lastSanitized: null });
  studioStations.push(st);
  logActivity({ category: 'system', action: 'STATION_ADDED', title: `Station added: ${st.name}`, details: st.type || '', user: req.body.user || 'Admin Manager', badgeColor: 'blue' });
  res.status(201).json(st);
});
app.patch('/api/stations/:id', (req, res) => {
  const st = studioStations.find((s) => s.id === Number(req.params.id));
  if (!st) return res.status(404).json({ error: 'Station not found' });
  stationFields(req.body || {}, st);
  res.json(st);
});
app.delete('/api/stations/:id', (req, res) => {
  const i = studioStations.findIndex((s) => s.id === Number(req.params.id));
  if (i < 0) return res.status(404).json({ error: 'Station not found' });
  const [gone] = studioStations.splice(i, 1);
  logActivity({ category: 'system', action: 'STATION_REMOVED', title: `Station removed: ${gone.name}`, details: '', user: 'Admin Manager', badgeColor: 'amber' });
  res.json({ ok: true });
});

app.post('/api/stations/:id/status', (req, res) => {
  const station = studioStations.find(s => s.id === parseInt(req.params.id));
  if (!station) return res.status(404).json({ error: 'Station not found' });
  const { status, assignedStaff, currentClient } = req.body;
  if (status) station.status = status;
  if (assignedStaff !== undefined) station.assignedStaff = assignedStaff;
  if (currentClient !== undefined) station.currentClient = currentClient;

  // Broadcast to Activity Feed
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    title: `Station ${station.name} Status Changed`,
    category: 'compliance',
    details: `Status updated to ${status.toUpperCase()} by studio manager. Staff: ${station.assignedStaff || 'Unassigned'}`,
    user: station.assignedStaff || 'Studio Staff'
  };
  activityLogs.unshift(newLog);
  broadcastSseEvent('activity_log', newLog);

  res.json({ success: true, station });
});

// Studio Comprehensive Settings Engine (Studio Owner Configurable)
let studioGeneralSettings = {
  studio_name: 'POLI STUDIO CRM Tattoo & Piercing',
  vat_rate: 20.0,
  vat_enabled: true,
  vat_number: '',
  default_currency: 'USD ($)',
  theme_mode: 'dark',
  language: 'en',
  audio_theme: 'classic',
  sms_reminders: true,
  email_notifications: true,
  live_stream: true,
  auto_sync: true,
  global_reorder_threshold: 10,
  category_reorder_thresholds: {
    'Needles': 15,
    'Inks': 5,
    'Tubes & Grips': 10,
    'Jewelry': 20,
    'Supplies': 25,
    'Consumables': 20,
    'Sanitation & Hygiene': 12,
    'Aftercare': 10,
    'Machines & Parts': 3,
    'Piercing': 15,
    'PPE': 20,
    'Equipment': 5
  },
  updated_by: 'Studio Owner',
  updated_at: new Date().toISOString()
};

// =========================================================================
// 📦 INVENTORY CATEGORY REORDER THRESHOLDS & PO REQUISITION ENDPOINTS
// =========================================================================

// Helper to resolve effective threshold for an item using category overrides
function getItemEffectiveThreshold(item) {
  if (!item) return 10;
  const cat = item.item_type || item.category || 'Supplies';
  const customThresholds = (studioGeneralSettings && studioGeneralSettings.category_reorder_thresholds) || {};
  if (customThresholds[cat] !== undefined) {
    return Number(customThresholds[cat]);
  }
  for (const [k, v] of Object.entries(customThresholds)) {
    if (k.toLowerCase() === cat.toLowerCase()) return Number(v);
  }
  if (item.reorder_point !== undefined && item.reorder_point !== null) {
    return Number(item.reorder_point);
  }
  return (studioGeneralSettings && studioGeneralSettings.global_reorder_threshold) || 10;
}

// ========================================================
// 🚀 6 NON-AI STUDIO OPERATIONAL ENHANCEMENT ENDPOINTS
// ========================================================

// 3. Autoclave & Sterilization Compliance Inspection Audit Vault
const autoclaveLogs = [
  { id: 301, autoclave_id: 'STATIM-2000-A1', station: 'Station #1 (Main Floor)', cycle_number: 1042, date_run: '2025-01-25 08:30', temperature_c: 134, pressure_bar: 2.1, duration_minutes: 18, spore_test_result: 'PASS', indicator_strip: 'TURNED_BLACK', technician: 'Jaxon Vance', status: 'VERIFIED_SAFE', notes: 'Daily morning spore check & pouch validation passed.' },
  { id: 302, autoclave_id: 'TUTTNAUER-3870-B2', station: 'Piercing Suite B', cycle_number: 889, date_run: '2025-01-24 09:15', temperature_c: 121, pressure_bar: 1.2, duration_minutes: 30, spore_test_result: 'PASS', indicator_strip: 'TURNED_BLACK', technician: 'Elena Rostova', status: 'VERIFIED_SAFE', notes: 'Bi-weekly biological spore test certified by lab.' }
];

app.get('/api/compliance/autoclave-logs', (req, res) => {
  // the rate of the cycles whose spore test was recorded: no cycles is no rate (it said 100%, inspector ready)
  const tested = autoclaveLogs.filter(l => l.spore_test_result === 'PASS' || l.spore_test_result === 'FAIL');
  const complianceRate = tested.length > 0 ? Math.round((tested.filter(l => l.spore_test_result === 'PASS').length / tested.length) * 100) : null;

  res.json({
    success: true,
    total_runs: autoclaveLogs.length,
    compliance_rate_percent: complianceRate,
    inspector_ready: complianceRate !== null && complianceRate >= 95,
    logs: autoclaveLogs
  });
});

// A sterilization record holds only what the studio entered: a missing temperature or spore test is
// "not recorded", never a passing value (it filled in 134 °C, 2.1 bar, 18 min, PASS, a strip that
// turned black, an autoclave and a technician nobody entered).
app.post('/api/compliance/autoclave-logs', (req, res) => {
  const { autoclave_id, station, cycle_number, temperature_c, pressure_bar, duration_minutes, spore_test_result, indicator_strip, technician, notes } = req.body || {};
  const text = (v) => String(v ?? '').trim();
  const num = (v) => (text(v) === '' || !Number.isFinite(Number(v)) ? null : Number(v));
  const result = ['PASS', 'FAIL'].includes(text(spore_test_result).toUpperCase()) ? text(spore_test_result).toUpperCase() : null;
  const given = [autoclave_id, station, cycle_number, temperature_c, pressure_bar, duration_minutes, spore_test_result, indicator_strip, technician, notes].some((v) => text(v) !== '');
  if (!given) return res.status(400).json({ error: 'Enter the details of the cycle' });

  const newLog = {
    id: Date.now(),
    autoclave_id: text(autoclave_id),
    station: text(station),
    cycle_number: num(cycle_number),
    date_run: studioDay() + ' ' + new Date().toLocaleTimeString('sv').slice(0, 5),
    temperature_c: num(temperature_c),
    pressure_bar: num(pressure_bar),
    duration_minutes: num(duration_minutes),
    spore_test_result: result,
    indicator_strip: text(indicator_strip) || null,
    technician: text(technician),
    status: result === 'PASS' ? 'VERIFIED_SAFE' : result === 'FAIL' ? 'QUARANTINE_WARNING' : 'NOT_RECORDED',
    notes: text(notes)
  };

  autoclaveLogs.unshift(newLog);

  logActivity({
    category: 'compliance',
    action: 'AUTOCLAVE_CYCLE_LOGGED',
    title: 'Autoclave cycle logged' + (newLog.autoclave_id ? ': ' + newLog.autoclave_id : '') + (newLog.cycle_number !== null ? ` (#${newLog.cycle_number})` : ''),
    details: [newLog.technician && 'Tech: ' + newLog.technician, 'Spore test: ' + (newLog.spore_test_result || 'not recorded'),
      newLog.temperature_c !== null && `Temp: ${newLog.temperature_c}°C`].filter(Boolean).join(' | '),
    user: newLog.technician || 'Studio',
    badgeColor: newLog.spore_test_result === 'PASS' ? 'blue' : newLog.spore_test_result === 'FAIL' ? 'red' : 'gray'
  });

  res.status(201).json({ success: true, log: newLog });
});

// End-of-day sanitization checklists. They were kept in the browser that saved them: a log saved on the
// tablet could be seen nowhere else, and nowhere at all (Henry, 2026-10-22: "where is this info?").
const sanitizationLogs = [];
app.get('/api/compliance/sanitization-logs', (req, res) => res.json(sanitizationLogs));
app.post('/api/compliance/sanitization-logs', (req, res) => {
  const { supervisor, autoclave_cycle, notes, items, timestamp } = req.body || {};
  const text = (v) => String(v ?? '').trim();
  const list = (Array.isArray(items) ? items : []).map((i) => ({ item: text(i && i.item), done: !!(i && i.done) })).filter((i) => i.item);
  if (!list.length) return res.status(400).json({ error: 'The checklist is empty' });
  // a log moved from a browser keeps the time it was saved there
  const when = timestamp && !Number.isNaN(Date.parse(timestamp)) && Date.parse(timestamp) <= Date.now() ? new Date(timestamp).toISOString() : new Date().toISOString();
  const log = { id: Date.now() + Math.floor(Math.random() * 1000), supervisor: text(supervisor), autoclave_cycle: text(autoclave_cycle), notes: text(notes),
    items: list, completed: list.filter((i) => i.done).length, total: list.length, timestamp: when };
  sanitizationLogs.unshift(log);
  sanitizationLogs.sort((x, y) => y.timestamp.localeCompare(x.timestamp));
  logActivity({
    category: 'compliance', action: 'SANITIZATION_LOGGED',
    title: `End-of-day sanitization logged (${log.completed} / ${log.total})`,
    details: [log.autoclave_cycle && 'Autoclave cycle: ' + log.autoclave_cycle, log.notes].filter(Boolean).join(' | '),
    user: log.supervisor || 'Studio', badgeColor: log.completed === log.total ? 'green' : 'amber'
  });
  res.status(201).json({ success: true, log });
});

// 6. Procedure Supply Overhead Margin & Studio Profitability Calculator
app.get('/api/financials/margin-calculator', (req, res) => {
  const paid = financial.filter((f) => f.status === 'completed' && f.type !== 'refund').reduce((t, f) => t + Number(f.amount || 0), 0);
  let supplies = 0;
  let unpriced = 0;
  procedureConsumptions.forEach((log) => (log.items || []).forEach((item) => {
    const stock = inventory.find((i) => i.id === item.id || i.name === item.name);
    const cost = stock ? Number(stock.unit_cost != null ? stock.unit_cost : stock.price) : NaN;
    if (Number.isFinite(cost)) supplies += (Number(item.qty) || 1) * cost;
    else unpriced++;
  }));
  res.json({ success: true, payments_recorded: paid, supplies_used_cost: supplies, difference: paid - supplies,
    procedures_logged: procedureConsumptions.length, items_without_cost: unpriced });
});

// ==========================================
// 💾 DATABASE SNAPSHOT BACKUP APIs
// ==========================================
let lastDatabaseSnapshotTimestamp = null; // null = never backed up (it was set to "26 hours ago")

// Backups: storage/backups/ on this computer, and the same file copied to a second folder the
// studio chooses (a USB stick, or a Google Drive / OneDrive / Dropbox folder) so a dead disk or
// a stolen PC does not take every copy with it. One automatic backup a day, the last 30 kept.
const BACKUP_DIR = path.join(STORAGE_DIR, 'backups');
const AUTO_BACKUPS_KEPT = 30;
let backupConfig = { copyTo: '', lastCopyError: null, lastCopyTime: null };

async function writeBackup(prefix) {
  saveAll(); // everything in memory is in the file before it is copied
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString();
  const filename = `${prefix}_${stamp.replace(/[:.]/g, '-')}.sqlite`;
  const file = path.join(BACKUP_DIR, filename);
  await sqlite.backup(file);
  lastDatabaseSnapshotTimestamp = stamp;
  const copied = copyBackupOut(file);
  return { stamp, filename, sizeBytes: fs.statSync(file).size, copied };
}

// null = no second folder set, true = copied, false = the copy failed (kept in lastCopyError)
function copyBackupOut(file) {
  if (!backupConfig.copyTo) return null;
  try {
    fs.copyFileSync(file, path.join(backupConfig.copyTo, path.basename(file)));
    copyPhotos(PHOTO_DIR, path.join(backupConfig.copyTo, 'photos')); // the photos are files, not in the database file
    backupConfig.lastCopyError = null;
    backupConfig.lastCopyTime = new Date().toISOString();
    return true;
  } catch (e) {
    backupConfig.lastCopyError = e.message;
    return false;
  } finally {
    scheduleStateSave();
  }
}

async function dailyBackup() {
  const today = studioDay();
  let names = [];
  try { names = fs.readdirSync(BACKUP_DIR); } catch (e) {}
  if (names.some((n) => n.startsWith(`auto_${today}_`))) return;
  try {
    const b = await writeBackup(`auto_${today}`);
    logActivity({
      category: 'system', action: 'DATABASE_SNAPSHOT_CREATED', title: 'Daily backup saved',
      details: `storage/backups/${b.filename}` + (b.copied === false ? ` (the copy to ${backupConfig.copyTo} failed: ${backupConfig.lastCopyError})` : b.copied ? ` and ${backupConfig.copyTo}` : ''),
      user: 'Studio CRM', badgeColor: b.copied === false ? 'red' : 'green'
    });
  } catch (e) {
    console.error('[backup] the daily backup failed:', e.message);
    return;
  }
  // the oldest daily backups go, in both folders (src/backups.js)
  pruneAutoBackups(BACKUP_DIR, AUTO_BACKUPS_KEPT);
  if (backupConfig.copyTo) pruneAutoBackups(backupConfig.copyTo, AUTO_BACKUPS_KEPT);
}

// GET Database Snapshot Backup Status
app.get('/api/database/snapshot-status', (req, res) => {
  const diffHours = lastDatabaseSnapshotTimestamp ? (Date.now() - new Date(lastDatabaseSnapshotTimestamp).getTime()) / 3600000 : null;
  let autoCount = 0;
  try { autoCount = fs.readdirSync(BACKUP_DIR).filter((n) => AUTO_BACKUP.test(n)).length; } catch (e) {}
  res.json({
    success: true,
    lastSnapshotTimestamp: lastDatabaseSnapshotTimestamp,
    isOlderThan24h: diffHours === null || diffHours >= 24,
    hoursSinceLastSnapshot: diffHours === null ? null : parseFloat(diffHours.toFixed(1)),
    autoBackups: autoCount,
    autoBackupsKept: AUTO_BACKUPS_KEPT,
    copyTo: backupConfig.copyTo,
    lastCopyError: backupConfig.lastCopyError,
    lastCopyTime: backupConfig.lastCopyTime
  });
});

// POST the second folder backups are copied to ('' = none). It must exist and take a file.
app.post('/api/database/backup-folder', (req, res) => {
  const folder = String((req.body && req.body.copyTo) || '').trim();
  if (folder) {
    if (!path.isAbsolute(folder)) return res.status(400).json({ success: false, message: 'Give the full path of the folder, for example D:\\Backups or /Volumes/USB/Backups' });
    try {
      if (!fs.statSync(folder).isDirectory()) throw new Error('not a folder');
      const probe = path.join(folder, '.studio-crm-write-test');
      fs.writeFileSync(probe, 'ok');
      fs.rmSync(probe, { force: true });
    } catch (e) {
      return res.status(400).json({ success: false, message: 'The CRM cannot write to that folder: ' + e.message });
    }
  }
  backupConfig.copyTo = folder;
  backupConfig.lastCopyError = null;
  logActivity({ category: 'system', action: 'BACKUP_FOLDER_SET', title: folder ? 'Backups also copied to a second folder' : 'Second backup folder removed', details: folder || '', user: req.body?.user || 'Admin Manager', badgeColor: 'blue' });
  res.json({ success: true, copyTo: folder });
});

// POST Back up the studio database: a full copy of the SQLite file in storage/backups/
app.post('/api/database/create-snapshot', async (req, res) => {
  try {
    const b = await writeBackup('studio_crm');
    logActivity({
      category: 'system',
      action: 'DATABASE_SNAPSHOT_CREATED',
      title: 'Database backup saved',
      details: `storage/backups/${b.filename} (${Math.round(b.sizeBytes / 1024)} KB)`,
      user: req.body?.user || 'Admin Manager',
      badgeColor: 'green'
    });
    const also = b.copied ? ` and in ${backupConfig.copyTo}` : b.copied === false ? `. The copy to ${backupConfig.copyTo} failed: ${backupConfig.lastCopyError}` : '';
    res.json({ success: true, message: `Backup saved in storage/backups: ${b.filename} (${Math.round(b.sizeBytes / 1024)} KB)${also}`, snapshotTimestamp: b.stamp, filename: b.filename, sizeBytes: b.sizeBytes, copied: b.copied });
  } catch (err) {
    res.status(500).json({ success: false, message: 'The backup could not be written: ' + err.message });
  }
});

// Browser-side datasets (settings, tips, checklists, macros...) mirrored by
// public/js/app-data-sync.js so they live in the studio database, not one browser.
let appData = {};
// a form builder design is saved per form: poli_form_builder_autosave:<form id>
const APP_DATA_KEY = /^(studio_|poli_|client_photo_)[A-Za-z0-9_]{1,80}(:[A-Za-z0-9_-]{1,80})?$/;
app.get('/api/app-data', (req, res) => res.json(appData));
app.put('/api/app-data/:key', (req, res) => {
  if (!APP_DATA_KEY.test(req.params.key) || typeof req.body.value !== 'string') return res.status(400).json({ error: 'bad key or value' });
  // a browser from before 1.0.47 kept profile photos here: the photo goes to its client, unless the client has a newer one
  const photoOf = /^client_photo_(\d+)$/.exec(req.params.key);
  if (photoOf) {
    const c = clients.find((x) => x.id === Number(photoOf[1]));
    if (c && !c.photo && isPhotoData(req.body.value)) c.photo = c.avatar = c.avatar_url = req.body.value;
    return res.json({ ok: true });
  }
  appData[req.params.key] = req.body.value;
  res.json({ ok: true });
});
app.delete('/api/app-data/:key', (req, res) => {
  delete appData[req.params.key];
  res.json({ ok: true });
});

// First run: a fresh install opens on demo data. "Start with an empty studio" clears the
// demo records and keeps the reference lists a studio edits rather than replaces.
let studioMeta = { demo: true };
const KEEP_ON_CLEAR = new Set(['inventoryCategories', 'aftercareTemplates', 'studioStations', 'staff']);
const APP_DATA_KEEP = /^(poli_kiosk_exit_pin|poli_studio_profile|poli_studio_logo|poli_benchmark_studio_rates_v1|studio_vat_config|studio_remote_sync_config|studio_messenger_macros|studio_scheduled_reports|poli_form_builder_autosave(:.+)?|poli_pdf_generator_settings|poli_builder_theme_customization)$/;
app.get('/api/studio-meta', (req, res) => res.json({ ...studioMeta, version: APP_VERSION }));
app.post('/api/admin/start-empty', (req, res) => {
  for (const [key, [get]] of Object.entries(PERSISTED)) {
    const v = get();
    if (Array.isArray(v) && !KEEP_ON_CLEAR.has(key)) v.splice(0, v.length);
  }
  // one manager stays so the studio has someone to start with: the name only, none of the demo person's details
  staff.splice(0, staff.length, ...staff.filter((s) => s.role === 'manager').slice(0, 1)
    // the demo owner is "Admin Manager": an empty studio starts with a plain owner for the studio to rename
    .map((s) => ({ id: s.id, name: s.name === 'Admin Manager' ? 'Studio owner' : s.name, role: s.role, title: s.name === 'Admin Manager' ? 'Owner' : s.title, active: true, email: '', phone: '', specialties: [], certifications: [] })));
  // the demo stations had names ("VIP Private Suite", "Piercing Suite B"): plain numbers, for the studio to rename
  studioStations.forEach((st) => { st.name = 'Station ' + st.id; st.type = ''; st.status = 'ready'; st.currentClient = null; st.assignedStaff = ''; st.autoclaveCycle = ''; st.lastSanitized = null; });
  if (studioGeneralSettings.vat_number === 'GB999888777') studioGeneralSettings.vat_number = '';
  // an empty studio has never synced: the run history goes, the studio's own sync settings stay
  Object.assign(syncState, { lastSyncTime: null, lastSuccessfulSyncTime: null, syncCount: 0, lastError: null });
  if (syncState.lastStats) Object.keys(syncState.lastStats).forEach((k) => { syncState.lastStats[k] = 0; });
  const removedKeys = Object.keys(appData).filter((k) => !APP_DATA_KEEP.test(k));
  removedKeys.forEach((k) => delete appData[k]);
  nextActivityId = 1;
  nextMessageId = 1;
  kioskQueue.clear();   // the forms waiting on tablets were for demo clients
  try { sqlite.exec('DELETE FROM activity_logs; DELETE FROM inventory_logs;'); } catch (e) {}
  studioMeta = { demo: false, clearedAt: new Date().toISOString() };
  res.json({ ok: true, removedKeys });
});

// An address under /api that no route answered: say so (it used to return the home page as if it were data).
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found: ' + req.method + ' ' + req.originalUrl }));

// The kiosk tablet's page (see /api/kiosk above).
app.get('/kiosk', (req, res) => res.set('Cache-Control', 'no-store').sendFile(path.join(__dirname, 'public', 'kiosk.html')));

// Catch-all route to serve main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- Persistence ----
// Most CRM data lives in the module-level collections above. After every successful
// write request they are saved as JSON rows in the SQLite file (app_state table) and
// restored here at startup, so restarting the server keeps the studio's data.
// A first run starts from the demo data the collections are seeded with.
// ponytail: whole-state JSON rewrite per write, fine for one studio; per-table SQL if it grows.
const PERSISTED = {
  studioMeta: [() => studioMeta, (v) => { studioMeta = v; }],
  appData: [() => appData, (v) => { appData = v; }],
  activityLogs: [() => activityLogs],
  clientTattooWork: [() => clientTattooWork],
  clients: [() => clients],
  staff: [() => staff],
  teamMessages: [() => teamMessages],
  appointments: [() => appointments],
  services: [() => services],
  inventory: [() => inventory],
  procedureConsumptions: [() => procedureConsumptions],
  inventoryCategories: [() => inventoryCategories],
  financial: [() => financial],
  compliance: [() => compliance],
  documents: [() => documents],
  suppliers: [() => suppliers, (v) => { suppliers = v; }],
  supplierConfig: [() => supplierConfig, (v) => { supplierConfig = v; }],
  waivers: [() => waivers],
  staffShifts: [() => staffShifts],
  monthlySchedules: [() => monthlySchedules],
  purchaseOrders: [() => purchaseOrders, (v) => { purchaseOrders = v; }],
  supplierTimelineLogs: [() => supplierTimelineLogs, (v) => { supplierTimelineLogs = v; }],
  csvImportHistory: [() => csvImportHistory, (v) => { csvImportHistory = v; }],
  aftercareTemplates: [() => aftercareTemplates],
  galleryWorks: [() => galleryWorks],
  galleryPairs: [() => galleryPairs],
  flashDesigns: [() => flashDesigns],
  flashSheets: [() => flashSheets],
  studioStations: [() => studioStations, (v) => { studioStations = v; }],
  studioGeneralSettings: [() => studioGeneralSettings, (v) => { studioGeneralSettings = v; }],
  autoclaveLogs: [() => autoclaveLogs],
  sanitizationLogs: [() => sanitizationLogs],
  backupConfig: [() => backupConfig, (v) => { backupConfig = { ...backupConfig, ...v }; }],
  syncConfig: [() => ({ enabled: syncState.enabled, intervalMinutes: syncState.intervalMinutes, clientsUrl: syncState.clientsUrl, inventoryUrl: syncState.inventoryUrl }),
    (v) => { Object.assign(syncState, v); }],
  nextActivityId: [() => nextActivityId, (v) => { nextActivityId = v; }],
  nextMessageId: [() => nextMessageId, (v) => { nextMessageId = v; }],
  lastDatabaseSnapshotTimestamp: [() => lastDatabaseSnapshotTimestamp, (v) => { lastDatabaseSnapshotTimestamp = v; }],
  kioskQueue: [() => [...kioskQueue], (v) => {
    kioskQueue.clear();
    for (const [name, item] of v) kioskQueue.set(name, item);
    nextKioskItemId = Math.max(1, ...[...kioskQueue.values()].map((i) => Number(i.id) + 1));
  }]
};
sqlite.exec('CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL)');

function restoreState() {
  let n = 0;
  for (const row of sqlite.prepare('SELECT key, value FROM app_state').all()) {
    const entry = PERSISTED[row.key];
    if (!entry) continue;
    let v;
    try { v = JSON.parse(row.value); } catch (e) { console.warn('[state] unreadable', row.key); continue; }
    const [get, set] = entry;
    if (set) set(v);
    else if (Array.isArray(get())) get().splice(0, get().length, ...v);
    else { const o = get(); Object.keys(o).forEach((k) => delete o[k]); Object.assign(o, v); }
    n++;
  }
  console.log(n ? `[state] restored ${n} collections from the database` : '[state] first run: starting from the demo data');
}

const saveStmt = sqlite.prepare('INSERT OR REPLACE INTO app_state (key, value, updated_at) VALUES (?, ?, ?)');
const saveRows = sqlite.transaction(() => {
  const now = new Date().toISOString();
  for (const [key, [get]] of Object.entries(PERSISTED)) saveStmt.run(key, JSON.stringify(get()), now);
});
// Photos are files (src/photo-files.js): the lists that hold photos give them up before they are saved.
// Signed forms and waivers keep their signature inside the record, and the logo stays with the settings.
const PHOTO_LISTS = () => [clients, clientTattooWork, flashDesigns];
let photosStay = false; // no backup could be made before the first move: nothing moves until the next start
const TRIAL = !!process.env.STUDIO_CRM_TRIAL; // an update's trial start: a copy of the database, in a folder that is thrown away
function saveAll() {
  if (!photosStay) photosToFiles(PHOTO_DIR, PHOTO_LISTS(), { flush: !TRIAL });
  saveRows();
}
// A studio from before 1.0.47 has its photos in the database. Once, at the start: a backup of the database
// as it is, then the photos become files, then the database file gives the room back.
function movePhotosOutOfTheDatabase() {
  // profile photos the browsers kept in the shared browser data: that copy is the one the screens showed
  for (const k of Object.keys(appData)) {
    const m = /^client_photo_(\d+)$/.exec(k);
    if (!m) continue;
    const c = clients.find((x) => x.id === Number(m[1]));
    if (c && isPhotoData(appData[k])) c.photo = c.avatar = c.avatar_url = appData[k];
    delete appData[k];
  }
  const n = countPhotos(PHOTO_LISTS());
  if (!n) return;
  // The trial start moves them all too (measured: quicker than saving them back into the copy), without the backup.
  let backedUp = [];
  try { backedUp = fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith('before-photos-to-files_')); } catch (e) { /* no backups yet */ }
  if (!TRIAL && !backedUp.length) {
    const file = path.join(BACKUP_DIR, `before-photos-to-files_${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`);
    try {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      sqlite.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
      copyBackupOut(file);
    } catch (e) {
      fs.rmSync(file, { force: true }); // half a backup must not count as one at the next start
      photosStay = true;
      console.error('[photos] no backup could be made, so the photos stay in the database until the next start: ' + e.message);
      return;
    }
  }
  const t = Date.now();
  const out = photosToFiles(PHOTO_DIR, PHOTO_LISTS(), { flush: !TRIAL });
  saveRows();
  try { sqlite.exec('VACUUM'); sqlite.pragma('wal_checkpoint(TRUNCATE)'); } catch (e) { console.warn('[photos] the database file keeps its size for now: ' + e.message); }
  console.log(`[photos] ${out.moved} photos moved from the database to ${PHOTO_DIR} in ${((Date.now() - t) / 1000).toFixed(1)} s` + (out.failed ? `; ${out.failed} could not be written and stay in the database` : ''));
}
let saveTimer = null;
function scheduleStateSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try { saveAll(); } catch (e) { console.error('[state] save failed:', e.message); }
  }, 250);
}
restoreState();
// the old reminder job marked appointments and wrote activity lines though nothing was ever sent: take them out of saved studios
appointments.forEach((a) => { delete a.reminder_sent; delete a.reminder_sent_at; });
for (let i = activityLogs.length - 1; i >= 0; i--) if (activityLogs[i].action === 'REMINDER_SENT') activityLogs.splice(i, 1);
try { sqlite.exec("DELETE FROM activity_logs WHERE action = 'REMINDER_SENT'"); } catch (e) { /* no table yet: nothing to remove */ }
scheduleStateSave();
// gallery photos from before 1.0.29 join the client photos (one store since then)
if (moveGalleryIntoClientWork()) scheduleStateSave();
movePhotosOutOfTheDatabase();
// the built-in aftercare sheets get the languages they lack (a studio's database from before 1.0.19 has
// English only); a language the studio edited is never replaced
if (addAftercareTranslations(aftercareTemplates)) scheduleStateSave();

// The CSV sync starts from the saved settings
resetSyncSchedule();
if (syncState.enabled && (syncState.clientsUrl || syncState.inventoryUrl)) {
  setTimeout(() => {
    runAutomatedCsvSync('Server Initialized Sync');
  }, 3000);
}
// the daily backup: a minute after the start, then checked every hour (not in an update's trial start)
if (!process.env.STUDIO_CRM_TRIAL) {
  setTimeout(dailyBackup, 60 * 1000).unref();
  setInterval(dailyBackup, 60 * 60 * 1000).unref();
}
setInterval(scheduleStateSave, 5 * 60 * 1000).unref(); // background jobs change state too
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { try { saveAll(); } catch (e) {} process.exit(0); });

// The double-click starters set STUDIO_CRM_OPEN so the browser opens on the right port.
function openBrowser() {
  if (!process.env.STUDIO_CRM_OPEN) return;
  const url = `http://localhost:${PORT}`;
  const [cmd, args] = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try { spawn(cmd, args, { stdio: 'ignore', detached: true }).on('error', () => {}).unref(); } catch (e) {}
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Studio CRM application server running on http://0.0.0.0:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser. Keep this window open while you use the CRM.`);
  openBrowser();
  // https for the other devices in the studio; HTTPS_PORT=0 turns it off
  const httpsPort = process.env.HTTPS_PORT === undefined ? 3443 : Number(process.env.HTTPS_PORT) || 0;
  startHttps(app, httpsPort).then((s) => { if (s) httpsPortUp = httpsPort; });
}).on('error', (e) => {
  if (e.code !== 'EADDRINUSE') throw e;
  // Started twice: the first one is still running, so just show it.
  console.log(`Studio CRM is already running on port ${PORT} (or another program uses that port).`);
  openBrowser();
  setTimeout(() => process.exit(0), 1500);
});

