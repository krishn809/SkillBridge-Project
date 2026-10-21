// Builds the in-memory demo database from data/seed.json.
// The optional persist flag is disabled when Vercel loads the serverless
// function because Vercel's filesystem is read-only and ephemeral.

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const SEED_PATH = path.join(__dirname, '..', 'data', 'seed.json');
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function buildDb(persist = true, targetPath = DB_PATH) {
  const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

  seed.users = (seed.users || []).map((u) => {
    const { password, ...rest } = u;
    return { ...rest, passwordHash: password ? bcrypt.hashSync(password, 10) : rest.passwordHash };
  });

  seed.opportunities = seed.opportunities || [];
  seed.applications = seed.applications || [];
  seed.programs = seed.programs || [];
  seed.mentorships = seed.mentorships || [];
  seed.events = seed.events || [];

  if (persist) {
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(seed, null, 2), 'utf8');
  }

  return seed;
}

if (require.main === module) {
  buildDb(true);
  console.log('Seeded backend/data/db.json from seed.json (demo passwords are all "demo123").');
}

module.exports = { buildDb, DB_PATH, SEED_PATH };
