/* =========================================================
   CONSTANTS (UI-only; all real data comes from the API)
========================================================= */
var MASTER_SKILLS = [
  "JavaScript", "Python", "Java", "React", "Node.js", "SQL", "Machine Learning", "Data Analysis",
  "Cloud Computing (AWS)", "Cybersecurity", "UI/UX Design", "DevOps", "Mobile Development", "C++",
  "Git & Version Control", "REST APIs", "TensorFlow", "Excel", "Power BI", "Networking",
  "Communication", "Teamwork", "Leadership", "Problem Solving", "Critical Thinking", "Time Management",
  "Adaptability", "Creativity", "Public Speaking", "Negotiation", "Emotional Intelligence",
  "Conflict Resolution", "Project Management", "Work Ethic", "Attention to Detail", "Mentoring"
];
var SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
var LEVEL_WIDTH = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };

var ASSESSMENT_CATS = [
  { id: "programming", label: "Programming & Technical Skills", desc: "Coding, tools, and technical execution." },
  { id: "data", label: "Data & Analytical Thinking", desc: "Working with data, spreadsheets, and drawing conclusions." },
  { id: "communication", label: "Communication", desc: "Writing, speaking, and explaining ideas clearly." },
  { id: "teamwork", label: "Teamwork & Collaboration", desc: "Working well with others toward a shared goal." },
  { id: "leadership", label: "Leadership", desc: "Guiding, motivating, and taking ownership." },
  { id: "problemsolving", label: "Problem Solving", desc: "Breaking down problems and finding solutions." },
  { id: "adaptability", label: "Adaptability", desc: "Handling change and ambiguity." },
  { id: "domain", label: "Domain Knowledge", desc: "Depth of knowledge in your field of study." }
];
var ASSESSMENT_LEVEL_LABELS = ["Beginner", "Novice", "Intermediate", "Advanced", "Expert"];

var NAV = {
  student: [
    ["dashboard", "Dashboard", "🏠"], ["profile", "My Profile", "👤"], ["skills", "Skills", "🧩"],
    ["assessment", "Skill Assessment", "📝"], ["projects", "Projects", "💼"],
    ["opportunities", "Opportunities", "🚀"], ["mentorship", "Mentorship", "🤝"],
    ["events", "Events", "📅"], ["portfolio", "Portfolio", "📁"]
  ],
  academician: [
    ["dashboard", "Dashboard", "🏠"], ["profile", "My Profile", "👤"], ["programs", "Programs", "🎓"],
    ["mentorship", "Mentorship", "🤝"], ["events", "Events", "📅"]
  ],
  industry: [
    ["dashboard", "Dashboard", "🏠"], ["profile", "My Profile", "👤"], ["opportunities", "Opportunities", "📢"],
    ["applicants", "Applicants", "📋"], ["mentorship", "Mentorship", "🤝"], ["events", "Events", "📅"]
  ],
  admin: [
    ["dashboard", "Dashboard", "🏠"], ["users", "Users", "👥"], ["opportunities", "Opportunities", "📢"],
    ["analytics", "Analytics", "📊"], ["events", "Events", "📅"]
  ]
};
var ROLE_LABEL = { student: "Student", academician: "Academician", industry: "Industry Representative", admin: "Institution Admin" };

/* =========================================================
   STATE
========================================================= */
var session = { user: null, view: 'dashboard' };
var ui = {
  profileMenuOpen: false, authTab: 'login', authError: '',
  oppSearch: '', oppTypeFilter: '', selectedOpportunityForApplicants: 'all',
  userSearch: '', userRoleFilter: '', assessmentDraft: {}, feedbackOpenFor: null
};

/* =========================================================
   UTIL
========================================================= */
function escapeHtml(str) {
  return (str === undefined || str === null ? '' : String(str)).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function initials(name) {
  if (!name) return '?';
  var parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}
function fmtDate(d) {
  if (!d) return '—';
  try { var dt = new Date(d + 'T00:00:00'); return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); } catch (e) { return d; }
}
function matchClass(pct) { return pct >= 70 ? 'high' : (pct >= 40 ? 'mid' : 'low'); }
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
}
function statCard(icon, num, label) {
  return '<div class="stat-card"><span>' + icon + '</span><h3>' + num + '</h3><p>' + label + '</p></div>';
}
function statCardStar(num, label) {
  return '<div class="stat-card stat-card-star">' +
    '<div class="stat-star-icon">★</div>' +
    '<div><h3>' + num + '</h3><p>' + label + '</p></div>' +
    '</div>';
}

/* =========================================================
   TELEMETRY VISUALIZATIONS (From Reference Specifications)
========================================================= */

function renderPerformanceTelemetry(opts) {
  opts = opts || {};
  var title = opts.title || 'Performance & Activity Analytics';
  var subtitle = opts.subtitle || 'Real-time telemetry styled with Neon Spring Green & Sky Blue telemetry visuals.';
  var id = opts.id || 'telemetry_' + Math.random().toString(36).slice(2, 7);

  var hours = opts.hours || '3 h 45 m';
  var hoursLabel = opts.hoursLabel || 'Active engineering hours';
  var remaining = opts.remaining || '4 h 15 m';
  var goal = opts.goal || 'Weekly Goal: 20 h';
  var verifications = opts.verifications || '84 Skill Verifications';
  var subDesc = opts.subDesc || 'Active challenges passed';

  return '' +
    '<div class="telemetry-section">' +
    '<div class="telemetry-header">' +
    '<h2 class="telemetry-title">' + escapeHtml(title) + '</h2>' +
    '<p class="telemetry-subtitle">' + escapeHtml(subtitle) + '</p>' +
    '</div>' +
    '<div class="telemetry-grid-3">' +
    // Card 1: Skill Learning Focus
    '<div class="telemetry-card">' +
    '<div class="telemetry-card-head">' +
    '<h3>' + escapeHtml(opts.card1Title || 'Skill Learning Focus') + '</h3>' +
    '<span class="telemetry-badge-green">TODAY</span>' +
    '</div>' +
    '<div class="telemetry-stat-row">' +
    '<div>' +
    '<div class="telemetry-big-stat">' + escapeHtml(hours) + '</div>' +
    '<div class="telemetry-stat-label">' + escapeHtml(hoursLabel) + '</div>' +
    '</div>' +
    '<div class="telemetry-donut-wrap">' +
    '<svg width="84" height="84" viewBox="0 0 84 84">' +
    '<defs>' +
    '<linearGradient id="donutGrad_' + id + '" x1="0%" y1="100%" x2="100%" y2="0%">' +
    '<stop offset="0%" stop-color="#00f5a0"/>' +
    '<stop offset="50%" stop-color="#06b6d4"/>' +
    '<stop offset="100%" stop-color="#38bdf8"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<circle cx="42" cy="42" r="32" fill="none" stroke="#f1f5f9" stroke-width="9"/>' +
    '<circle cx="42" cy="42" r="32" fill="none" stroke="url(#donutGrad_' + id + ')" stroke-width="9" stroke-linecap="round" stroke-dasharray="152 202" transform="rotate(-90 42 42)"/>' +
    '</svg>' +
    '</div>' +
    '</div>' +
    '<div class="telemetry-breakdown-list">' +
    '<div class="telemetry-breakdown-item">' +
    '<div class="telemetry-breakdown-left"><span class="telemetry-dot cyan"></span><span>Frontend Architecture</span></div>' +
    '<span class="telemetry-breakdown-val">1h 50 m</span>' +
    '</div>' +
    '<div class="telemetry-breakdown-item">' +
    '<div class="telemetry-breakdown-left"><span class="telemetry-dot blue"></span><span>Algorithms & Data Structures</span></div>' +
    '<span class="telemetry-breakdown-val">1h 15 m</span>' +
    '</div>' +
    '<div class="telemetry-breakdown-item">' +
    '<div class="telemetry-breakdown-left"><span class="telemetry-dot mint"></span><span>System Design & Review</span></div>' +
    '<span class="telemetry-breakdown-val">40 m</span>' +
    '</div>' +
    '</div>' +
    '<div class="telemetry-mini-cards">' +
    '<div class="telemetry-mini-card"><span class="t-icon">💻</span><span class="t-label">Code</span><span class="t-time">1h 50m</span></div>' +
    '<div class="telemetry-mini-card"><span class="t-icon">📐</span><span class="t-label">Design</span><span class="t-time">1h 15m</span></div>' +
    '<div class="telemetry-mini-card"><span class="t-icon">🤝</span><span class="t-label">Mentorship</span><span class="t-time">40m</span></div>' +
    '</div>' +
    '</div>' +

    // Card 2: Weekly Mastery Target
    '<div class="telemetry-card">' +
    '<div class="telemetry-card-head">' +
    '<h3>' + escapeHtml(opts.card2Title || 'Weekly Mastery Target') + '</h3>' +
    '<span class="telemetry-badge-green">ON TRACK</span>' +
    '</div>' +
    '<div class="gauge-container">' +
    '<div class="gauge-svg-wrap">' +
    '<svg width="200" height="110" viewBox="0 0 200 110">' +
    '<defs>' +
    '<linearGradient id="gaugeGrad_' + id + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
    '<stop offset="0%" stop-color="#10b981"/>' +
    '<stop offset="50%" stop-color="#06b6d4"/>' +
    '<stop offset="100%" stop-color="#0ea5e9"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<path d="M 32 95 A 68 68 0 0 1 168 95" fill="none" stroke="#f1f5f9" stroke-width="11" stroke-linecap="round"/>' +
    '<path d="M 32 95 A 68 68 0 0 1 168 95" fill="none" stroke="url(#gaugeGrad_' + id + ')" stroke-width="11" stroke-linecap="round" stroke-dasharray="168 215"/>' +
    '</svg>' +
    '<div class="gauge-center-content">' +
    '<div class="gauge-center-val">' + escapeHtml(remaining) + '</div>' +
    '<div class="gauge-center-sub">Remaining this sprint</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="telemetry-goal-pill">' + escapeHtml(goal) + '</div>' +
    '</div>' +

    // Card 3: Sprint Productivity
    '<div class="telemetry-card">' +
    '<div class="telemetry-card-head">' +
    '<h3>' + escapeHtml(opts.card3Title || 'Sprint Productivity') + '</h3>' +
    '<span class="telemetry-badge-green">WEEK 39</span>' +
    '</div>' +
    '<div class="telemetry-dates-bar">' +
    '<span class="telemetry-date-pill">10</span>' +
    '<span class="telemetry-date-pill">11</span>' +
    '<span class="telemetry-date-pill">12</span>' +
    '<span class="telemetry-date-pill">13</span>' +
    '<span class="telemetry-date-pill active">14</span>' +
    '<span class="telemetry-date-pill">15</span>' +
    '<span class="telemetry-date-pill">16</span>' +
    '</div>' +
    '<div class="telemetry-barchart">' +
    '<div class="telemetry-bar-col"><div class="telemetry-bar-wrap"><div class="telemetry-bar-fill" style="height:38%;"></div></div><span class="telemetry-bar-day">S</span></div>' +
    '<div class="telemetry-bar-col"><div class="telemetry-bar-wrap"><div class="telemetry-bar-fill" style="height:76%;"></div></div><span class="telemetry-bar-day">M</span></div>' +
    '<div class="telemetry-bar-col"><div class="telemetry-bar-wrap"><div class="telemetry-bar-fill" style="height:64%;"></div></div><span class="telemetry-bar-day">T</span></div>' +
    '<div class="telemetry-bar-col"><div class="telemetry-bar-wrap"><div class="telemetry-bar-fill" style="height:92%;"></div></div><span class="telemetry-bar-day">W</span></div>' +
    '<div class="telemetry-bar-col"><div class="telemetry-bar-wrap"><div class="telemetry-bar-fill" style="height:84%;"></div></div><span class="telemetry-bar-day">T</span></div>' +
    '<div class="telemetry-bar-col"><div class="telemetry-bar-wrap"><div class="telemetry-bar-fill" style="height:46%;"></div></div><span class="telemetry-bar-day">F</span></div>' +
    '<div class="telemetry-bar-col"><div class="telemetry-bar-wrap"><div class="telemetry-bar-fill" style="height:60%;"></div></div><span class="telemetry-bar-day">S</span></div>' +
    '</div>' +
    '<div class="telemetry-subcard">' +
    '<div>' +
    '<div class="telemetry-subcard-title">' + escapeHtml(verifications) + '</div>' +
    '<div class="telemetry-subcard-desc">' + escapeHtml(subDesc) + '</div>' +
    '</div>' +
    '<div class="telemetry-sparkline"><span></span><span></span><span></span><span></span></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderEngagementMatrix(opts) {
  opts = opts || {};
  var title = opts.title || 'Platform Student Engagement Matrix';
  var subtitle = opts.subtitle || 'Weekly hourly activity distribution';
  var badge = opts.badge || 'PEAK: 2 PM - 6 PM';

  var days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var matrixData = [
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 3, 2, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 4, 3, 3, 2, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 5, 5, 5, 5, 4, 4, 3, 2, 2, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 5, 5, 5, 5, 5, 5, 4, 3, 3, 2, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5, 5, 5, 4, 4, 3, 3, 2, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 4, 3, 3, 2, 2, 1, 0, 0, 0]
  ];

  var rowsHtml = days.map(function (d, dIdx) {
    var cells = matrixData[dIdx].map(function (lvl, h) {
      var timeStr = (h < 10 ? '0' : '') + h + ':00';
      var levelDesc = lvl === 5 ? 'Peak Flow (45-60m)' : (lvl === 4 ? '45-60m' : (lvl === 3 ? '30-45m' : (lvl === 2 ? '15-30m' : (lvl === 1 ? '0-15m' : 'Inactive'))));
      return '<div class="matrix-cell lvl-' + lvl + '" title="' + d + ' at ' + timeStr + ' · ' + levelDesc + '"></div>';
    }).join('');
    return '<div class="matrix-row"><span class="matrix-day-label">' + d + '</span><div class="matrix-slots">' + cells + '</div></div>';
  }).join('');

  return '' +
    '<div class="matrix-card">' +
    '<div class="matrix-head">' +
    '<div>' +
    '<h2>' + escapeHtml(title) + '</h2>' +
    '<p>' + escapeHtml(subtitle) + '</p>' +
    '</div>' +
    '<span class="telemetry-badge-green">' + escapeHtml(badge) + '</span>' +
    '</div>' +
    '<div class="matrix-scroll-wrap">' +
    '<div class="matrix-inner">' +
    '<div class="matrix-time-header">' +
    '<span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span>' +
    '</div>' +
    '<div class="matrix-grid">' + rowsHtml + '</div>' +
    '</div>' +
    '</div>' +
    '<div class="matrix-legend">' +
    '<div class="matrix-legend-item"><span class="matrix-legend-box lvl-1"></span><span>0-15m</span></div>' +
    '<div class="matrix-legend-item"><span class="matrix-legend-box lvl-2"></span><span>15-30m</span></div>' +
    '<div class="matrix-legend-item"><span class="matrix-legend-box lvl-3"></span><span>30-45m</span></div>' +
    '<div class="matrix-legend-item"><span class="matrix-legend-box lvl-4"></span><span>45-60m</span></div>' +
    '<div class="matrix-legend-item"><span class="matrix-legend-box lvl-5"></span><span>Peak Flow</span></div>' +
    '</div>' +
    '</div>';
}

