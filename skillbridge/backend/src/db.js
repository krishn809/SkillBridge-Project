// Persistent file-backed database layer for SkillBridge.
// Automatically connects to backend/data/db.json (creating & seeding it if missing).
// Also supports fallback to temporary writable storage (/tmp) in serverless environments.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { buildDb, DB_PATH } = require('./seed');

const FALLBACK_TMP_PATH = path.join(os.tmpdir(), 'skillbridge_db.json');
let activeDbPath = process.env.DB_FILE_PATH || DB_PATH;

function resolveDatabaseConnection() {
  // First attempt: standard DB_PATH or custom DB_FILE_PATH
  try {
    const dir = path.dirname(activeDbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.warn(`[Database] Directory for ${activeDbPath} could not be created. Falling back to ${FALLBACK_TMP_PATH}`);
    activeDbPath = FALLBACK_TMP_PATH;
  }

  if (fs.existsSync(activeDbPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(activeDbPath, 'utf8'));
      // Ensure all standard collections exist
      data.users = data.users || [];
      data.opportunities = data.opportunities || [];
      data.applications = data.applications || [];
      data.programs = data.programs || [];
      data.mentorships = data.mentorships || [];
      data.events = data.events || [];
      return data;
    } catch (parseErr) {
      console.error(`[Database] Error reading existing database at ${activeDbPath}, re-seeding:`, parseErr);
    }
  }

  // Create & persist new database from seed data
  try {
    return buildDb(true, activeDbPath);
  } catch (err) {
    if (activeDbPath !== FALLBACK_TMP_PATH) {
      console.warn(`[Database] Failed to write database to ${activeDbPath}. Retrying with fallback: ${FALLBACK_TMP_PATH}`);
      activeDbPath = FALLBACK_TMP_PATH;
      return buildDb(true, activeDbPath);
    }
    throw err;
  }
}

const state = resolveDatabaseConnection();

console.log(`[Database] Successfully connected to database file: ${activeDbPath}`);

function save() {
  try {
    const dir = path.dirname(activeDbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(activeDbPath, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    // If primary save fails, attempt saving to fallback tmp path
    if (activeDbPath !== FALLBACK_TMP_PATH) {
      try {
        console.warn(`[Database] Write failed to ${activeDbPath}. Attempting fallback to ${FALLBACK_TMP_PATH}`);
        activeDbPath = FALLBACK_TMP_PATH;
        fs.writeFileSync(activeDbPath, JSON.stringify(state, null, 2), 'utf8');
        return;
      } catch (fallbackErr) {
        console.error('[Database] Fallback save also failed:', fallbackErr);
      }
    }
    console.error('[Database] Failed to persist data to database file:', err);
    if (process.env.NODE_ENV !== 'production') {
      throw err;
    }
  }
}

function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 10);
}

function getDatabaseStats() {
  return {
    path: activeDbPath,
    connected: true,
    usersCount: (state.users || []).length,
    opportunitiesCount: (state.opportunities || []).length,
    applicationsCount: (state.applications || []).length,
    programsCount: (state.programs || []).length,
    mentorshipsCount: (state.mentorships || []).length,
    eventsCount: (state.events || []).length
  };
}

module.exports = { state, save, uid, activeDbPath, getDatabaseStats };
