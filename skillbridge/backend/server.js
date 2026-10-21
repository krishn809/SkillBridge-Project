try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional in environments with native environment variables
}

const app = require('./src/app');
const { getDatabaseStats } = require('./src/db');

const PORT = process.env.PORT || 4000;

// Only start the server if this file is run directly (local development)
// When deployed to Vercel, the app is exported as a module, not started here
if (require.main === module) {
  const stats = getDatabaseStats();
  app.listen(PORT, () => {
    console.log(`SkillBridge server running at http://localhost:${PORT}`);
    console.log(`[Database] Connected to database file: ${stats.path}`);
    console.log(
      `[Database] Loaded features: ${stats.usersCount} users, ${stats.opportunitiesCount} opportunities, ${stats.programsCount} programs, ${stats.eventsCount} events`
    );
    console.log(
      'Demo logins (password "demo123"): aditi@student.edu, rohan@university.edu, priya@technova.com, admin@nit.edu'
    );
  });
}

module.exports = app;