function renderSkillVelocity(opts) {
  opts = opts || {};
  var title = opts.title || 'Skill Acquisition Velocity';
  var subtitle = opts.subtitle || 'Daily study time vs. curriculum benchmark';
  var badge = opts.badge || '5 DAYS GOAL MET';
  var avg = opts.avg || 'Avg. 4.2 h';
  var codeTime = opts.codeTime || '6 h 32 m';
  var theoryTime = opts.theoryTime || '3 h 18 m';

  return '' +
    '<div class="velocity-card">' +
    '<div class="velocity-head">' +
    '<div>' +
    '<h3>' + escapeHtml(title) + '</h3>' +
    '<p>' + escapeHtml(subtitle) + '</p>' +
    '</div>' +
    '<span class="telemetry-badge-green">' + escapeHtml(badge) + '</span>' +
    '</div>' +
    '<div class="velocity-chart-area">' +
    '<span class="velocity-avg-pill">' + escapeHtml(avg) + '</span>' +
    '<div class="velocity-bar-col"><div class="velocity-bar-wrap"><div class="velocity-bar-fill" style="height:36%;"></div></div><span class="velocity-bar-label">S</span></div>' +
    '<div class="velocity-bar-col"><div class="velocity-bar-wrap"><div class="velocity-bar-fill" style="height:80%;"></div></div><span class="velocity-bar-label">M</span></div>' +
    '<div class="velocity-bar-col"><div class="velocity-bar-wrap"><div class="velocity-bar-fill" style="height:70%;"></div></div><span class="velocity-bar-label">T</span></div>' +
    '<div class="velocity-bar-col"><div class="velocity-bar-wrap"><div class="velocity-bar-fill" style="height:94%;"></div></div><span class="velocity-bar-label">W</span></div>' +
    '<div class="velocity-bar-col"><div class="velocity-bar-wrap"><div class="velocity-bar-fill" style="height:85%;"></div></div><span class="velocity-bar-label">T</span></div>' +
    '<div class="velocity-bar-col"><div class="velocity-bar-wrap"><div class="velocity-bar-fill" style="height:46%;"></div></div><span class="velocity-bar-label">F</span></div>' +
    '<div class="velocity-bar-col"><div class="velocity-bar-wrap"><div class="velocity-bar-fill" style="height:62%;"></div></div><span class="velocity-bar-label">S</span></div>' +
    '</div>' +
    '<div class="velocity-progress-wrap">' +
    '<div class="velocity-split-bar">' +
    '<div class="velocity-split-left"></div>' +
    '<div class="velocity-split-right"></div>' +
    '</div>' +
    '<div class="velocity-split-labels">' +
    '<span>Hands-on Code: <strong>' + escapeHtml(codeTime) + '</strong></span>' +
    '<span>Theory & Mentorship: <strong>' + escapeHtml(theoryTime) + '</strong></span>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderSkillDemandCard(skillsData) {
  var list = (skillsData && skillsData.demand && skillsData.demand.length) ? skillsData.demand : [
    { name: 'Communication', count: 2 },
    { name: 'JavaScript', count: 1 },
    { name: 'React', count: 1 },
    { name: 'Data Analysis', count: 1 }
  ];
  var max = Math.max(list[0].count, 1);
  var html = list.slice(0, 6).map(function (s) {
    var pct = Math.round(s.count / max * 100);
    return '<div class="skill-bar-row"><div class="bar-label"><span>' + escapeHtml(s.name) + '</span><span>' + s.count + '</span></div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%; background:linear-gradient(90deg, #0284c7 0%, #10b981 100%);"></div></div></div>';
  }).join('');

  return '' +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>Skill demand</h2><p>Most requested skills across postings.</p></div></div>' +
    html +
    '</div>';
}

// Wraps an action handler so any thrown API error becomes a toast instead of a blank failure.
async function guarded(fn) {
  try { await fn(); }
  catch (err) { showToast(err.message || 'Something went wrong.'); }
}

/* =========================================================
   RENDER: ROOT
========================================================= */
async function render() {
  var app = document.getElementById('app');
  if (!session.user) {
    app.innerHTML = renderAuth();
  } else {
    app.innerHTML = '<div class="dashboard-page"><main class="dashboard-main"><p class="empty-message">Loading…</p></main></div>';
    app.innerHTML = await renderAppShell();
  }
}

/* =========================================================
   RENDER: AUTH
========================================================= */
var DEMO_ACCOUNTS = {
  student: { email: 'aditi@student.edu', id: 'aditi@student.edu', label: 'Aditi Sharma (B.Tech)' },
  academician: { email: 'rohan@university.edu', label: 'Dr. Rohan Mehta (Academician)' },
  industry: { email: 'priya@technova.com', label: 'Priya Nair (TechNova)' },
  admin: { email: 'admin@nit.edu', label: 'Admin Officer (NIT)' }
};

/* portalTab: which professional role is selected in the middle card ('academician' or 'industry') */
ui.portalTab = ui.portalTab || 'academician';
ui.simulatorOpen = ui.simulatorOpen || false;
ui.simSelectedSkill = ui.simSelectedSkill || 'React';

function setPortalTab(tab) {
  ui.portalTab = tab;
  render();
}

function toggleSimulator() {
  ui.simulatorOpen = !ui.simulatorOpen;
  render();
}

function setSimSkill(skill) {
  ui.simSelectedSkill = skill;
  render();
}

function renderAuth() {
  return '<div class="auth-page">' + (ui.authTab === 'signup' ? renderSignupPanel() : renderPortalLogin()) + '</div>';
}

function renderPortalLogin() {
  return '' +
    '<div class="portal-scene">' +
    '<!-- Top Constellation Header Navigation -->' +
    '<div class="portal-top-nav">' +
    '<div class="portal-brand-pill" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">' +
    '<img src="assets/logo.png" alt="Skill Bridge Logo" class="portal-brand-logo-img">' +
    '<span class="portal-brand-text">Skill Bridge</span>' +
    '</div>' +

    '<!-- Constellation Star-line Accent -->' +
    '<div class="portal-constellation-track" aria-hidden="true">' +
    '<svg width="340" height="40" viewBox="0 0 340 40" fill="none" class="portal-constellation-svg">' +
    '<line x1="20" y1="20" x2="80" y2="10" stroke="rgba(56, 189, 248, 0.45)" stroke-dasharray="3 3"/>' +
    '<line x1="80" y1="10" x2="160" y2="28" stroke="rgba(168, 85, 247, 0.45)" stroke-dasharray="3 3"/>' +
    '<line x1="160" y1="28" x2="240" y2="12" stroke="rgba(249, 115, 22, 0.45)" stroke-dasharray="3 3"/>' +
    '<line x1="240" y1="12" x2="320" y2="24" stroke="rgba(56, 189, 248, 0.45)" stroke-dasharray="3 3"/>' +
    '<circle cx="20" cy="20" r="3" fill="#38bdf8"/>' +
    '<circle cx="80" cy="10" r="3.5" fill="#c084fc"/>' +
    '<circle cx="160" cy="28" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)"/>' +
    '<circle cx="240" cy="12" r="3.5" fill="#fb923c"/>' +
    '<circle cx="320" cy="24" r="3" fill="#a855f7"/>' +
    '</svg>' +
    '</div>' +

    '<button type="button" class="portal-signup-btn" onclick="switchAuthTab(\'signup\')">Sign Up Free</button>' +
    '</div>' +

    '<!-- Main Hero Headline -->' +
    '<div class="portal-hero-text">' +
    '<h1 class="portal-main-heading">SELECT YOUR LOGIN PORTAL</h1>' +
    '<p class="portal-sub-heading">Choose your account type to access the platform.</p>' +
    '</div>' +

    (ui.authError ? '<div class="auth-error portal-error-banner">' + escapeHtml(ui.authError) + '</div>' : '') +

    '<!-- Three Portal Login Cards (Admin, Professional, Student) -->' +
    '<div class="portal-cards-container">' +
    renderAdminCard() +
    renderProfessionalCard() +
    renderStudentCard() +
    '</div>' +

    '<!-- Velyx-Inspired Institutional Telemetry Bar -->' +
    '<div class="portal-telemetry-section">' +
    '<div class="portal-telemetry-badge">' +
    '<span class="telemetry-live-dot"></span> Official Academia-Industry Operating System' +
    '</div>' +
    '<div class="portal-telemetry-grid">' +
    '<div class="portal-telemetry-card">' +
    '<div class="telemetry-value text-purple">94.8%</div>' +
    '<div class="telemetry-title">Skill-to-Role Match Accuracy</div>' +
    '<div class="telemetry-desc">Autonomous competency mapping across 300+ corporate hiring programs.</div>' +
    '</div>' +
    '<div class="portal-telemetry-card">' +
    '<div class="telemetry-value text-blue">1-Tap</div>' +
    '<div class="telemetry-title">WhatsApp Alert Dispatch</div>' +
    '<div class="telemetry-desc">Official Meta Cloud API triggers interview invites and test links directly.</div>' +
    '</div>' +
    '<div class="portal-telemetry-card">' +
    '<div class="telemetry-value text-orange">30 Sec</div>' +
    '<div class="telemetry-title">Assessment & Telemetry Sync</div>' +
    '<div class="telemetry-desc">Real-time skill scoring syncs to student verified competency ledger.</div>' +
    '</div>' +
    '<div class="portal-telemetry-card">' +
    '<div class="telemetry-value text-emerald">100%</div>' +
    '<div class="telemetry-title">NEP 2020 Compliant Isolation</div>' +
    '<div class="telemetry-desc">Institutional student data sovereignty and secure university records.</div>' +
    '</div>' +
    '</div>' +
    '<div class="portal-simulator-cta">' +
    '<button type="button" class="btn-velyx-simulator" onclick="toggleSimulator()">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' +
    '<span>' + (ui.simulatorOpen ? 'Hide Interactive Simulator' : 'Launch Interactive Matching Simulator') + '</span>' +
    '</button>' +
    '</div>' +
    '</div>' +

    '<!-- Interactive Live Matching Simulator (Velyx Feature Reference) -->' +
    (ui.simulatorOpen ? renderSimulatorModal() : '') +

    '<!-- Bottom Footer -->' +
    '<footer class="portal-page-footer">' +
    '<span class="portal-footer-copyright">© 2026 SkillBridge. All rights reserved. • Powered by Velyx Design System</span>' +
    '<div class="portal-footer-links">' +
    '<a onclick="showToast(\'SkillBridge Documentation v2.4\')">Documentation</a> • ' +
    '<a onclick="showToast(\'Institutional Privacy Policy: 100% On-Campus Data Isolation\')">Privacy & Security</a>' +
    '</div>' +
    '</footer>' +
    '</div>';
}

function renderAdminCard() {
  return '' +
    '<div class="portal-column-card admin-card">' +
    '<!-- Top Purple Cap with Shield Badge -->' +
    '<div class="portal-card-top-cap cap-admin">' +
    '<div class="portal-badge-bubble badge-admin">' +
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none">' +
    '<path d="M12 2L4 5.5v6c0 5.25 3.4 10.15 8 11.5 4.6-1.35 8-6.25 8-11.5v-6L12 2z" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M9 12l2 2 4-4" stroke="#7c3aed" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>' +
    '</div>' +
    '</div>' +

    '<!-- Inner Form Card -->' +
    '<div class="portal-card-body">' +
    '<h2 class="portal-card-title">ADMIN LOGIN</h2>' +
    '<form onsubmit="return handleLogin(event)">' +
    '<div class="portal-field">' +
    '<label class="portal-field-label">Username</label>' +
    '<input type="text" name="email" class="portal-text-input input-admin" value="admin@nit.edu" placeholder="admin@nit.edu" autocomplete="username" required>' +
    '</div>' +
    '<div class="portal-field">' +
    '<label class="portal-field-label">Password</label>' +
    '<input type="password" name="password" class="portal-text-input input-admin" value="demo123" placeholder="••••••••" autocomplete="current-password" required>' +
    '</div>' +
    '<button type="submit" class="portal-submit-pill btn-admin">LOG IN</button>' +
    '</form>' +
    '<div class="portal-card-footer">' +
    '<div class="portal-meta-action" onclick="demoLogin(\'admin@nit.edu\')" title="Click to instantly test as Admin Officer">' +
    'Logged in as: <strong>Admin Officer</strong>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderProfessionalCard() {
  var isAcademician = (ui.portalTab === 'academician');
  var defaultEmail = isAcademician ? 'rohan@university.edu' : 'priya@technova.com';
  var activeLabel = isAcademician ? 'Dr. Rohan Mehta' : 'Priya Nair (TechNova)';

  return '' +
    '<div class="portal-column-card professional-card featured-card">' +
    '<!-- Top Cyan Cap with Briefcase Badge -->' +
    '<div class="portal-card-top-cap cap-professional">' +
    '<div class="portal-badge-bubble badge-professional">' +
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none">' +
    '<rect x="3" y="7" width="18" height="13" rx="2.5" fill="#f0f9ff" stroke="#0284c7" stroke-width="2"/>' +
    '<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#0284c7" stroke-width="2"/>' +
    '<line x1="3" y1="12" x2="21" y2="12" stroke="#0284c7" stroke-width="1.8"/>' +
    '<rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill="#0284c7"/>' +
    '</svg>' +
    '</div>' +
    '</div>' +

    '<!-- Inner Form Card -->' +
    '<div class="portal-card-body">' +
    '<h2 class="portal-card-title">PROFESSIONAL LOGIN</h2>' +

    '<!-- Segmented Role Switcher Toggle (Industry Partner vs Academician) -->' +
    '<div class="portal-role-segmented-pill" role="tablist">' +
    '<button type="button" class="role-segment-btn ' + (!isAcademician ? 'active' : '') + '" onclick="setPortalTab(\'industry\')">' +
    '🏢 Industry Partner' +
    '</button>' +
    '<button type="button" class="role-segment-btn ' + (isAcademician ? 'active' : '') + '" onclick="setPortalTab(\'academician\')">' +
    '🎓 Academician' +
    '</button>' +
    '</div>' +

    '<form onsubmit="return handleLogin(event)">' +
    '<div class="portal-field">' +
    '<label class="portal-field-label">Email Address</label>' +
    '<input type="email" name="email" class="portal-text-input input-professional" value="' + defaultEmail + '" placeholder="' + defaultEmail + '" autocomplete="email" required>' +
    '</div>' +
    '<div class="portal-field">' +
    '<label class="portal-field-label">Password</label>' +
    '<input type="password" name="password" class="portal-text-input input-professional" value="demo123" placeholder="••••••••" autocomplete="current-password" required>' +
    '</div>' +
    '<button type="submit" class="portal-submit-pill btn-professional">LOG IN</button>' +
    '</form>' +

    '<div class="portal-card-footer">' +
    '<div class="portal-meta-action" onclick="demoLogin(\'' + defaultEmail + '\')" title="Click to instantly test this role">' +
    'Active as: <strong>' + activeLabel + '</strong>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderStudentCard() {
  return '' +
    '<div class="portal-column-card student-card">' +
    '<!-- Top Orange Cap with Graduation Cap Badge -->' +
    '<div class="portal-card-top-cap cap-student">' +
    '<div class="portal-badge-bubble badge-student">' +
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none">' +
    '<path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="#fff7ed" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" stroke="#ea580c" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>' +
    '</div>' +
    '</div>' +

    '<!-- Inner Form Card -->' +
    '<div class="portal-card-body">' +
    '<h2 class="portal-card-title">STUDENT LOGIN</h2>' +
    '<form onsubmit="return handleLogin(event)">' +
    '<div class="portal-field">' +
    '<label class="portal-field-label">Student ID / Email</label>' +
    '<input type="text" name="email" class="portal-text-input input-student" value="aditi@student.edu" placeholder="aditi@student.edu" autocomplete="username" required>' +
    '</div>' +
    '<div class="portal-field">' +
    '<label class="portal-field-label">Password</label>' +
    '<input type="password" name="password" class="portal-text-input input-student" value="demo123" placeholder="••••••••" autocomplete="current-password" required>' +
    '</div>' +
    '<button type="submit" class="portal-submit-pill btn-student">LOG IN</button>' +
    '</form>' +
    '<div class="portal-card-footer">' +
    '<div class="portal-meta-action" onclick="demoLogin(\'aditi@student.edu\')" title="Click to instantly test as Aditi">' +
    'Active as: <strong>Aditi Sharma (B.Tech)</strong>' +
    '</div>' +
    '<div class="portal-sub-action">' +
    'New Student? <a onclick="switchAuthTab(\'signup\')">Sign Up</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderSimulatorModal() {
  var skill = ui.simSelectedSkill;
  var matchScores = {
    'React': { score: 96, role: 'Frontend Developer Intern', company: 'TechNova Solutions', status: 'Immediate Shortlist' },
    'Python': { score: 92, role: 'AI Applications Trainee', company: 'TechNova Solutions', status: 'High Affinity' },
    'Data Analysis': { score: 88, role: 'Analytics Storytelling Fellow', company: 'TechNova Solutions', status: 'Eligible' },
    'Machine Learning': { score: 98, role: 'Research Associate — Applied ML', company: 'NIT Computer Science Lab', status: 'Professor Endorsed' }
  };
  var currentMatch = matchScores[skill] || matchScores['React'];

  return '' +
    '<div class="velyx-simulator-panel">' +
    '<div class="simulator-header">' +
    '<div>' +
    '<div class="sim-pill">SkillBridge AI Telemetry Engine</div>' +
    '<h3 class="sim-title">Live Candidate & Internship Match Simulator</h3>' +
    '</div>' +
    '<button type="button" class="sim-close" onclick="toggleSimulator()">✕ Close</button>' +
    '</div>' +
    '<div class="simulator-body">' +
    '<div class="sim-col">' +
    '<label class="sim-label">Select Student Core Competency:</label>' +
    '<div class="sim-chips">' +
    ['React', 'Python', 'Data Analysis', 'Machine Learning'].map(function (s) {
      return '<button type="button" class="sim-chip ' + (s === skill ? 'active' : '') + '" onclick="setSimSkill(\'' + s + '\')">' + s + '</button>';
    }).join('') +
    '</div>' +
    '<div class="sim-candidate-card">' +
    '<div class="sim-candidate-header">' +
    '<div class="sim-avatar">AS</div>' +
    '<div>' +
    '<div class="sim-name">Aditi Sharma (Student)</div>' +
    '<div class="sim-sub">National Institute of Technology • 3rd Year B.Tech</div>' +
    '</div>' +
    '</div>' +
    '<div class="sim-verified-tag">✓ Verified Student 360 Record</div>' +
    '</div>' +
    '</div>' +

    '<div class="sim-col sim-result-col">' +
    '<label class="sim-label">Autonomous Industry Match Telemetry:</label>' +
    '<div class="sim-result-card">' +
    '<div class="sim-match-circle">' +
    '<span class="sim-pct">' + currentMatch.score + '%</span>' +
    '<span class="sim-pct-lbl">Match Score</span>' +
    '</div>' +
    '<div class="sim-match-info">' +
    '<div class="sim-opp-title">' + currentMatch.role + '</div>' +
    '<div class="sim-opp-org">' + currentMatch.company + '</div>' +
    '<div class="sim-opp-status">Status: ' + currentMatch.status + '</div>' +
    '<button type="button" class="sim-whatsapp-btn" onclick="showToast(\'⚡ Simulation: Verified WhatsApp interview pass sent to student phone via Meta Cloud API!\')">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.676.15-.2.301-.776.979-.952 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.234-.244-.587-.492-.507-.677-.516h-.577c-.2 0-.526.075-.802.376-.275.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.11.15.201 2.12 3.238 5.136 4.542.717.311 1.277.496 1.714.635.72.23 1.375.197 1.893.12.578-.087 1.78-.727 2.03-1.43.251-.702.251-1.304.176-1.43-.075-.125-.276-.2-.577-.35z"/></svg>' +
    '<span>Dispatch 1-Tap WhatsApp Alert</span>' +
    '</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderSignupPanel() {
  return '' +
    '<div class="auth-shell single">' +
    '<div class="auth-card">' +
    '<div class="signup-back"><a onclick="switchAuthTab(\'login\')">&larr; Back to portal selection</a></div>' +
    renderSignupForm() +
    '</div>' +
    '</div>';
}

function renderLoginForm() {
  return '' +
    '<h1>Welcome back</h1>' +
    '<p class="auth-subtitle">Log in to continue building your skill profile.</p>' +
    (ui.authError ? '<div class="auth-error">' + escapeHtml(ui.authError) + '</div>' : '') +
    '<form onsubmit="return handleLogin(event)">' +
    '<label>Email</label>' +
    '<input type="email" name="email" placeholder="you@example.com" required>' +
    '<label>Password</label>' +
    '<input type="password" name="password" placeholder="••••••••" required>' +
    '<button type="submit" class="auth-button">Log in</button>' +
    '</form>' +
    '<div class="auth-footer">New here? <a onclick="switchAuthTab(\'signup\')">Create an account</a></div>';
}

function renderSignupForm() {
  return '' +
    '<h1>Create your account</h1>' +
    '<p class="auth-subtitle">Tell us who you are so we can set up the right dashboard.</p>' +
    (ui.authError ? '<div class="auth-error">' + escapeHtml(ui.authError) + '</div>' : '') +
    '<form onsubmit="return handleSignup(event)">' +
    '<label>Full name</label>' +
    '<input type="text" name="name" placeholder="Jordan Lee" required>' +
    '<label>Email</label>' +
    '<input type="email" name="email" placeholder="you@example.com" required>' +
    '<label>Password</label>' +
    '<input type="password" name="password" placeholder="Create a password" required minlength="4">' +
    '<label>I am a...</label>' +
    '<select name="role" required>' +
    '<option value="student">Student</option>' +
    '<option value="academician">Academician</option>' +
    '<option value="industry">Industry Representative</option>' +
    '<option value="admin">Institution Admin</option>' +
    '</select>' +
    '<label>Institution / Organization</label>' +
    '<input type="text" name="org" placeholder="e.g. Your college or company name">' +
    '<button type="submit" class="auth-button">Create account</button>' +
    '</form>' +
    '<div class="auth-footer">Already have an account? <a onclick="switchAuthTab(\'login\')">Log in</a></div>';
}

function switchAuthTab(tab) { ui.authTab = tab; ui.authError = ''; render(); }

async function handleLogin(e) {
  e.preventDefault();
  var f = new FormData(e.target);
  var email = (f.get('email') || '').trim();
  var password = (f.get('password') || '').trim();
  if (!password || password === '••••••••') {
    password = 'demo123';
  }
  try {
    var res = await api.login(email, password);
    setToken(res.token);
    session.user = res.user;
    session.view = 'dashboard';
    ui.authError = '';
    await render();
  } catch (err) {
    ui.authError = err.message;
    render();
  }
  return false;
}

async function handleSignup(e) {
  e.preventDefault();
  var f = new FormData(e.target);
  try {
    var res = await api.register({
      name: f.get('name'), email: f.get('email'), password: f.get('password'),
      role: f.get('role'), org: f.get('org')
    });
    setToken(res.token);
    session.user = res.user;
    session.view = 'dashboard';
    ui.authError = '';
    await render();
  } catch (err) {
    ui.authError = err.message;
    render();
  }
  return false;
}

async function demoLogin(email) {
  try {
    var res = await api.login(email, 'demo123');
    setToken(res.token);
    session.user = res.user;
    session.view = 'dashboard';
    await render();
  } catch (err) { showToast(err.message); }
}

function logout() {
  setToken(null);
  session.user = null;
  ui.profileMenuOpen = false;
  render();
}

/* =========================================================
   RENDER: APP SHELL
========================================================= */
async function setView(view) { session.view = view; ui.profileMenuOpen = false; await render(); }
function toggleProfileMenu() { ui.profileMenuOpen = !ui.profileMenuOpen; render(); }

function getDashboardFormattedDate() {
  var d = new Date();
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var dayName = days[d.getDay()];
  var dayNum = (d.getDate() < 10 ? '0' : '') + d.getDate();
  var monthName = months[d.getMonth()];
  var year = d.getFullYear();
  return dayName + ', ' + dayNum + ' ' + monthName + ' ' + year;
}

async function renderAppShell() {
  var user = session.user;
  var nav = NAV[user.role];

  var navHtml = nav.map(function (item) {
    var isCurrent = session.view === item[0];
    var activeClass = isCurrent ? 'active' : '';
    var dotHtml = isCurrent ? '<span class="sidebar-dot active-dot">🔴</span>' : '<span class="sidebar-dot">⚪</span>';
    return '<button class="' + activeClass + '" onclick="setView(\'' + item[0] + '\')">' +
      dotHtml +
      '<span style="font-size:15px;">' + item[2] + '</span>' +
      '<span>' + item[1] + '</span>' +
      '</button>';
  }).join('');

  var dropdown = ui.profileMenuOpen ? (
    '<div class="profile-dropdown">' +
    '<div class="profile-dropdown-header">' +
    '<div class="dropdown-avatar">' + initials(user.name) + '</div>' +
    '<div class="dropdown-user-info"><strong>' + escapeHtml(user.name) + '</strong><span>' + escapeHtml(user.email) + '</span></div>' +
    '</div>' +
    '<button onclick="setView(\'profile\')">👤 Edit Profile</button>' +
    '<div class="profile-dropdown-divider"></div>' +
    '<button class="profile-logout" onclick="logout()">🚪 Log out</button>' +
    '</div>'
  ) : '';

  var titleInfo = viewTitle(user);
  var contentHtml = await renderContent(user);

  return '' +
    '<div class="dashboard-page">' +
    '<!-- Sidebar with 3 Mini Widgets (Image 1 Reference) -->' +
    '<aside class="sidebar">' +
    '<div class="logo">' +
    '<img src="assets/logo.png" alt="Skill Bridge Logo" class="brand-logo-img">' +
    '<div class="brand-text-block">' +
    '<span class="brand-text-title">Skill Bridge</span>' +
    '<span class="brand-text-sub">Connecting Talent to Opportunity</span>' +
    '</div>' +
    '</div>' +

    '<nav>' + navHtml + '</nav>' +

    '<!-- 3 Sidebar Summary Cards (Directly from Image 1) -->' +
    '<div class="sidebar-mini-widgets">' +
    '<div class="sidebar-mini-card">' +
    '<span class="mini-lbl">30-Day Opportunities</span>' +
    '<span class="mini-val">24</span>' +
    '</div>' +
    '<div class="sidebar-mini-card">' +
    '<span class="mini-lbl">Corporate Partners</span>' +
    '<span class="mini-val">312</span>' +
    '</div>' +
    '<div class="sidebar-mini-card">' +
    '<span class="mini-lbl">Student Placement</span>' +
    '<span class="mini-val text-green">94.8%</span>' +
    '</div>' +
    '</div>' +

    '<button class="logout-button" onclick="logout()">🚪 Log out</button>' +
    '</aside>' +

    '<!-- Main View Area (Image 1, 2, 3 Reference) -->' +
    '<main class="dashboard-main">' +
    '<div class="dashboard-header">' +
    '<div class="header-left-block">' +
    '<div class="header-user-tag-row">' +
    '<div class="header-avatar-circle">' + initials(user.name) + '</div>' +
    '<span class="badge-role-tag">' + (ROLE_LABEL[user.role] || user.role) + '</span>' +
    '<span class="badge-org-tag">' + escapeHtml(user.institution || user.orgName || 'National Institute of Technology') + '</span>' +
    '</div>' +
    '<h1>' + titleInfo.title + '</h1>' +
    '<p class="dashboard-date">' + getDashboardFormattedDate() + '</p>' +
    '</div>' +

    '<div class="header-actions-right">' +
    '<button type="button" class="btn-sky-action" onclick="showToast(\'⚡ Live Event Simulation: Real-time telemetry dispatched to WhatsApp Cloud API!\')">' +
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' +
    '<span>Simulate Live Event</span>' +
    '</button>' +
    '<button type="button" class="btn-white-action" onclick="setView(\'opportunities\')">Manage Portal</button>' +
    '<div class="profile-menu">' +
    '<button class="profile-circle" onclick="toggleProfileMenu()">' + initials(user.name) + '</button>' +
    dropdown +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div id="view-content">' + contentHtml + '</div>' +

    '<!-- Floating Guide (From Image 2 & 3) -->' +
    '<div class="floating-sandbox-guide" onclick="showToast(\'✨ SkillBridge Simulator Sandbox v2.4 active: 100% On-Campus Data Sovereignty\')">' +
    '<span>✨</span><span>Simulator Sandbox Guide</span>' +
    '</div>' +
    '</main>' +
    '</div>';
}

function viewTitle(user) {
  var v = session.view;
  var map = {
    dashboard: { title: 'Dashboard', subtitle: 'Welcome back, ' + user.name.split(' ')[0] + '.' },
    profile: { title: 'My Profile', subtitle: 'Keep your information up to date.' },
    skills: { title: 'Skills & Competencies', subtitle: 'Track verified skill achievements and endorsements.' },
    assessment: { title: 'Skill Assessment', subtitle: 'Rate yourself honestly — this shapes your recommendations.' },
    projects: { title: 'Projects', subtitle: 'Showcase what you have built.' },
    opportunities: { title: user.role === 'industry' ? 'Manage Opportunities' : 'Opportunities', subtitle: user.role === 'industry' ? 'Post and manage internships, jobs, and training programs.' : 'Internships, jobs, and training matched to your skills.' },
    applicants: { title: 'Applicants & Talent Pool', subtitle: 'Review and manage candidates for your postings.' },
    mentorship: { title: 'Mentorship', subtitle: (user.role === 'student') ? 'Connect with mentors from academia and industry.' : 'Manage mentorship requests from students.' },
    events: { title: 'Events & Sessions', subtitle: 'Workshops, guest lectures, and innovation challenges.' },
    portfolio: { title: 'Digital Portfolio', subtitle: 'A shareable snapshot of your skills and work.' },
    programs: { title: 'Programs & Collaborations', subtitle: 'FDPs, industrial training, consultancy, and collaborative projects.' },
    users: { title: 'Faculty & Directory', subtitle: 'Campus directory with roles, designations, and specializations.' },
    analytics: { title: 'Institutional Analytics', subtitle: 'Skill demand, supply, and placement trends.' }
  };
  return map[v] || { title: 'Dashboard', subtitle: '' };
}

async function renderContent(user) {
  var v = session.view;
  try {
    if (user.role === 'student') {
      if (v === 'dashboard') return await studentDashboard(user);
      if (v === 'profile') return renderProfileForm(user);
      if (v === 'skills') return await renderSkillsView(user);
      if (v === 'assessment') return await renderAssessmentView(user);
      if (v === 'projects') return renderProjectsView(user);
      if (v === 'opportunities') return await renderOpportunitiesBrowse(user);
      if (v === 'mentorship') return await renderMentorshipStudent(user);
      if (v === 'events') return await renderEventsView(user);
      if (v === 'portfolio') return await renderPortfolioView(user);
    }
    if (user.role === 'academician') {
      if (v === 'dashboard') return await academicianDashboard(user);
      if (v === 'profile') return renderProfileForm(user);
      if (v === 'programs') return await renderProgramsView(user);
      if (v === 'mentorship') return await renderMentorshipAsMentor(user);
      if (v === 'events') return await renderEventsView(user);
    }
    if (user.role === 'industry') {
      if (v === 'dashboard') return await industryDashboard(user);
      if (v === 'profile') return renderProfileForm(user);
      if (v === 'opportunities') return await renderOpportunitiesManage(user);
      if (v === 'applicants') return await renderApplicantsView(user);
      if (v === 'mentorship') return await renderMentorshipAsMentor(user);
      if (v === 'events') return await renderEventsView(user);
    }
    if (user.role === 'admin') {
      if (v === 'dashboard') return await adminDashboard(user);
      if (v === 'users') return await renderUsersView(user);
      if (v === 'opportunities') return await renderAdminOpportunities(user);
      if (v === 'analytics') return await renderAnalyticsView(user);
      if (v === 'events') return await renderEventsView(user);
    }
    return await studentDashboard(user);
  } catch (err) {
    return '<div class="dashboard-section"><p class="auth-error">Could not load this page: ' + escapeHtml(err.message) + '</p></div>';
  }
}

/* re-renders just the content pane (keeps focus in filter inputs) */
async function renderContentOnly() {
  var html = await renderContent(session.user);
  document.getElementById('view-content').innerHTML = html;
}

/* =========================================================
   SHARED: PROFILE CARD + PROFILE FORM
========================================================= */
function profileCompleteness(user) {
  var checks = [
    !!user.name, !!user.headline, !!user.bio,
    (user.skills || []).length > 0, !!(user.orgName || user.institution)
  ];
  if (user.role === 'student') checks.push((user.projects || []).length > 0);
  var done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function ringChartHtml(pct, label) {
  var deg = Math.round(pct * 3.6);
  return '' +
    '<div class="ring-chart" style="background:conic-gradient(var(--ring-color) ' + deg + 'deg, var(--ring-track) ' + deg + 'deg)">' +
    '<div class="ring-chart-inner"><strong>' + pct + '%</strong><span>' + label + '</span></div>' +
    '</div>';
}

function profileCardHtml(user, extraLine) {
  var pct = profileCompleteness(user);
  return '' +
    '<div class="profile-card">' +
    '<div class="profile-avatar">' + initials(user.name) + '</div>' +
    '<div class="profile-info">' +
    '<h2>' + escapeHtml(user.name) + '</h2>' +
    '<p>' + escapeHtml(user.headline || (user.orgName || user.institution || '')) + '</p>' +
    '<div class="profile-role"><span class="role-badge ' + user.role + '">' + ROLE_LABEL[user.role] + '</span>' + (extraLine || '') + '</div>' +
    '</div>' +
    ringChartHtml(pct, 'Profile') +
    '<button class="edit-profile" onclick="setView(\'profile\')">Edit Profile</button>' +
    '</div>';
}

function renderProfileForm(user) {
  var orgLabel = user.role === 'industry' ? 'Organization Name' : 'Institution';
  var orgVal = user.role === 'industry' ? (user.orgName || '') : (user.institution || '');
  var extraFields = '';
  if (user.role === 'industry') {
    extraFields = '<div class="form-group"><label>Sector</label><input type="text" name="sector" value="' + escapeHtml(user.sector || '') + '" placeholder="e.g. Software & IT Services"></div>';
  }
  if (user.role === 'academician') {
    extraFields = '<div class="form-group"><label>Department</label><input type="text" name="department" value="' + escapeHtml(user.department || '') + '" placeholder="e.g. Computer Science"></div>';
  }
  var mentorToggle = (user.role === 'academician' || user.role === 'industry') ? (
    '<div class="form-group full-width">' +
    '<label>Available as a Mentor</label>' +
    '<div class="checkbox-toggle"><button type="button" class="switch ' + (user.isMentor ? 'on' : '') + '" onclick="toggleMentor()"></button>' +
    '<span style="color:#6b7280;font-size:13.5px;">Students will be able to find you and request mentorship.</span></div>' +
    '</div>'
  ) : '';

  return '' +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>Profile details</h2><p>This information appears on your dashboard and, if applicable, your portfolio.</p></div></div>' +
    '<form onsubmit="return saveProfile(event)">' +
    '<div class="profile-form">' +
    '<div class="form-group"><label>Full Name</label><input type="text" name="name" value="' + escapeHtml(user.name) + '" required></div>' +
    '<div class="form-group"><label>Email</label><input type="email" value="' + escapeHtml(user.email) + '" disabled style="background:#f3f4f6;color:#9ca3af;"></div>' +
    '<div class="form-group"><label>Headline</label><input type="text" name="headline" value="' + escapeHtml(user.headline || '') + '" placeholder="A one-line description of who you are"></div>' +
    '<div class="form-group"><label>' + orgLabel + '</label><input type="text" name="org" value="' + escapeHtml(orgVal) + '"></div>' +
    extraFields +
    '<div class="form-group full-width"><label>Bio</label><textarea name="bio" placeholder="Tell others about yourself...">' + escapeHtml(user.bio || '') + '</textarea></div>' +
    mentorToggle +
    '</div>' +
    '<div class="profile-actions"><span class="save-message" id="save-msg"></span><button type="submit" class="primary-btn save-profile">Save Changes</button></div>' +
    '</form>' +
    '</div>';
}

async function saveProfile(e) {
  e.preventDefault();
  var f = new FormData(e.target);
  await guarded(async function () {
    var res = await api.updateProfile({
      name: f.get('name'), headline: f.get('headline'), bio: f.get('bio'),
      org: f.get('org'), sector: f.get('sector'), department: f.get('department')
    });
    session.user = res.user;
    showToast('Profile saved.');
    await render();
  });
  return false;
}

async function toggleMentor() {
  await guarded(async function () {
    var res = await api.toggleMentor();
    session.user = res.user;
    await render();
  });
}

/* =========================================================
   SKILLBRIDGE MODERN DASHBOARD (Light & Bright Image Reference)
========================================================= */
function renderSkillBridgeModernDashboard(user, opts) {
  opts = opts || {};
  var alert1Text = opts.alert1Text || 'Opportunity Application Deadline: 2 matched applications close within 48 hours.';
  var alert2Text = opts.alert2Text || 'Skill Verification Milestone at 88%: Complete your assessment to reach top-tier candidate status.';

  var c1Title = opts.c1Title || 'RECOMMENDED MATCHES';
  var c1Val = opts.c1Val || '18 Matches';
  var c1Sub = opts.c1Sub || '4 new this week';

  var c2Title = opts.c2Title || 'SKILL READINESS';
  var c2Val = opts.c2Val || '88.4%';
  var c2Sub = opts.c2Sub || 'Top 10% in cohort';

  var c3Title = opts.c3Title || 'ACTIVE APPLICATIONS';
  var c3Val = opts.c3Val || '6 In Review';
  var c3Sub = opts.c3Sub || '2 shortlisted';

  var c4Title = opts.c4Title || 'MENTORSHIP HOURS';
  var c4Val = opts.c4Val || '14 Hours';
  var c4Sub = opts.c4Sub || '3 sessions completed';

  var chartTitle = opts.chartTitle || 'Skill Acquisition vs Industry Demand';
  var legendLine1 = opts.legendLine1 || 'Market Demand';
  var legendLine2 = opts.legendLine2 || 'Skill Velocity';

  var donutCenter = opts.donutCenter || '88.4%';
  var donutCenterSub = opts.donutCenterSub || 'Core Fit';

  var donutItems = opts.donutItems || [
    { label: 'Cloud & DevOps', pct: '32.4%', color: '#38bdf8' },
    { label: 'AI & Machine Learning', pct: '28.2%', color: '#f87171' },
    { label: 'Data Engineering', pct: '20.8%', color: '#34d399' },
    { label: 'Full-Stack Web', pct: '18.6%', color: '#fbbf24' }
  ];

  var donutLegendHtml = donutItems.map(function (item) {
    return '<div class="donut-legend-item"><span class="donut-dot" style="background:' + item.color + ';"></span><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.pct) + '</strong></div>';
  }).join('');

  var sessions = opts.sessions || [
    { title: 'Full-Stack System Architecture', status: 'COMPLETED', statusClass: 'status-completed', meta: 'Mentor Dr. Rajesh Iyer · Room Lab B-201', time: '08:30 AM – 09:20 AM' },
    { title: 'Cloud DevOps & CI/CD Pipelines', status: 'IN PROGRESS', statusClass: 'status-inprogress', meta: 'TechNova Lead Sunita Rao · Room 304', time: '09:30 AM – 10:20 AM' },
    { title: 'Generative AI & LLM Deployment', status: 'UPCOMING', statusClass: 'status-upcoming', meta: 'Faculty Lead Vikram Malhotra · Room 102', time: '10:45 AM – 11:35 AM' },
    { title: 'Technical Interview Masterclass', status: 'UPCOMING', statusClass: 'status-upcoming', meta: 'Placement Cell Priya Menon · Auditorium', time: '11:45 AM – 12:35 PM' }
  ];

  var sessionsHtml = sessions.map(function (s) {
    return '<div class="session-item">' +
      '<div>' +
      '<div class="session-title-wrap"><strong>' + escapeHtml(s.title) + '</strong><span class="pill-status ' + s.statusClass + '">' + escapeHtml(s.status) + '</span></div>' +
      '<div class="session-meta">' + escapeHtml(s.meta) + '</div>' +
      '</div>' +
      '<div class="session-time">' + escapeHtml(s.time) + '</div>' +
      '</div>';
  }).join('');

  var notifs = opts.notifs || [
    { title: 'Opportunity Shortlisted', time: '2m ago', body: 'Your application for Frontend Engineer Intern at TechNova was shortlisted.' },
    { title: 'Assessment Verified', time: '18m ago', body: 'Dr. Rajesh Iyer verified your Intermediate React & Node.js competencies.' },
    { title: 'Mentorship Session Confirmed', time: '42m ago', body: 'Sunita Rao accepted your 1-on-1 mentorship session invitation for tomorrow.' },
    { title: 'New Industry Challenge Posted', time: '2h ago', body: 'FinTech Innovation Challenge 2026 is now open for project submissions.' }
  ];

  var notifsHtml = notifs.map(function (n) {
    return '<div class="notification-item">' +
      '<div class="notification-head"><strong>' + escapeHtml(n.title) + '</strong><span class="notification-time">' + escapeHtml(n.time) + '</span></div>' +
      '<p class="notification-body">' + escapeHtml(n.body) + '</p>' +
      '</div>';
  }).join('');

  return '' +
    '<!-- Top Alert Banners (Image 1 Visual Style) -->' +
    '<div class="dashboard-alert-banners">' +
    '<div class="dashboard-alert-banner alert-rose">' +
    '<span class="alert-badge-icon">🚨</span>' +
    '<span>' + escapeHtml(alert1Text) + '</span>' +
    '</div>' +
    '<div class="dashboard-alert-banner alert-amber">' +
    '<span class="alert-badge-icon">⚠️</span>' +
    '<span>' + escapeHtml(alert2Text) + '</span>' +
    '</div>' +
    '</div>' +

    '<!-- 4-Column Modern Metric Quad Grid (Image 1 & 3 Visual Style) -->' +
    '<div class="metrics-quad-grid">' +
    '<div class="metric-card-modern">' +
    '<div class="metric-title"><span>' + escapeHtml(c1Title) + '</span></div>' +
    '<div class="metric-value text-coral">' + escapeHtml(c1Val) + '</div>' +
    '<div class="metric-sub">' + escapeHtml(c1Sub) + '</div>' +
    '</div>' +
    '<div class="metric-card-modern">' +
    '<div class="metric-title"><span>' + escapeHtml(c2Title) + '</span></div>' +
    '<div class="metric-value text-sprinkle-green">' + escapeHtml(c2Val) + '</div>' +
    '<div class="metric-sub">' + escapeHtml(c2Sub) + '</div>' +
    '</div>' +
    '<div class="metric-card-modern">' +
    '<div class="metric-title"><span>' + escapeHtml(c3Title) + '</span></div>' +
    '<div class="metric-value text-amber">' + escapeHtml(c3Val) + '</div>' +
    '<div class="metric-sub">' + escapeHtml(c3Sub) + '</div>' +
    '</div>' +
    '<div class="metric-card-modern">' +
    '<div class="metric-title"><span>' + escapeHtml(c4Title) + '</span></div>' +
    '<div class="metric-value text-sky-blue">' + escapeHtml(c4Val) + '</div>' +
    '<div class="metric-sub">' + escapeHtml(c4Sub) + '</div>' +
    '</div>' +
    '</div>' +

    '<!-- Charts Duo Grid: Skill Velocity & Pastel Donut (Image 1 & 4 Visual Style) -->' +
    '<div class="charts-duo-grid">' +
    '<div class="chart-section-wrap">' +
    '<div class="chart-header-block">' +
    '<h2>' + escapeHtml(chartTitle) + '</h2>' +
    '<div class="chart-legend-row">' +
    '<div class="chart-legend-item"><span class="legend-swatch swatch-coral"></span><span>' + escapeHtml(legendLine1) + '</span></div>' +
    '<div class="chart-legend-item"><span class="legend-swatch swatch-green"></span><span>' + escapeHtml(legendLine2) + '</span></div>' +
    '</div>' +
    '</div>' +
    '<svg class="line-chart-svg-box" viewBox="0 0 600 220" preserveAspectRatio="none">' +
    '<defs>' +
    '<linearGradient id="sprinkleGreenArea" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#10b981" stop-opacity="0.32"/>' +
    '<stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<!-- Horizontal Grid lines -->' +
    '<line x1="45" y1="40" x2="580" y2="40" stroke="#f1f5f9" stroke-width="1"/>' +
    '<text x="25" y="44" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="middle">100%</text>' +
    '<line x1="45" y1="95" x2="580" y2="95" stroke="#f1f5f9" stroke-width="1"/>' +
    '<text x="25" y="99" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="middle">75%</text>' +
    '<line x1="45" y1="150" x2="580" y2="150" stroke="#f1f5f9" stroke-width="1"/>' +
    '<text x="25" y="154" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="middle">50%</text>' +
    '<line x1="45" y1="195" x2="580" y2="195" stroke="#f1f5f9" stroke-width="1"/>' +
    '<text x="25" y="199" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="middle">25%</text>' +
    '<!-- Coral benchmark indicator marker -->' +
    '<line x1="50" y1="185" x2="115" y2="185" stroke="#f87171" stroke-width="6" stroke-linecap="round"/>' +
    '<!-- Sprinkle Green Velocity Curve Area -->' +
    '<path d="M 50 195 C 120 195, 140 185, 180 180 C 220 175, 250 140, 300 130 C 350 120, 380 90, 440 80 C 490 70, 520 48, 580 50 L 580 195 L 50 195 Z" fill="url(#sprinkleGreenArea)"/>' +
    '<path d="M 50 195 C 120 195, 140 185, 180 180 C 220 175, 250 140, 300 130 C 350 120, 380 90, 440 80 C 490 70, 520 48, 580 50" fill="none" stroke="#10b981" stroke-width="3.5" stroke-linecap="round"/>' +
    '<circle cx="180" cy="180" r="4" fill="#10b981"/>' +
    '<circle cx="300" cy="130" r="4" fill="#10b981"/>' +
    '<circle cx="440" cy="80" r="4" fill="#10b981"/>' +
    '<circle cx="580" cy="50" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2"/>' +
    '</svg>' +
    '</div>' +

    '<div class="chart-section-wrap donut-chart-container">' +
    '<div class="donut-svg-wrap">' +
    '<svg viewBox="0 0 100 100">' +
    '<circle cx="50" cy="50" r="38" fill="transparent" stroke="#f87171" stroke-width="14" stroke-dasharray="54 185" stroke-dashoffset="0"/>' +
    '<circle cx="50" cy="50" r="38" fill="transparent" stroke="#38bdf8" stroke-width="14" stroke-dasharray="67 172" stroke-dashoffset="-54"/>' +
    '<circle cx="50" cy="50" r="38" fill="transparent" stroke="#fbbf24" stroke-width="14" stroke-dasharray="36 203" stroke-dashoffset="-121"/>' +
    '<circle cx="50" cy="50" r="38" fill="transparent" stroke="#34d399" stroke-width="14" stroke-dasharray="81 158" stroke-dashoffset="-157"/>' +
    '</svg>' +
    '<div class="donut-center-metric">' +
    '<div class="metric-main">' + escapeHtml(donutCenter) + '</div>' +
    '<div class="metric-sub">' + escapeHtml(donutCenterSub) + '</div>' +
    '</div>' +
    '</div>' +
    '<div class="donut-legend-grid">' +
    donutLegendHtml +
    '</div>' +
    '</div>' +
    '</div>' +

    '<!-- Operational Duo Grid: Scheduled Sessions & Notification Stream (Image 3 Visual Style) -->' +
    '<div class="operational-duo-grid">' +
    '<div class="operational-card">' +
    '<div class="operational-head">' +
    '<div><h2>' + escapeHtml(opts.sessionsTitle || "Today's Collaborative Sessions") + '</h2><p>' + escapeHtml(opts.sessionsSub || "Live campus & industry schedule") + '</p></div>' +
    '<a class="operational-head-link" onclick="setView(\'events\')">View All Sessions →</a>' +
    '</div>' +
    '<div class="session-items-list">' +
    sessionsHtml +
    '</div>' +
    '</div>' +

    '<div class="operational-card">' +
    '<div class="operational-head">' +
    '<div><h2>' + escapeHtml(opts.notifsTitle || "Live Activity Stream") + '</h2><p>' + escapeHtml(opts.notifsSub || "Real-time portal updates") + '</p></div>' +
    '<a class="operational-head-link" onclick="setView(\'events\')">All Notifications →</a>' +
    '</div>' +
    '<div class="notification-items-list">' +
    notifsHtml +
    '</div>' +
    '</div>' +
    '</div>';
}

/* =========================================================
   STUDENT: DASHBOARD
========================================================= */
async function studentDashboard(user) {
  var apps = (await api.myApplications()).applications;
  var opps = (await api.listOpportunities()).opportunities;
  var recommended = opps.slice().sort(function (a, b) { return (b.match || 0) - (a.match || 0); }).slice(0, 3);

  var recHtml = recommended.length ? recommended.map(function (o) {
    return '<div class="education-card">' +
      '<div class="education-icon">🚀</div>' +
      '<div style="flex:1;min-width:180px;"><h3>' + escapeHtml(o.title) + '</h3><p>' + escapeHtml(o.industryName) + ' · ' + escapeHtml(o.type) + '</p></div>' +
      '<div class="match-score ' + matchClass(o.match || 0) + '">' + (o.match || 0) + '%<small>match</small></div>' +
      '</div>';
  }).join('') : '<p class="empty-message">Add a few skills to get personalized opportunity recommendations.</p>';

  var shortlistedCount = apps.filter(function (a) { return a.status === 'Shortlisted' || a.status === 'Selected'; }).length;
  var events = (await api.listEvents()).events || [];
  var todayStr = new Date().toISOString().slice(0, 10);
  var studentSessions = events.map(function (ev) {
    var rsvped = (ev.rsvps || []).indexOf(user.id) > -1;
    var status = 'UPCOMING';
    var statusClass = 'status-upcoming';
    if (ev.date && ev.date < todayStr) {
      status = 'COMPLETED';
      statusClass = 'status-completed';
    } else if (ev.date && ev.date === todayStr) {
      status = 'IN PROGRESS';
      statusClass = 'status-inprogress';
    }
    return {
      title: ev.title,
      status: rsvped ? (status + ' (RSVP)') : status,
      statusClass: statusClass,
      meta: (ev.type || 'Event') + ' · ' + (ev.location || 'Campus') + ' · Hosted by ' + (ev.organizerName || 'Partner'),
      time: (ev.time ? ev.time + ' · ' : '') + fmtDate(ev.date)
    };
  });
  if (!studentSessions.length) {
    studentSessions = [
      { title: 'Campus Collaborative Workshop', status: 'UPCOMING', statusClass: 'status-upcoming', meta: 'Innovation Lab · Campus Hall', time: 'Schedule in Events' }
    ];
  }

  return '' +
    renderSkillBridgeModernDashboard(user, {
      alert1Text: 'Opportunity Application Deadline: 2 matched applications close within 48 hours (TechNova & Google Cloud).',
      alert2Text: 'Skill Verification Milestone at 88%: Complete your assessment to reach top-tier candidate status.',
      c1Title: 'RECOMMENDED MATCHES',
      c1Val: String(opps.length || 18) + ' Open',
      c1Sub: '4 high match (>80%)',
      c2Title: 'SKILL READINESS',
      c2Val: '88.4%',
      c2Sub: 'Top 10% in cohort',
      c3Title: 'ACTIVE APPLICATIONS',
      c3Val: String(apps.length) + ' Active',
      c3Sub: shortlistedCount + ' shortlisted',
      c4Title: 'MENTORSHIP SESSIONS',
      c4Val: String(events.length) + ' Events',
      c4Sub: 'Available on campus',
      chartTitle: 'My Skill Growth vs Market Demand Benchmark',
      donutCenter: '88.4%',
      donutCenterSub: 'Mastery',
      legendLine1: 'Market Demand',
      legendLine2: 'My Skill Velocity',
      sessions: studentSessions
    }) +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>Recommended for you</h2><p>Based on the skills in your profile.</p></div><button class="small-btn" onclick="setView(\'opportunities\')">View all</button></div>' +
    recHtml +
    '</div>' +
    renderPerformanceTelemetry({ id: 'student_dash' }) +
    '<div class="two-col">' +
    renderSkillVelocity({ title: 'Skill Acquisition Velocity', subtitle: 'Daily study time vs. curriculum benchmark' }) +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>Quick actions</h2><p>Jump directly to active workflows.</p></div></div>' +
    '<div class="quick-actions">' +
    '<button onclick="setView(\'assessment\')"><span>📝</span> Take Assessment</button>' +
    '<button onclick="setView(\'projects\')"><span>💼</span> Add a Project</button>' +
    '<button onclick="setView(\'opportunities\')"><span>🚀</span> Browse Opportunities</button>' +
    '<button onclick="setView(\'mentorship\')"><span>🤝</span> Find a Mentor</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    profileCardHtml(user);
}

/* =========================================================
   STUDENT: SKILLS
========================================================= */
async function renderSkillsView(user) {
  var datalist = '<datalist id="skill-suggestions">' + MASTER_SKILLS.map(function (s) { return '<option value="' + escapeHtml(s) + '">'; }).join('') + '</datalist>';
  var tags = (user.skills || []).length ? user.skills.map(function (s) {
    return '<span class="skill-tag">' + escapeHtml(s.name) + ' <span class="lvl">· ' + s.level + '</span> <button onclick="removeSkill(\'' + escapeHtml(s.name).replace(/'/g, "\\'") + '\')">×</button></span>';
  }).join('') : '<p class="empty-message">You haven\'t added any skills yet. Add a few below to unlock personalized matches.</p>';

  var skillsData = (await api.analyticsSkills().catch(function () { return null; }));
  var demand = skillsData ? skillsData.demand : [];
  var have = (user.skills || []).map(function (s) { return s.name.toLowerCase(); });
  var gaps = demand.filter(function (d) { return have.indexOf(d.name.toLowerCase()) === -1; }).slice(0, 6);
  var gapHtml = gaps.length ? gaps.map(function (g) {
    return '<span class="skill-tag" style="background:#fff7ed;color:#c2410c;">' + escapeHtml(g.name) + ' <button onclick="quickAddSkill(\'' + escapeHtml(g.name).replace(/'/g, "\\'") + '\')" style="color:#c2410c;">+</button></span>';
  }).join('') : '<p class="empty-message">No obvious skill gaps right now — nice work.</p>';

  var gapSection = skillsData ? (
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Skill gap insights</h2><p>In-demand skills across current opportunities that you don\'t have yet.</p></div></div><div class="skills-list">' + gapHtml + '</div></div>'
  ) : '';

  return '' +
    datalist +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>My skills</h2><p>These power your opportunity matches and portfolio.</p></div></div>' +
    '<div class="skill-input">' +
    '<input type="text" id="new-skill-name" list="skill-suggestions" placeholder="e.g. React, Communication...">' +
    '<select id="new-skill-level">' + SKILL_LEVELS.map(function (l) { return '<option ' + (l === 'Intermediate' ? 'selected' : '') + '>' + l + '</option>'; }).join('') + '</select>' +
    '<button onclick="addSkill()">Add Skill</button>' +
    '</div>' +
    '<div class="skills-list">' + tags + '</div>' +
    '</div>' +
    gapSection;
}

async function addSkill() {
  var nameEl = document.getElementById('new-skill-name');
  var levelEl = document.getElementById('new-skill-level');
  var name = (nameEl.value || '').trim();
  if (!name) return;
  await guarded(async function () {
    var res = await api.addSkill(name, levelEl.value);
    session.user.skills = res.skills;
    showToast('Skill added.');
    await render();
  });
}
async function quickAddSkill(name) {
  await guarded(async function () {
    var res = await api.addSkill(name, 'Beginner');
    session.user.skills = res.skills;
    await render();
  });
}
async function removeSkill(name) {
  await guarded(async function () {
    var res = await api.removeSkill(name);
    session.user.skills = res.skills;
    await render();
  });
}

/* =========================================================
   STUDENT: ASSESSMENT
========================================================= */
async function renderAssessmentView(user) {
  var history = (await api.myAssessments()).assessments || [];
  var last = history.length ? history[history.length - 1] : null;

  var cats = ASSESSMENT_CATS.map(function (cat) {
    var picked = ui.assessmentDraft[cat.id];
    var buttons = [1, 2, 3, 4, 5].map(function (lvl) {
      return '<button type="button" class="' + (picked === lvl ? 'selected' : '') + '" onclick="pickAssessment(\'' + cat.id + '\',' + lvl + ')">' + lvl + ' · ' + ASSESSMENT_LEVEL_LABELS[lvl - 1] + '</button>';
    }).join('');
    return '<div class="assessment-cat"><h4>' + cat.label + '</h4><p class="cat-desc">' + cat.desc + '</p><div class="level-select">' + buttons + '</div></div>';
  }).join('');

  var resultsHtml = '';
  if (last) {
    resultsHtml = '<div class="dashboard-section"><div class="section-heading"><div><h2>Latest results</h2><p>Completed ' + history.length + ' time' + (history.length > 1 ? 's' : '') + ', last on ' + new Date(last.date).toLocaleDateString() + '.</p></div></div>' +
      ASSESSMENT_CATS.map(function (cat) {
        var val = last.scores[cat.id] || 0;
        return '<div class="skill-bar-row"><div class="bar-label"><span>' + cat.label + '</span><span>' + ASSESSMENT_LEVEL_LABELS[val - 1] + '</span></div><div class="bar-track"><div class="bar-fill" style="width:' + (val * 20) + '%"></div></div></div>';
      }).join('') +
      '</div>';
  }

  return '' +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>Self-assessment</h2><p>Rate yourself 1 (Beginner) to 5 (Expert) in each area. Be honest — it helps us recommend better opportunities.</p></div></div>' +
    cats +
    '<button class="primary-btn" onclick="submitAssessment()">Submit Assessment</button>' +
    '</div>' +
    resultsHtml;
}

function pickAssessment(catId, lvl) { ui.assessmentDraft[catId] = lvl; render(); }

async function submitAssessment() {
  var missing = ASSESSMENT_CATS.filter(function (c) { return !ui.assessmentDraft[c.id]; });
  if (missing.length) { showToast('Please rate all ' + ASSESSMENT_CATS.length + ' categories.'); return; }
  await guarded(async function () {
    var res = await api.submitAssessment(Object.assign({}, ui.assessmentDraft));
    session.user.skills = res.skills;
    ui.assessmentDraft = {};
    showToast('Assessment submitted.');
    await render();
  });
}

/* =========================================================
   STUDENT: PROJECTS
========================================================= */
function renderProjectsView(user) {
  var projects = user.projects || [];
  var list = projects.length ? projects.map(function (p) {
    return '<div class="project-card">' +
      '<div class="project-content">' +
      '<div class="project-title-row"><h3>' + escapeHtml(p.title) + '</h3><span class="project-status ' + (p.status === 'Completed' ? 'done' : '') + '">' + escapeHtml(p.status) + '</span></div>' +
      '<p>' + escapeHtml(p.description) + '</p>' +
      '<div class="project-tech">' + (p.tech || []).map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') + '</div>' +
      (p.link ? '<a class="project-link" href="' + escapeHtml(p.link) + '" target="_blank" rel="noopener">View project →</a>' : '') +
      '</div>' +
      '<button class="remove-project" onclick="removeProject(\'' + p.id + '\')">×</button>' +
      '</div>';
  }).join('') : '<p class="empty-message">No projects yet — add your first one below.</p>';

  return '' +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>Add a project</h2></div></div>' +
    '<form onsubmit="return addProject(event)">' +
    '<div class="profile-form">' +
    '<div class="form-group"><label>Title</label><input type="text" name="title" required placeholder="e.g. Campus Event Manager"></div>' +
    '<div class="form-group"><label>Status</label><select name="status"><option>Ongoing</option><option>Completed</option></select></div>' +
    '<div class="form-group full-width"><label>Description</label><textarea name="description" placeholder="What does it do? What was your role?"></textarea></div>' +
    '<div class="form-group"><label>Technologies (comma separated)</label><input type="text" name="tech" placeholder="React, Node.js, MongoDB"></div>' +
    '<div class="form-group"><label>Link (optional)</label><input type="url" name="link" placeholder="https://..."></div>' +
    '</div>' +
    '<div class="profile-actions"><button type="submit" class="primary-btn save-profile">Add Project</button></div>' +
    '</form>' +
    '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>My projects</h2></div></div><div class="projects-list">' + list + '</div></div>';
}

async function addProject(e) {
  e.preventDefault();
  var f = new FormData(e.target);
  await guarded(async function () {
    var res = await api.addProject({
      title: f.get('title'), description: f.get('description'),
      tech: f.get('tech'), status: f.get('status'), link: f.get('link')
    });
    session.user.projects = res.projects;
    showToast('Project added.');
    await render();
  });
  return false;
}
async function removeProject(id) {
  await guarded(async function () {
    var res = await api.removeProject(id);
    session.user.projects = res.projects;
    await render();
  });
}

/* =========================================================
   STUDENT: OPPORTUNITIES BROWSE
========================================================= */
async function renderOpportunitiesBrowse(user) {
  var params = {};
  if (ui.oppSearch) params.q = ui.oppSearch;
  if (ui.oppTypeFilter) params.type = ui.oppTypeFilter;
  var opps = (await api.listOpportunities(params)).opportunities;
  opps.sort(function (a, b) { return (b.match || 0) - (a.match || 0); });

  var userSkillNames = (user.skills || []).map(function (s) { return s.name.toLowerCase(); });

  var cards = opps.length ? opps.map(function (o) {
    var skillTags = (o.requiredSkills || []).map(function (s) {
      var matched = userSkillNames.indexOf(s.toLowerCase()) > -1;
      return '<span class="skill-tag' + (matched ? ' matched' : '') + '">' + escapeHtml(s) + '</span>';
    }).join('');
    var actionHtml = o.myStatus ? '<span class="status-badge ' + o.myStatus.toLowerCase() + '">' + o.myStatus + '</span>' : '<button class="primary-btn" onclick="applyOpportunity(\'' + o.id + '\')">Apply Now</button>';
    return '<div class="job-card">' +
      '<div class="job-card-header"><div><h3>' + escapeHtml(o.title) + '</h3><p>' + escapeHtml(o.industryName) + ' · ' + escapeHtml(o.type) + '</p></div><div class="match-score ' + matchClass(o.match || 0) + '">' + (o.match || 0) + '%<small>match</small></div></div>' +
      '<div class="job-match-text">' + escapeHtml(o.description) + '</div>' +
      '<div class="job-skills">' + skillTags + '</div>' +
      '<p class="job-location">Deadline: ' + fmtDate(o.deadline) + '</p>' +
      actionHtml +
      '</div>';
  }).join('') : '<p class="empty-message">No opportunities match your filters.</p>';

  return '' +
    '<div class="filter-bar">' +
    '<input type="text" placeholder="Search by title or company..." value="' + escapeHtml(ui.oppSearch || '') + '" oninput="ui.oppSearch=this.value; renderContentOnly();">' +
    '<select onchange="ui.oppTypeFilter=this.value; renderContentOnly();">' +
    '<option value="">All types</option>' +
    '<option ' + (ui.oppTypeFilter === 'Internship' ? 'selected' : '') + '>Internship</option>' +
    '<option ' + (ui.oppTypeFilter === 'Job' ? 'selected' : '') + '>Job</option>' +
    '<option ' + (ui.oppTypeFilter === 'Training' ? 'selected' : '') + '>Training</option>' +
    '</select>' +
    '</div>' +
    '<div class="jobs-grid">' + cards + '</div>';
}

async function applyOpportunity(oppId) {
  await guarded(async function () {
    await api.applyToOpportunity(oppId);
    showToast('Application submitted!');
    await render();
  });
}

/* =========================================================
   STUDENT: MENTORSHIP
========================================================= */
async function renderMentorshipStudent(user) {
  var mentors = (await api.listMentors()).mentors;
  var myRequests = (await api.myMentorships()).mentorships;
  var requestedIds = {};
  myRequests.forEach(function (m) { requestedIds[m.mentorId] = m; });

  var mentorCards = mentors.length ? mentors.map(function (m) {
    var existing = requestedIds[m.id];
    var actionHtml = existing ? '<span class="status-badge ' + existing.status + '">' + existing.status + '</span>' : '<button class="small-btn go" onclick="requestMentorship(\'' + m.id + '\')">Request</button>';
    return '<div class="mentor-card">' +
      '<div class="mentor-main"><h3 style="font-size:15.5px;margin-bottom:3px;">' + escapeHtml(m.name) + '</h3>' +
      '<span class="role-badge ' + m.role + '">' + ROLE_LABEL[m.role] + '</span> ' +
      '<p style="color:#6b7280;font-size:13px;margin-top:6px;">' + escapeHtml(m.headline || '') + '</p>' +
      '<div class="tag-row">' + (m.skills || []).slice(0, 4).map(function (s) { return '<span class="mini-tag">' + escapeHtml(s.name) + '</span>'; }).join('') + '</div>' +
      '</div>' + actionHtml +
      '</div>';
  }).join('') : '<p class="empty-message">No mentors are available right now.</p>';

  var reqHtml = myRequests.length ? myRequests.map(function (m) {
    return '<div class="mentor-card"><div class="mentor-main"><h3 style="font-size:15px;">' + escapeHtml(m.mentorName) + '</h3>' +
      (m.feedback ? '<p style="color:#6b7280;font-size:13px;margin-top:6px;">Feedback: ' + escapeHtml(m.feedback) + '</p>' : '') +
      '</div><span class="status-badge ' + m.status + '">' + m.status + '</span></div>';
  }).join('') : '<p class="empty-message">You haven\'t requested a mentor yet.</p>';

  return '' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Find a mentor</h2><p>Academicians and industry professionals open to mentoring.</p></div></div>' + mentorCards + '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>My requests</h2></div></div>' + reqHtml + '</div>';
}

async function requestMentorship(mentorId) {
  await guarded(async function () {
    await api.requestMentorship(mentorId);
    showToast('Mentorship request sent.');
    await render();
  });
}

async function renderMentorshipAsMentor(user) {
  var requests = (await api.mentorshipInbox()).mentorships;
  if (!requests.length) return '<div class="dashboard-section"><p class="empty-message">No mentorship requests yet. Make sure "Available as a Mentor" is turned on in your profile.</p></div>';

  var html = requests.map(function (m) {
    var actions = '';
    if (m.status === 'pending') {
      actions = '<button class="small-btn go" onclick="respondMentorship(\'' + m.id + '\',\'accepted\')">Accept</button> <button class="small-btn danger" onclick="respondMentorship(\'' + m.id + '\',\'declined\')">Decline</button>';
    } else if (m.status === 'accepted') {
      actions = '<button class="small-btn" onclick="openFeedbackFor(\'' + m.id + '\')">' + (m.feedback ? 'Edit Feedback' : 'Add Feedback') + '</button>';
    }
    var feedbackForm = (ui.feedbackOpenFor === m.id) ? (
      '<form onsubmit="return submitMentorFeedback(event,\'' + m.id + '\')" style="margin-top:10px;display:flex;gap:8px;">' +
      '<input type="text" name="feedback" value="' + escapeHtml(m.feedback || '') + '" placeholder="Short note for your mentee..." style="flex:1;padding:9px 12px;border:1px solid #d8deea;border-radius:8px;">' +
      '<button class="small-btn go" type="submit">Save</button></form>'
    ) : '';
    return '<div class="mentor-card" style="flex-direction:column;align-items:stretch;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">' +
      '<div class="mentor-main"><h3 style="font-size:15.5px;">' + escapeHtml(m.menteeName) + '</h3><span class="status-badge ' + m.status + '">' + m.status + '</span></div>' +
      '<div>' + actions + '</div></div>' + feedbackForm +
      '</div>';
  }).join('');

  return '<div class="dashboard-section"><div class="section-heading"><div><h2>Mentorship requests</h2></div></div>' + html + '</div>';
}

async function respondMentorship(id, status) {
  await guarded(async function () {
    await api.respondMentorship(id, status);
    await render();
  });
}
function openFeedbackFor(id) { ui.feedbackOpenFor = id; render(); }
async function submitMentorFeedback(e, id) {
  e.preventDefault();
  var f = new FormData(e.target);
  await guarded(async function () {
    await api.submitMentorFeedback(id, f.get('feedback'));
    ui.feedbackOpenFor = null;
    showToast('Feedback saved.');
    await render();
  });
  return false;
}

/* =========================================================
   EVENTS (shared)
========================================================= */
async function renderEventsView(user) {
  var canCreate = user.role === 'academician' || user.role === 'industry' || user.role === 'admin';
  var createForm = canCreate ? (
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Create an Event or Collaborative Session</h2><p>Organize academic workshops, guest lectures, and industry sessions.</p></div></div>' +
    '<form onsubmit="return handleCreateEvent(event)">' +
    '<div class="profile-form">' +
    '<div class="form-group"><label>Title / Topic</label><input type="text" name="title" placeholder="e.g. AI Applications Workshop" required></div>' +
    '<div class="form-group"><label>Session Type</label><select name="type"><option>Workshop</option><option>GuestLecture</option><option>Challenge</option></select></div>' +
    '<div class="form-group"><label>Date</label><input type="date" name="date" required></div>' +
    '<div class="form-group"><label>Time Window</label><input type="text" name="time" placeholder="e.g. 10:00 AM – 11:30 AM"></div>' +
    '<div class="form-group"><label>Venue / Location</label><input type="text" name="location" placeholder="e.g. Virtual Lab Room 204"></div>' +
    '<div class="form-group full-width"><label>Description</label><textarea name="description" placeholder="Session goals, agenda, and target audience..."></textarea></div>' +
    '</div>' +
    '<div class="profile-actions"><button type="submit" class="primary-btn save-profile">Save & Schedule Event</button></div>' +
    '</form></div>'
  ) : '';

  var events = (await api.listEvents()).events || [];
  var iconMap = { Workshop: '🛠️', GuestLecture: '🎤', Challenge: '🏆' };
  var list = events.length ? events.map(function (ev) {
    var rsvped = (ev.rsvps || []).indexOf(user.id) > -1;
    var isOrganizer = (ev.organizerId && ev.organizerId === user.id) || ev.organizerName === user.name || user.role === 'admin';
    var timeLoc = [ev.time, ev.location].filter(Boolean).join(' · ');
    return '<div class="education-card">' +
      '<div class="education-icon">' + (iconMap[ev.type] || '📅') + '</div>' +
      '<div style="flex:1;min-width:200px;">' +
      '<h3>' + escapeHtml(ev.title) + '</h3>' +
      '<p>' + escapeHtml(ev.description || '') + '</p>' +
      '<span class="meta">' + fmtDate(ev.date) + (timeLoc ? ' · ' + escapeHtml(timeLoc) : '') + ' · Hosted by ' + escapeHtml(ev.organizerName) + ' · ' + (ev.rsvps || []).length + ' interested</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<button class="small-btn ' + (rsvped ? '' : 'go') + '" onclick="rsvpEvent(\'' + ev.id + '\')">' + (rsvped ? 'Cancel RSVP' : 'I\'m Interested') + '</button>' +
      (isOrganizer ? '<button class="small-btn" style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;" onclick="removeEvent(\'' + ev.id + '\')" title="Delete event">Delete</button>' : '') +
      '</div>' +
      '</div>';
  }).join('') : '<p class="empty-message">No events or sessions scheduled yet.</p>';

  return createForm + '<div class="dashboard-section"><div class="section-heading"><div><h2>Upcoming Events & Sessions</h2></div></div>' + list + '</div>';
}
async function handleCreateEvent(e) {
  e.preventDefault();
  var f = new FormData(e.target);
  await guarded(async function () {
    await api.createEvent({
      title: f.get('title'),
      type: f.get('type'),
      date: f.get('date'),
      time: f.get('time'),
      location: f.get('location'),
      description: f.get('description')
    });
    showToast('Event saved to database.');
    await render();
  });
  return false;
}
window.handleCreateEvent = handleCreateEvent;
async function removeEvent(id) {
  if (!confirm('Are you sure you want to delete this event/session?')) return;
  await guarded(async function () {
    await api.deleteEvent(id);
    showToast('Event removed from database.');
    await render();
  });
}
async function rsvpEvent(id) {
  await guarded(async function () {
    await api.rsvpEvent(id);
    await render();
  });
}

/* =========================================================
   STUDENT: PORTFOLIO
========================================================= */
async function renderPortfolioView(user) {
  var skillsHtml = (user.skills || []).length ? user.skills.map(function (s) {
    return '<div class="skill-bar-row"><div class="bar-label"><span>' + escapeHtml(s.name) + '</span><span>' + s.level + '</span></div><div class="bar-track"><div class="bar-fill" style="width:' + LEVEL_WIDTH[s.level] + '%"></div></div></div>';
  }).join('') : '<p class="empty-message">No skills added yet.</p>';

  var projHtml = (user.projects || []).length ? user.projects.map(function (p) {
    return '<div class="project-card"><div class="project-content"><div class="project-title-row"><h3>' + escapeHtml(p.title) + '</h3><span class="project-status ' + (p.status === 'Completed' ? 'done' : '') + '">' + p.status + '</span></div><p>' + escapeHtml(p.description) + '</p><div class="project-tech">' + (p.tech || []).map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') + '</div></div></div>';
  }).join('') : '<p class="empty-message">No projects added yet.</p>';

  var certHtml = (user.certifications || []).length ? '<div class="pill-row">' + user.certifications.map(function (c, i) { return '<span class="skill-tag">' + escapeHtml(c) + ' <button onclick="removeListItem(\'certifications\',' + i + ')">×</button></span>'; }).join('') + '</div>' : '<p class="empty-message">No certifications added yet.</p>';
  var achHtml = (user.achievements || []).length ? '<div class="pill-row">' + user.achievements.map(function (c, i) { return '<span class="skill-tag" style="background:#f0fdf4;color:#15803d;">' + escapeHtml(c) + ' <button onclick="removeListItem(\'achievements\',' + i + ')" style="color:#15803d;">×</button></span>'; }).join('') : '<p class="empty-message">No achievements added yet.</p>';

  var myApps = (await api.myApplications()).applications;
  var appRows = myApps.length ? myApps.map(function (a) {
    var o = a.opportunity;
    return '<tr><td>' + escapeHtml(o ? o.title : 'Unknown') + '</td><td>' + escapeHtml(o ? o.industryName : '') + '</td><td><span class="status-badge ' + a.status.toLowerCase() + '">' + a.status + '</span></td><td>' + new Date(a.date).toLocaleDateString() + '</td></tr>';
  }).join('') : '<tr><td colspan="4" class="empty-message">No applications yet.</td></tr>';

  return '' +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>' + escapeHtml(user.name) + '</h2><p>' + escapeHtml(user.headline || '') + '</p></div><button class="small-btn go" onclick="copyPortfolio()">Copy Summary</button></div>' +
    '<p style="color:#374151;font-size:14px;line-height:1.7;">' + escapeHtml(user.bio || 'No bio added yet.') + '</p>' +
    '</div>' +
    '<div class="two-col">' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Skills</h2></div></div>' + skillsHtml + '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Certifications & Achievements</h2></div></div>' +
    '<form onsubmit="return addListItem(event,\'certifications\')" style="display:flex;gap:8px;margin-bottom:10px;"><input type="text" name="item" placeholder="Add a certification..." style="flex:1;padding:9px 12px;border:1px solid #d8deea;border-radius:8px;"><button class="small-btn go" type="submit">Add</button></form>' +
    certHtml +
    '<form onsubmit="return addListItem(event,\'achievements\')" style="display:flex;gap:8px;margin:14px 0 10px;"><input type="text" name="item" placeholder="Add an achievement..." style="flex:1;padding:9px 12px;border:1px solid #d8deea;border-radius:8px;"><button class="small-btn go" type="submit">Add</button></form>' +
    achHtml +
    '</div>' +
    '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Projects</h2></div></div><div class="projects-list">' + projHtml + '</div></div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Application history</h2></div></div><div class="table-wrap"><table class="data-table"><tr><th>Opportunity</th><th>Company</th><th>Status</th><th>Date</th></tr>' + appRows + '</table></div></div>';
}

async function addListItem(e, field) {
  e.preventDefault();
  var f = new FormData(e.target);
  var val = (f.get('item') || '').trim();
  if (!val) return false;
  await guarded(async function () {
    var res = await api.addListItem(field, val);
    session.user[field] = res[field];
    await render();
  });
  return false;
}
async function removeListItem(field, idx) {
  await guarded(async function () {
    var res = await api.removeListItem(field, idx);
    session.user[field] = res[field];
    await render();
  });
}
function copyPortfolio() {
  var user = session.user;
  var text = user.name + ' — ' + (user.headline || '') + '\n\n' +
    'Skills: ' + (user.skills || []).map(function (s) { return s.name + ' (' + s.level + ')'; }).join(', ') + '\n\n' +
    'Projects: ' + (user.projects || []).map(function (p) { return p.title; }).join(', ') + '\n\n' +
    'Certifications: ' + (user.certifications || []).join(', ');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { showToast('Portfolio summary copied.'); }).catch(function () { showToast('Could not copy — please copy manually.'); });
  } else {
    showToast('Clipboard not available in this browser.');
  }
}

/* =========================================================
   ACADEMICIAN: DASHBOARD
========================================================= */
async function academicianDashboard(user) {
  var programs = (await api.listPrograms()).programs.filter(function (p) { return p.academicianId === user.id; });
  var mentorships = (await api.mentorshipInbox()).mentorships || [];
  var pending = mentorships.filter(function (m) { return m.status === 'pending'; }).length;
  var accepted = mentorships.filter(function (m) { return m.status === 'accepted'; }).length;
  var allEvents = (await api.listEvents()).events || [];
  var myEvents = allEvents.filter(function (e) {
    return (e.organizerId && e.organizerId === user.id) || e.organizerName === user.name || (e.rsvps || []).indexOf(user.id) > -1;
  });

  // Dynamically build database-connected sessions from events, mentorships, and programs
  var todayStr = new Date().toISOString().slice(0, 10);
  var dbSessions = [];

  allEvents.forEach(function (ev) {
    var isMine = (ev.organizerId && ev.organizerId === user.id) || ev.organizerName === user.name;
    var status = 'UPCOMING';
    var statusClass = 'status-upcoming';
    if (ev.date && ev.date < todayStr) {
      status = 'COMPLETED';
      statusClass = 'status-completed';
    } else if (ev.date && ev.date === todayStr) {
      status = 'IN PROGRESS';
      statusClass = 'status-inprogress';
    }
    var meta = [
      ev.type || 'Session',
      isMine ? 'Host (You)' : (ev.organizerName || 'Partner'),
      ev.location || 'Virtual Lab'
    ].filter(Boolean).join(' · ');

    dbSessions.push({
      title: ev.title,
      status: status,
      statusClass: statusClass,
      meta: meta,
      time: (ev.time ? ev.time + ' · ' : '') + fmtDate(ev.date)
    });
  });

  mentorships.filter(function (m) { return m.status === 'accepted'; }).forEach(function (m) {
    dbSessions.push({
      title: 'Mentorship Session: ' + (m.menteeName || 'Student Mentee'),
      status: 'UPCOMING',
      statusClass: 'status-upcoming',
      meta: '1-on-1 Academic Mentoring · Mentorship Track',
      time: 'Weekly Sync'
    });
  });

  programs.forEach(function (p) {
    dbSessions.push({
      title: p.title + ' (' + p.type + ')',
      status: 'IN PROGRESS',
      statusClass: 'status-inprogress',
      meta: 'Program Lead · ' + (p.eligibility || 'Faculty/Industry Track'),
      time: (p.startDate && p.endDate) ? (fmtDate(p.startDate) + ' – ' + fmtDate(p.endDate)) : 'Ongoing'
    });
  });

  if (!dbSessions.length) {
    dbSessions = [
      { title: 'No active sessions scheduled', status: 'READY', statusClass: 'status-upcoming', meta: 'Create a workshop or collaborative session in Events & Sessions', time: 'Schedule anytime' }
    ];
  }

  var notifs = [];
  if (pending > 0) {
    notifs.push({ title: 'Mentorship Request Pending', time: 'Active', body: pending + ' student(s) requested your mentorship.' });
  }
  myEvents.forEach(function (ev) {
    notifs.push({ title: 'Scheduled Event: ' + ev.title, time: fmtDate(ev.date), body: (ev.rsvps || []).length + ' students/attendees have RSVP\'d.' });
  });
  if (programs.length > 0) {
    notifs.push({ title: 'Active Program: ' + programs[0].title, time: 'Live', body: (programs[0].interested || []).length + ' participants marked interest.' });
  }
  if (!notifs.length) {
    notifs.push({ title: 'System Synced', time: 'Just now', body: 'All student cohorts and sessions are connected to the central database.' });
  }

  return '' +
    renderSkillBridgeModernDashboard(user, {
      alert1Text: pending > 0 ? ('Cohort Mentorship Review: ' + pending + ' student collaboration applications awaiting review.') : 'Cohort Mentorship: All pending student reviews are up to date.',
      alert2Text: 'Research & Teaching Activity: ' + (myEvents.length + programs.length) + ' collaborative programs & events scheduled in the database.',
      c1Title: 'ACTIVE MENTEES',
      c1Val: String(accepted) + ' Students',
      c1Sub: pending + ' pending review',
      c2Title: 'COLLABORATIVE PROGRAMS',
      c2Val: String(programs.length) + ' Active',
      c2Sub: programs.length + ' programs running',
      c3Title: 'SCHEDULED EVENTS',
      c3Val: String(myEvents.length) + ' Events',
      c3Sub: allEvents.length + ' campus sessions total',
      c4Title: 'DATABASE SESSIONS',
      c4Val: String(dbSessions.length) + ' Total',
      c4Sub: 'Live synced from DB',
      chartTitle: 'Cohort Skill Velocity vs Curriculum Target',
      donutCenter: '92.5%',
      donutCenterSub: 'Mastery',
      legendLine1: 'Curriculum Benchmark',
      legendLine2: 'Cohort Velocity',
      sessions: dbSessions,
      notifs: notifs
    }) +
    renderPerformanceTelemetry({
      id: 'acad_dash',
      title: 'Cohort Mentorship & Activity Analytics',
      subtitle: 'Real-time telemetry styled with Neon Spring Green & Sky Blue telemetry visuals.',
      hours: '4 h 20 m',
      hoursLabel: 'Active cohort mentoring hours',
      card1Title: 'Mentorship & Research Focus',
      card2Title: 'Cohort Mastery Target',
      card3Title: 'Cohort Sprint Productivity',
      verifications: '42 Cohort Verifications',
      subDesc: 'Mentorship milestones approved'
    }) +
    renderEngagementMatrix({
      title: 'Cohort Student Engagement Matrix',
      subtitle: 'Weekly hourly activity distribution across active mentees',
      badge: 'PEAK: 2 PM - 6 PM'
    }) +
    '<div class="two-col">' +
    renderSkillVelocity({ title: 'Cohort Skill Velocity', subtitle: 'Student study pace vs. curriculum benchmark' }) +
    '<div class="dashboard-section">' +
    '<div class="section-heading"><div><h2>Quick actions</h2><p>Manage your academic programs and mentee cohort.</p></div></div>' +
    '<div class="quick-actions">' +
    '<button onclick="setView(\'programs\')"><span>🎓</span> Create Program</button>' +
    '<button onclick="setView(\'mentorship\')"><span>🤝</span> View Requests</button>' +
    '<button onclick="setView(\'events\')"><span>📅</span> Post Event</button>' +
    '<button onclick="setView(\'profile\')"><span>👤</span> Edit Profile</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    profileCardHtml(user) +
    '<div class="stats-grid">' +
    statCard('🎓', programs.length, 'Programs run') +
    statCard('🤝', accepted, 'Active mentees') +
    statCard('⏳', pending, 'Pending requests') +
    statCard('📅', myEvents.length, 'Events organized') +
    '</div>';
}

/* =========================================================
   ACADEMICIAN: PROGRAMS
========================================================= */
async function renderProgramsView(user) {
  var all = (await api.listPrograms()).programs;
  var mine = all.filter(function (p) { return p.academicianId === user.id; });
  var others = all.filter(function (p) { return p.academicianId !== user.id; });

  var mineHtml = mine.length ? mine.map(function (p) {
    return '<div class="project-card"><div class="project-content"><div class="project-title-row"><h3>' + escapeHtml(p.title) + '</h3><span class="project-status">' + escapeHtml(p.type) + '</span></div><p>' + escapeHtml(p.description) + '</p><p style="color:#9ca3af;font-size:12.5px;margin-top:8px;">' + fmtDate(p.startDate) + ' – ' + fmtDate(p.endDate) + ' · Eligibility: ' + escapeHtml(p.eligibility) + ' · ' + (p.interested || []).length + ' interested</p></div><button class="remove-project" onclick="removeProgram(\'' + p.id + '\')">×</button></div>';
  }).join('') : '<p class="empty-message">You haven\'t created any programs yet.</p>';

  var othersHtml = others.length ? others.map(function (p) {
    var interested = (p.interested || []).indexOf(user.id) > -1;
    return '<div class="education-card"><div class="education-icon">🎓</div><div style="flex:1;min-width:200px;"><h3>' + escapeHtml(p.title) + '</h3><p>' + escapeHtml(p.academicianName) + ' · ' + escapeHtml(p.type) + '</p></div><button class="small-btn ' + (interested ? '' : 'go') + '" onclick="toggleProgramInterest(\'' + p.id + '\')">' + (interested ? 'Remove' : "I'm Interested") + '</button></div>';
  }).join('') : '';

  return '' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Create a program</h2><p>FDPs, industrial training, consultancy, or collaborative projects.</p></div></div>' +
    '<form onsubmit="return createProgram(event)">' +
    '<div class="profile-form">' +
    '<div class="form-group"><label>Title</label><input type="text" name="title" required></div>' +
    '<div class="form-group"><label>Type</label><select name="type"><option>FDP</option><option>Internship</option><option>Consultancy</option><option>Collaborative Project</option></select></div>' +
    '<div class="form-group full-width"><label>Description</label><textarea name="description"></textarea></div>' +
    '<div class="form-group"><label>Eligibility</label><input type="text" name="eligibility" placeholder="Who can join?"></div>' +
    '<div class="form-group"><label>Start Date</label><input type="date" name="startDate"></div>' +
    '<div class="form-group"><label>End Date</label><input type="date" name="endDate"></div>' +
    '</div>' +
    '<div class="profile-actions"><button type="submit" class="primary-btn save-profile">Create Program</button></div>' +
    '</form>' +
    '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>My programs</h2></div></div><div class="projects-list">' + mineHtml + '</div></div>' +
    (othersHtml ? '<div class="dashboard-section"><div class="section-heading"><div><h2>Other programs</h2></div></div>' + othersHtml + '</div>' : '');
}

async function createProgram(e) {
  e.preventDefault();
  var f = new FormData(e.target);
  await guarded(async function () {
    await api.createProgram({
      title: f.get('title'), type: f.get('type'), description: f.get('description'),
      eligibility: f.get('eligibility'), startDate: f.get('startDate'), endDate: f.get('endDate')
    });
    showToast('Program created.');
    await render();
  });
  return false;
}
async function removeProgram(id) {
  await guarded(async function () {
    await api.deleteProgram(id);
    await render();
  });
}
async function toggleProgramInterest(id) {
  await guarded(async function () {
    await api.toggleProgramInterest(id);
    await render();
  });
}

/* =========================================================
   INDUSTRY: DASHBOARD
========================================================= */
async function industryDashboard(user) {
  var myOpps = (await api.myOpportunities()).opportunities;
  var apps = [];
  for (var i = 0; i < myOpps.length; i++) {
    var res = await api.applicantsFor(myOpps[i].id);
    apps = apps.concat(res.applicants);
  }
  var selected = apps.filter(function (a) { return a.status === 'Selected'; }).length;

  var suggestions = [];
  for (var j = 0; j < myOpps.length; j++) {
    var s = await api.suggestedCandidates(myOpps[j].id);
    s.candidates.slice(0, 2).forEach(function (c) { suggestions.push({ opp: myOpps[j], student: c.student, match: c.match }); });
  }
  suggestions.sort(function (a, b) { return b.match - a.match; });
  var suggHtml = suggestions.length ? suggestions.slice(0, 4).map(function (x) {
    return '<div class="education-card"><div class="education-icon">🌟</div><div style="flex:1;min-width:200px;"><h3>' + escapeHtml(x.student.name) + '</h3><p>Strong fit for "' + escapeHtml(x.opp.title) + '"</p></div><div class="match-score ' + matchClass(x.match) + '">' + x.match + '%<small>match</small></div></div>';
  }).join('') : '<p class="empty-message">Post an opportunity with required skills to see suggested candidates here.</p>';

  var mentorships = (await api.mentorshipInbox()).mentorships;
  var activeMentees = mentorships.filter(function (m) { return m.status === 'accepted'; }).length;

  return '' +
    renderSkillBridgeModernDashboard(user, {
      alert1Text: 'Candidate Review Notice: 14 applicants awaiting review for Software Engineering Intern.',
      alert2Text: 'Talent Pool Quality Index: Candidate pool benchmarked at 94.6% match readiness across active postings.',
      c1Title: 'CANDIDATE APPLICATIONS',
      c1Val: String(apps.length || 142) + ' Total',
      c1Sub: '28 new this week',
      c2Title: 'AI MATCH ACCURACY',
      c2Val: '94.6%',
      c2Sub: 'Skill-verified fit',
      c3Title: 'SHORTLISTED TALENT',
      c3Val: String(selected || 18) + ' Candidates',
      c3Sub: 'Interviews scheduled',
      c4Title: 'ACTIVE OPENINGS',
      c4Val: String(myOpps.length || 6) + ' Postings',
      c4Sub: 'Internships & Full-time',
      chartTitle: 'Talent Inflow & Match Velocity',
      donutCenter: '94.6%',
      donutCenterSub: 'Fit Index',
      legendLine1: 'Required Benchmark',
      legendLine2: 'Candidate Velocity',
      sessions: [
        { title: 'Campus Hiring Technical Interview 1', status: 'COMPLETED', statusClass: 'status-completed', meta: 'TechNova Engineering · Candidate: Aditi Verma', time: '09:30 AM – 10:15 AM' },
        { title: 'Full-Stack Candidate System Design', status: 'IN PROGRESS', statusClass: 'status-inprogress', meta: 'Lead Panel · Candidate: Aarav Sharma', time: '10:30 AM – 11:30 AM' },
        { title: 'Industry Mentorship Sync', status: 'UPCOMING', statusClass: 'status-upcoming', meta: 'Priya Menon · NIT University Mentorship Batch', time: '02:00 PM – 03:00 PM' },
        { title: 'Internship Onboarding Briefing', status: 'UPCOMING', statusClass: 'status-upcoming', meta: 'HR Campus Team · Summer 2026 Batch', time: '04:30 PM – 05:15 PM' }
      ],
      notifs: [
        { title: 'New High-Match Applicant', time: '3m ago', body: 'Candidate with 96% match applied for Frontend Developer Intern.' },
        { title: 'Assessment Verified by Faculty', time: '15m ago', body: 'Prof. Rajesh Iyer verified candidate practical credentials.' },
        { title: 'Mentee Application Received', time: '45m ago', body: 'Student sent a mentorship request for Cloud & Distributed Systems.' },
        { title: 'Campus Drive Synchronized', time: '2h ago', body: 'University approved the TechNova 2026 Campus Placement track.' }
      ]
    }) +
    renderEngagementMatrix({
      title: 'Talent Pool Engagement Matrix',
      subtitle: 'Weekly hourly candidate activity and submission distribution',
      badge: 'PEAK: 2 PM - 6 PM'
    }) +
    '<div class="two-col">' +
    renderSkillVelocity({
      title: 'Candidate Skill Acquisition Velocity',
      subtitle: 'Applicant study and benchmark readiness across tech stacks',
      badge: '5 DAYS GOAL MET'
    }) +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Suggested candidates</h2><p>Students who closely match your open postings.</p></div></div>' + suggHtml + '</div>' +
    '</div>' +
    profileCardHtml(user) +
    '<div class="stats-grid">' +
    statCard('📢', myOpps.length, 'Opportunities posted') +
    statCard('📨', apps.length, 'Total applicants') +
    statCard('✅', selected, 'Selected') +
    statCard('🤝', activeMentees, 'Active mentees') +
    '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Quick actions</h2></div></div>' +
    '<div class="quick-actions">' +
    '<button onclick="setView(\'opportunities\')"><span>📢</span> Post Opportunity</button>' +
    '<button onclick="setView(\'applicants\')"><span>📋</span> View Applicants</button>' +
    '<button onclick="setView(\'mentorship\')"><span>🤝</span> Mentorship Requests</button>' +
    '<button onclick="setView(\'profile\')"><span>👤</span> Edit Profile</button>' +
    '</div>' +
    '</div>';
}

/* =========================================================
   INDUSTRY: OPPORTUNITIES (POST/MANAGE)
========================================================= */
async function renderOpportunitiesManage(user) {
  var datalist = '<datalist id="skill-suggestions">' + MASTER_SKILLS.map(function (s) { return '<option value="' + escapeHtml(s) + '">'; }).join('') + '</datalist>';
  var mine = (await api.myOpportunities()).opportunities;
  var list = mine.length ? mine.map(function (o) {
    return '<div class="job-card"><div class="job-card-header"><div><h3>' + escapeHtml(o.title) + '</h3><p>' + escapeHtml(o.type) + ' · Deadline ' + fmtDate(o.deadline) + '</p></div><button class="remove-project" onclick="removeOpportunity(\'' + o.id + '\')" style="width:32px;height:32px;">×</button></div>' +
      '<div class="job-match-text">' + escapeHtml(o.description) + '</div>' +
      '<div class="job-skills">' + (o.requiredSkills || []).map(function (s) { return '<span class="skill-tag">' + escapeHtml(s) + '</span>'; }).join('') + '</div>' +
      '<p class="job-location">' + o.applicantCount + ' applicant' + (o.applicantCount === 1 ? '' : 's') + '</p>' +
      '<button class="primary-btn" onclick="viewApplicantsFor(\'' + o.id + '\')">View Applicants</button>' +
      '</div>';
  }).join('') : '<p class="empty-message">You haven\'t posted any opportunities yet.</p>';

  return '' +
    datalist +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Post a new opportunity</h2></div></div>' +
    '<form onsubmit="return postOpportunity(event)">' +
    '<div class="profile-form">' +
    '<div class="form-group"><label>Title</label><input type="text" name="title" required placeholder="e.g. Frontend Developer Intern"></div>' +
    '<div class="form-group"><label>Type</label><select name="type"><option>Internship</option><option>Job</option><option>Training</option></select></div>' +
    '<div class="form-group full-width"><label>Description</label><textarea name="description" required></textarea></div>' +
    '<div class="form-group full-width"><label>Required Skills (comma separated)</label><input type="text" name="skills" list="skill-suggestions" placeholder="JavaScript, React, Communication"></div>' +
    '<div class="form-group"><label>Application Deadline</label><input type="date" name="deadline" required></div>' +
    '</div>' +
    '<div class="profile-actions"><button type="submit" class="primary-btn save-profile">Post Opportunity</button></div>' +
    '</form>' +
    '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>My postings</h2></div></div><div class="jobs-grid">' + list + '</div></div>';
}

async function postOpportunity(e) {
  e.preventDefault();
  var f = new FormData(e.target);
  await guarded(async function () {
    await api.postOpportunity({
      title: f.get('title'), type: f.get('type'), description: f.get('description'),
      requiredSkills: f.get('skills'), deadline: f.get('deadline')
    });
    showToast('Opportunity posted.');
    await render();
  });
  return false;
}
async function removeOpportunity(id) {
  await guarded(async function () {
    await api.deleteOpportunity(id);
    await render();
  });
}
async function viewApplicantsFor(oppId) {
  ui.selectedOpportunityForApplicants = oppId;
  await setView('applicants');
}

/* =========================================================
   INDUSTRY: APPLICANTS
========================================================= */
async function renderApplicantsView(user) {
  var mine = (await api.myOpportunities()).opportunities;
  if (!mine.length) return '<div class="dashboard-section"><p class="empty-message">Post an opportunity first to start receiving applicants.</p></div>';

  var sel = ui.selectedOpportunityForApplicants;
  if (sel !== 'all' && !mine.some(function (o) { return o.id === sel; })) sel = 'all';

  var options = '<option value="all">All opportunities</option>' + mine.map(function (o) {
    return '<option value="' + o.id + '" ' + (sel === o.id ? 'selected' : '') + '>' + escapeHtml(o.title) + '</option>';
  }).join('');

  var targetOpps = sel === 'all' ? mine : mine.filter(function (o) { return o.id === sel; });
  var rows = [];
  for (var i = 0; i < targetOpps.length; i++) {
    var res = await api.applicantsFor(targetOpps[i].id);
    res.applicants.forEach(function (a) {
      rows.push({ a: a, oppTitle: res.opportunity.title });
    });
  }

  var rowsHtml = rows.length ? rows.map(function (r) {
    var a = r.a, student = a.student;
    return '<tr>' +
      '<td>' + escapeHtml(student ? student.name : 'Unknown') + '</td>' +
      '<td>' + escapeHtml(r.oppTitle) + '</td>' +
      '<td>' + a.match + '%</td>' +
      '<td>' + escapeHtml(student ? student.email : '') + '</td>' +
      '<td><select onchange="updateApplicationStatus(\'' + a.id + '\', this.value)">' +
      ['Applied', 'Shortlisted', 'Selected', 'Rejected'].map(function (s) { return '<option ' + (a.status === s ? 'selected' : '') + '>' + s + '</option>'; }).join('') +
      '</select></td>' +
      '</tr>';
  }).join('') : '<tr><td colspan="5" class="empty-message">No applicants yet.</td></tr>';

  return '' +
    '<div class="filter-bar"><select onchange="ui.selectedOpportunityForApplicants=this.value; renderContentOnly();">' + options + '</select></div>' +
    '<div class="dashboard-section"><div class="table-wrap"><table class="data-table"><tr><th>Candidate</th><th>Opportunity</th><th>Match</th><th>Email</th><th>Status</th></tr>' + rowsHtml + '</table></div></div>';
}

async function updateApplicationStatus(appId, status) {
  await guarded(async function () {
    await api.updateApplicationStatus(appId, status);
    showToast('Status updated to ' + status + '.');
    await render();
  });
}

/* =========================================================
   ADMIN: DASHBOARD
========================================================= */
async function adminDashboard(user) {
  var summary = await api.analyticsSummary();
  var skills = await api.analyticsSkills();

  var funnel = [
    { label: 'Applications', val: summary.funnel.applied },
    { label: 'Shortlisted', val: summary.funnel.shortlisted },
    { label: 'Selected', val: summary.funnel.selected }
  ];
  var max = Math.max(summary.funnel.applied, 1);
  var funnelHtml = funnel.map(function (f) {
    var pct = Math.round(f.val / max * 100);
    return '<div class="skill-bar-row"><div class="bar-label"><span>' + f.label + '</span><span>' + f.val + '</span></div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div></div>';
  }).join('');

  var topSkills = skills.demand.slice(0, 5);
  var topSkillsHtml = topSkills.length ? topSkills.map(function (s) {
    var pct = Math.round(s.count / topSkills[0].count * 100);
    return '<div class="skill-bar-row"><div class="bar-label"><span>' + escapeHtml(s.name) + '</span><span>' + s.count + ' posting' + (s.count === 1 ? '' : 's') + '</span></div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div></div>';
  }).join('') : '<p class="empty-message">No opportunities posted yet.</p>';

  return '' +
    renderSkillBridgeModernDashboard(user, {
      alert1Text: 'Campus Placement Drive: 84.6% student placement rate achieved across participating cohorts.',
      alert2Text: 'Institutional Accreditation Telemetry: 92% of corporate MOU partnership data synchronized.',
      c1Title: 'ENROLLED STUDENTS',
      c1Val: String(summary.students || '1,384'),
      c1Sub: '+24 new this week',
      c2Title: 'CAMPUS PLACEMENT RATE',
      c2Val: '84.6%',
      c2Sub: 'Ahead of benchmark',
      c3Title: 'ACTIVE COLLABORATIONS',
      c3Val: '48 Programs',
      c3Sub: '12 corporate MOUs',
      c4Title: 'INDUSTRY PARTNERS',
      c4Val: String(summary.industries || '32') + ' Partners',
      c4Sub: 'Tier-1 tech & core',
      chartTitle: 'Institutional Placement & Skill Velocity',
      donutCenter: '84.6%',
      donutCenterSub: 'Placed',
      legendLine1: 'Campus Benchmark',
      legendLine2: 'Placement Velocity',
      sessions: [
        { title: 'Campus Placement Technical Assessment', status: 'COMPLETED', statusClass: 'status-completed', meta: 'All Departments · 240 Students · Central Lab', time: '08:30 AM – 10:00 AM' },
        { title: 'Academic Senate Curriculum Review', status: 'IN PROGRESS', statusClass: 'status-inprogress', meta: 'Heads of Department · Committee Room A', time: '10:30 AM – 12:00 PM' },
        { title: 'TechNova Corporate MOU Signing', status: 'UPCOMING', statusClass: 'status-upcoming', meta: 'Directorate · Industry Liaison Cell', time: '02:30 PM – 03:30 PM' },
        { title: 'Annual Innovation Hackathon Briefing', status: 'UPCOMING', statusClass: 'status-upcoming', meta: 'Student Council · Campus Auditorium', time: '04:30 PM – 05:30 PM' }
      ],
      notifs: [
        { title: 'Corporate MoU Ratified', time: '10m ago', body: 'TechNova signed 3-year collaborative curriculum & internship partnership.' },
        { title: 'Placement Drive Update', time: '30m ago', body: '24 students accepted offer letters from partner industries today.' },
        { title: 'Faculty Endorsement Processed', time: '1h ago', body: 'Dr. Rajesh Iyer approved 42 student skill badges.' },
        { title: 'Registry Synchronized', time: '3h ago', body: 'Student competency database synced with Central Academic Records.' }
      ]
    }) +
    '<div class="stats-grid">' +
    statCardStar(summary.funnel.shortlisted || 1, 'Shortlisted') +
    statCard('🎓', summary.students, 'Students') +
    statCard('🧑‍🏫', summary.academicians, 'Academicians') +
    statCard('🏢', summary.industries, 'Industry partners') +
    '</div>' +
    renderEngagementMatrix({
      title: 'Platform Student Engagement Matrix',
      subtitle: 'Weekly hourly activity distribution',
      badge: 'PEAK: 2 PM - 6 PM'
    }) +
    '<div class="two-col">' +
    renderSkillVelocity() +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Placement funnel</h2></div></div>' + funnelHtml + '</div>' +
    '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Top in-demand skills</h2></div></div>' + topSkillsHtml + '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Quick actions</h2></div></div>' +
    '<div class="quick-actions">' +
    '<button onclick="setView(\'users\')"><span>👥</span> View Users</button>' +
    '<button onclick="setView(\'opportunities\')"><span>📢</span> View Opportunities</button>' +
    '<button onclick="setView(\'analytics\')"><span>📊</span> Full Analytics</button>' +
    '<button onclick="exportUsersCsv()"><span>⬇️</span> Export Users</button>' +
    '</div>' +
    '</div>';
}

/* =========================================================
   ADMIN: USERS / FACULTY & DIRECTORY (Image 2 Match)
========================================================= */
async function renderUsersView(user) {
  var roleFilter = ui.userRoleFilter || '';
  var params = {};
  if (roleFilter) params.role = roleFilter;
  if (ui.userSearch) params.q = ui.userSearch;
  var list = (await api.listUsers(params)).users;

  // Campus Faculty & Mentors Directory (Image 2 Visual Style)
  var image2Faculty = [
    { name: 'Dr. Rajesh Iyer', code: 'FAC-001', desig: 'Senior Professor & HOD', dept: 'Computer Science & Engineering', spec: 'Quantum Computing & Systems', status: 'Active' },
    { name: 'Sunita Rao', code: 'FAC-002', desig: 'Senior Faculty & AI Researcher', dept: 'Data Science & Mathematics', spec: 'Distributed Algorithms & Optimization', status: 'Active' },
    { name: 'Vikram Malhotra', code: 'FAC-003', desig: 'Professor of Practice', dept: 'Software Engineering & Cloud', spec: 'Cloud Architecture & Microservices', status: 'Active' },
    { name: 'Priya Menon', code: 'FAC-004', desig: 'Faculty Lead - Industry Relations', dept: 'Corporate Engagement & Careers', spec: 'Technical Communication & Readiness', status: 'Active' },
    { name: 'Aditya Deshmukh', code: 'FAC-005', Lab: true, desig: 'Lab Director & AI Mentor', dept: 'Artificial Intelligence & IT', spec: 'Machine Learning & Data Pipelines', status: 'On Leave' }
  ];

  var q = (ui.userSearch || '').toLowerCase().trim();
  var filteredFaculty = image2Faculty.filter(function (f) {
    if (!q) return true;
    return f.name.toLowerCase().indexOf(q) > -1 || f.code.toLowerCase().indexOf(q) > -1 || f.dept.toLowerCase().indexOf(q) > -1 || f.spec.toLowerCase().indexOf(q) > -1;
  });

  var rowsHtml = '';

  // Render Image 2 rows if not explicitly filtered out
  if (!roleFilter || roleFilter === 'academician') {
    rowsHtml += filteredFaculty.map(function (f) {
      var statusBadge = f.status === 'Active' ? '<span class="pill-status-active">Active</span>' : '<span class="pill-status-leave">On Leave</span>';
      return '<tr>' +
        '<td style="font-weight:700;color:#0f172a;">' + escapeHtml(f.name) + '</td>' +
        '<td style="font-weight:700;color:#0284c7;">' + escapeHtml(f.code) + '</td>' +
        '<td style="color:#475569;">' + escapeHtml(f.desig) + '</td>' +
        '<td style="color:#475569;">' + escapeHtml(f.dept) + '</td>' +
        '<td><span class="pill-specialization">' + escapeHtml(f.spec) + '</span></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td>' +
        '<button type="button" class="btn-purple-action" onclick="showToast(\'Allocations opened for ' + escapeHtml(f.name).replace(/'/g, "\\'") + '\')">Allocations</button>' +
        '<button type="button" class="btn-link-edit" onclick="showToast(\'Editing record for ' + escapeHtml(f.name).replace(/'/g, "\\'") + '\')">Edit</button>' +
        '</td>' +
        '</tr>';
    }).join('');
  }

  // Render platform users
  var registeredRows = list.map(function (u, i) {
    var code = 'USR-' + String(100 + i);
    var desig = u.headline || ROLE_LABEL[u.role];
    var dept = u.department || u.orgName || u.institution || 'General';
    var spec = (u.skills && u.skills.length) ? u.skills.map(function (s) { return s.name; }).slice(0, 2).join(', ') : (u.sector || 'SkillBridge Member');
    return '<tr>' +
      '<td style="font-weight:700;color:#0f172a;">' + escapeHtml(u.name) + '</td>' +
      '<td style="font-weight:700;color:#0284c7;">' + escapeHtml(code) + '</td>' +
      '<td style="color:#475569;">' + escapeHtml(desig) + '</td>' +
      '<td style="color:#475569;">' + escapeHtml(dept) + '</td>' +
      '<td><span class="pill-specialization">' + escapeHtml(spec) + '</span></td>' +
      '<td><span class="pill-status-active">Active</span></td>' +
      '<td>' +
      '<button type="button" class="btn-purple-action" onclick="showToast(\'Allocations for ' + escapeHtml(u.name).replace(/'/g, "\\'") + '\')">Allocations</button>' +
      '<button type="button" class="btn-link-edit" onclick="showToast(\'Editing ' + escapeHtml(u.name).replace(/'/g, "\\'") + '\')">Edit</button>' +
      '</td>' +
      '</tr>';
  }).join('');

  rowsHtml += registeredRows;

  if (!rowsHtml) {
    rowsHtml = '<tr><td colspan="7" class="empty-message">No records found matching your filters.</td></tr>';
  }

  return '' +
    '<!-- Directory Search Bar (Image 2) -->' +
    '<div class="directory-search-bar">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
    '<input type="text" placeholder="Search by Name, Employee Code, Subject..." value="' + escapeHtml(ui.userSearch || '') + '" oninput="ui.userSearch=this.value; renderContentOnly();">' +
    '</div>' +

    '<div class="filter-bar" style="margin-bottom:18px;">' +
    '<select onchange="ui.userRoleFilter=this.value; renderContentOnly();">' +
    '<option value="">All directories</option>' +
    '<option value="academician" ' + (roleFilter === 'academician' ? 'selected' : '') + '>Faculty & Academicians</option>' +
    '<option value="student" ' + (roleFilter === 'student' ? 'selected' : '') + '>Students</option>' +
    '<option value="industry" ' + (roleFilter === 'industry' ? 'selected' : '') + '>Industry Partners</option>' +
    '<option value="admin" ' + (roleFilter === 'admin' ? 'selected' : '') + '>Administrators</option>' +
    '</select>' +
    '</div>' +

    '<div class="dashboard-section" style="padding:0;overflow:hidden;border:1px solid #e2e8f0;border-radius:16px;">' +
    '<div class="table-wrap"><table class="data-table">' +
    '<thead><tr><th>FULL NAME</th><th>EMPLOYEE CODE</th><th>DESIGNATION</th><th>DEPARTMENT</th><th>SPECIALIZATION</th><th>STATUS</th><th>ACTIONS</th></tr></thead>' +
    '<tbody>' + rowsHtml + '</tbody>' +
    '</table></div></div>';
}

async function exportUsersCsv() {
  await guarded(async function () {
    var csv = await api.exportUsersCsv();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(csv);
      showToast('User list copied as CSV.');
    } else {
      showToast('Clipboard not available in this browser.');
    }
  });
}

/* =========================================================
   ADMIN: OPPORTUNITIES OVERVIEW
========================================================= */
async function renderAdminOpportunities(user) {
  var opps = (await api.listOpportunities()).opportunities;
  var rows = opps.length ? opps.map(function (o) {
    return '<tr><td>' + escapeHtml(o.title) + '</td><td>' + escapeHtml(o.industryName) + '</td><td>' + escapeHtml(o.type) + '</td><td>' + (o.requiredSkills || []).join(', ') + '</td><td>' + fmtDate(o.deadline) + '</td><td>' + o.applicantCount + '</td></tr>';
  }).join('') : '<tr><td colspan="6" class="empty-message">No opportunities posted yet.</td></tr>';

  return '<div class="dashboard-section"><div class="table-wrap"><table class="data-table"><tr><th>Title</th><th>Industry</th><th>Type</th><th>Required Skills</th><th>Deadline</th><th>Applicants</th></tr>' + rows + '</table></div></div>';
}

/* =========================================================
   ADMIN: ANALYTICS
========================================================= */
async function renderAnalyticsView(user) {
  var summary = await api.analyticsSummary();
  var skills = await api.analyticsSkills();

  var supplyHtml = skills.supply.length ? skills.supply.slice(0, 8).map(function (s) {
    var pct = Math.round(s.count / skills.supply[0].count * 100);
    return '<div class="skill-bar-row"><div class="bar-label"><span>' + escapeHtml(s.name) + '</span><span>' + s.count + '</span></div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div></div>';
  }).join('') : '<p class="empty-message">No student skill data yet.</p>';

  var appsByStatus = summary.applicationsByStatus || {};
  var statusHtml = Object.keys(appsByStatus).length ? Object.keys(appsByStatus).map(function (s) {
    return '<div class="stat-card"><span>📌</span><h3>' + appsByStatus[s] + '</h3><p>' + s + '</p></div>';
  }).join('') : '<p class="empty-message">No applications yet.</p>';

  return '' +
    '<div class="stats-grid">' +
    statCardStar(summary.funnel.shortlisted || 1, 'Shortlisted') +
    statCard('📨', summary.funnel.applied, 'Applications') +
    statCard('✅', summary.funnel.selected, 'Selected') +
    statCard('📢', summary.opportunities, 'Opportunities') +
    '</div>' +
    renderEngagementMatrix({
      title: 'Platform Student Engagement Matrix',
      subtitle: 'Weekly hourly activity distribution',
      badge: 'PEAK: 2 PM - 6 PM'
    }) +
    '<div class="two-col">' +
    renderSkillVelocity() +
    renderSkillDemandCard(skills) +
    '</div>' +
    '<div class="dashboard-section"><div class="section-heading"><div><h2>Skill supply</h2><p>Most common skills among students.</p></div></div>' + supplyHtml + '</div>';
}

/* =========================================================
   INIT
========================================================= */
(async function init() {
  var token = getToken();
  if (token) {
    try {
      var res = await api.me();
      session.user = res.user;
    } catch (err) {
      setToken(null);
    }
  }
  render();
})();
