let SHEET_ID = window.TIPPSPIEL_SHEET_ID || "15TA6wW-UNnE6kzcS7mTr2l4Tx4bfydS3kYtDGtIpgac";
let SITE_TITLE = "Tippspiel";
const REFRESH_MS = 60_000;

async function loadConfig() {
  try {
    const r = await fetch("config.json");
    const cfg = await r.json();
    if (cfg.sheetId) SHEET_ID = cfg.sheetId;
    if (cfg.title) {
      SITE_TITLE = cfg.title;
      document.querySelectorAll(".tippspiel-title").forEach(el => el.textContent = `⚽ Tippspiel ${cfg.title}`);
    }
  } catch (_) {}
}

// English → German team name translations
const TEAM_DE = {
  "Afghanistan": "Afghanistan",
  "Albania": "Albanien",
  "Algeria": "Algerien",
  "Angola": "Angola",
  "Argentina": "Argentinien",
  "Armenia": "Armenien",
  "Australia": "Australien",
  "Austria": "Österreich",
  "Azerbaijan": "Aserbaidschan",
  "Bahrain": "Bahrain",
  "Belgium": "Belgien",
  "Bolivia": "Bolivien",
  "Bosnia and Herzegovina": "Bosnien-Herzegowina",
  "Bosnia-Herzegovina": "Bosnien-Herzegowina",
  "Brazil": "Brasilien",
  "Bulgaria": "Bulgarien",
  "Cameroon": "Kamerun",
  "Canada": "Kanada",
  "Cape Verde Islands": "Kap Verde",
  "Cape Verde": "Kap Verde",
  "Chile": "Chile",
  "China PR": "China",
  "Colombia": "Kolumbien",
  "Congo DR": "DR Kongo",
  "Costa Rica": "Costa Rica",
  "Croatia": "Kroatien",
  "Cuba": "Kuba",
  "Curaçao": "Curaçao",
  "Czech Republic": "Tschechien",
  "Czechia": "Tschechien",
  "Denmark": "Dänemark",
  "Ecuador": "Ecuador",
  "Egypt": "Ägypten",
  "El Salvador": "El Salvador",
  "England": "England",
  "Estonia": "Estland",
  "Finland": "Finnland",
  "France": "Frankreich",
  "Georgia": "Georgien",
  "Germany": "Deutschland",
  "Ghana": "Ghana",
  "Haiti": "Haiti",
  "Greece": "Griechenland",
  "Guatemala": "Guatemala",
  "Guinea": "Guinea",
  "Honduras": "Honduras",
  "Hungary": "Ungarn",
  "Iceland": "Island",
  "India": "Indien",
  "Indonesia": "Indonesien",
  "Iran": "Iran",
  "IR Iran": "Iran",
  "Iraq": "Irak",
  "Israel": "Israel",
  "Italy": "Italien",
  "Ivory Coast": "Elfenbeinküste",
  "Jamaica": "Jamaika",
  "Japan": "Japan",
  "Jordan": "Jordanien",
  "Kazakhstan": "Kasachstan",
  "Kenya": "Kenia",
  "Korea Republic": "Südkorea",
  "Kosovo": "Kosovo",
  "Kuwait": "Kuwait",
  "Latvia": "Lettland",
  "Lebanon": "Libanon",
  "Lithuania": "Litauen",
  "Luxembourg": "Luxemburg",
  "Mali": "Mali",
  "Mexico": "Mexiko",
  "Moldova": "Moldau",
  "Montenegro": "Montenegro",
  "Morocco": "Marokko",
  "Netherlands": "Niederlande",
  "New Zealand": "Neuseeland",
  "Nigeria": "Nigeria",
  "North Macedonia": "Nordmazedonien",
  "Norway": "Norwegen",
  "Oman": "Oman",
  "Panama": "Panama",
  "Paraguay": "Paraguay",
  "Peru": "Peru",
  "Poland": "Polen",
  "Portugal": "Portugal",
  "Qatar": "Katar",
  "Romania": "Rumänien",
  "Russia": "Russland",
  "Saudi Arabia": "Saudi-Arabien",
  "Scotland": "Schottland",
  "Senegal": "Senegal",
  "Serbia": "Serbien",
  "Slovakia": "Slowakei",
  "Slovenia": "Slowenien",
  "South Africa": "Südafrika",
  "South Korea": "Südkorea",
  "Spain": "Spanien",
  "Sweden": "Schweden",
  "Switzerland": "Schweiz",
  "Syria": "Syrien",
  "Trinidad and Tobago": "Trinidad und Tobago",
  "Tunisia": "Tunesien",
  "Turkey": "Türkei",
  "Türkiye": "Türkei",
  "Ukraine": "Ukraine",
  "United Arab Emirates": "Vereinigte Arabische Emirate",
  "United States": "USA",
  "Uruguay": "Uruguay",
  "Uzbekistan": "Usbekistan",
  "Venezuela": "Venezuela",
  "Wales": "Wales",
  "Zambia": "Sambia",
  "Zimbabwe": "Simbabwe",
};

function teamDE(name) {
  return TEAM_DE[name] || name;
}

// German/English team name (lowercase) → flag emoji
const TEAM_FLAG = {
  "ägypten": "🇪🇬", "egypt": "🇪🇬",
  "algerien": "🇩🇿", "algeria": "🇩🇿",
  "argentinien": "🇦🇷", "argentina": "🇦🇷",
  "australien": "🇦🇺", "australia": "🇦🇺",
  "belgien": "🇧🇪", "belgium": "🇧🇪",
  "bolivien": "🇧🇴", "bolivia": "🇧🇴",
  "bosnien-herzegowina": "🇧🇦", "bosnien und herzegowina": "🇧🇦", "bosnia and herzegovina": "🇧🇦",
  "brasilien": "🇧🇷", "brazil": "🇧🇷",
  "chile": "🇨🇱",
  "china": "🇨🇳", "china pr": "🇨🇳",
  "costa rica": "🇨🇷",
  "dänemark": "🇩🇰", "denmark": "🇩🇰",
  "deutschland": "🇩🇪", "germany": "🇩🇪",
  "dr kongo": "🇨🇩", "congo dr": "🇨🇩",
  "ecuador": "🇪🇨",
  "elfenbeinküste": "🇨🇮", "ivory coast": "🇨🇮",
  "england": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "frankreich": "🇫🇷", "france": "🇫🇷",
  "ghana": "🇬🇭",
  "honduras": "🇭🇳",
  "iran": "🇮🇷", "ir iran": "🇮🇷",
  "japan": "🇯🇵",
  "kamerun": "🇨🇲", "cameroon": "🇨🇲",
  "kanada": "🇨🇦", "canada": "🇨🇦",
  "kap verde": "🇨🇻", "cape verde": "🇨🇻",
  "katar": "🇶🇦", "qatar": "🇶🇦",
  "kolumbien": "🇨🇴", "colombia": "🇨🇴",
  "kroatien": "🇭🇷", "croatia": "🇭🇷",
  "kuba": "🇨🇺", "cuba": "🇨🇺",
  "marokko": "🇲🇦", "morocco": "🇲🇦",
  "mexiko": "🇲🇽", "mexico": "🇲🇽",
  "neuseeland": "🇳🇿", "new zealand": "🇳🇿",
  "niederlande": "🇳🇱", "netherlands": "🇳🇱",
  "nigeria": "🇳🇬",
  "nordkorea": "🇰🇵", "korea dpr": "🇰🇵",
  "norwegen": "🇳🇴", "norway": "🇳🇴",
  "österreich": "🇦🇹", "austria": "🇦🇹",
  "panama": "🇵🇦",
  "paraguay": "🇵🇾",
  "peru": "🇵🇪",
  "polen": "🇵🇱", "poland": "🇵🇱",
  "portugal": "🇵🇹",
  "saudi-arabien": "🇸🇦", "saudi arabia": "🇸🇦",
  "schottland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "schweden": "🇸🇪", "sweden": "🇸🇪",
  "schweiz": "🇨🇭", "switzerland": "🇨🇭",
  "senegal": "🇸🇳",
  "serbien": "🇷🇸", "serbia": "🇷🇸",
  "slowenien": "🇸🇮", "slovenia": "🇸🇮",
  "spanien": "🇪🇸", "spain": "🇪🇸",
  "südafrika": "🇿🇦", "south africa": "🇿🇦",
  "südkorea": "🇰🇷", "south korea": "🇰🇷", "korea republic": "🇰🇷",
  "tschechien": "🇨🇿", "czech republic": "🇨🇿", "czechia": "🇨🇿",
  "tunesien": "🇹🇳", "tunisia": "🇹🇳",
  "türkei": "🇹🇷", "turkey": "🇹🇷", "türkiye": "🇹🇷",
  "ukraine": "🇺🇦",
  "ungarn": "🇭🇺", "hungary": "🇭🇺",
  "uruguay": "🇺🇾",
  "usa": "🇺🇸", "united states": "🇺🇸",
  "venezuela": "🇻🇪",
  "wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
};

function getSheetId() {
  const params = new URLSearchParams(location.search);
  return params.get("sid") || SHEET_ID;
}

async function fetchSheet(sheetName) {
  const sid = getSheetId();
  if (!sid) throw new Error("Keine Tabellen-ID konfiguriert.");
  const url =
    `https://docs.google.com/spreadsheets/d/${sid}/gviz/tq` +
    `?sheet=${encodeURIComponent(sheetName)}&tqx=out:json`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} beim Laden von "${sheetName}"`);
  const text = await resp.text();
  const json = JSON.parse(text.replace(/^[^\(]+\(/, "").replace(/\);?\s*$/, ""));
  return parseGvizTable(json.table);
}

function parseGvizTable(table) {
  if (!table || !table.cols) return { headers: [], rows: [] };
  const headers = table.cols.map((c) => c.label || c.id || "");
  const rows = (table.rows || []).map((r) =>
    r.c.map((cell) => {
      if (!cell || cell.v == null) return "";
      // gviz returns dates as "Date(year,month,day)" — use formatted string instead
      if (typeof cell.v === "string" && cell.v.startsWith("Date(")) return cell.f ?? "";
      if (cell.v instanceof Date) return cell.f ?? cell.v.toISOString().slice(0, 10);
      return cell.v;
    })
  );
  return { headers, rows };
}

// Phase 2 (knockout) begins once every Group Stage match has both scores.
// Matches columns: 4 = stage, 7 = home_score, 8 = away_score.
function isGroupPhaseComplete(matchRows) {
  const group = matchRows.filter(m => String(m[4]) === "Group Stage");
  if (!group.length) return false;
  return group.every(m => String(m[7]) !== "" && String(m[8]) !== "");
}

// ── Knockout dashboard (Phase 2) ───────────────────────────────────────────────
// Matches columns: 1 = date, 2 = time, 4 = stage, 5 = home, 6 = away, 7/8 = scores.

const KNOCKOUT_ORDER = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];
const ROUND_DE = {
  "Round of 32": "Sechzehntelfinale",
  "Round of 16": "Achtelfinale",
  "Quarter-finals": "Viertelfinale",
  "Semi-finals": "Halbfinale",
  "Third Place": "Spiel um Platz 3",
  "Final": "Finale",
};

function norm(s) { return String(s ?? "").trim().toLowerCase(); }

// Teams still in the tournament: every team that has appeared in a drawn knockout match,
// minus the losers of any already-decided knockout match (at any round). Taking the full
// knockout participant pool — not just the latest drawn round — keeps teams that are still
// waiting to play their Round-of-32 game in the survivor set even after later rounds start
// to be drawn. Returns a Set of normalized names (both English and German forms), or null
// if no knockout teams are assigned yet (→ callers treat everyone as still-in).
function stillInTeams(matchRows) {
  const ko = matchRows.filter(m => KNOCKOUT_ORDER.includes(String(m[4])) && m[5] && m[6]);
  if (!ko.length) return null;

  const survivors = new Set();
  ko.forEach(m => { survivors.add(String(m[5])); survivors.add(String(m[6])); });
  // Drop the loser of any decided knockout match (equal score = penalties → keep both).
  ko.forEach(m => {
    const hs = parseInt(m[7]), as = parseInt(m[8]);
    if (isNaN(hs) || isNaN(as) || hs === as) return;
    survivors.delete(String(hs < as ? m[5] : m[6]));
  });

  const set = new Set();
  survivors.forEach(t => { set.add(norm(t)); set.add(norm(teamDE(t))); });
  return set;
}

function isStillIn(team, set) {
  if (!set) return true;
  return set.has(norm(team)) || set.has(norm(teamDE(team)));
}

// Compact tile string for one match.
function roundTile(m) {
  const home = teamDE(String(m[5])), away = teamDE(String(m[6]));
  const fh = TEAM_FLAG[home.toLowerCase()] || TEAM_FLAG[norm(m[5])] || "";
  const fa = TEAM_FLAG[away.toLowerCase()] || TEAM_FLAG[norm(m[6])] || "";
  const hs = m[7], as = m[8];
  const hasResult = String(hs) !== "" && String(as) !== "";
  // home_pen/away_pen (cols 9/10): set only when a match went to penalties. The stored
  // home_score/away_score is the aggregate incl. the shootout, so the 90+ET score that we
  // show is aggregate − pens (e.g. 4−3 : 5−4 → 1:1, with "3:4 n.E." underneath).
  const penH = m[9], penA = m[10];
  const hasPens = String(penH ?? "") !== "" && String(penA ?? "") !== "";
  const dispH = hasPens ? Number(hs) - Number(penH) : hs;
  const dispA = hasPens ? Number(as) - Number(penA) : as;
  // Loser of a decided knockout match (lower aggregate score) is eliminated.
  let homeOut = false, awayOut = false;
  if (hasResult && Number(hs) !== Number(as)) {
    if (Number(hs) < Number(as)) homeOut = true; else awayOut = true;
  }
  const dateLabel = (() => {
    const d = new Date(`${String(m[1]).slice(0,10)}T00:00:00`);
    return isNaN(d) ? String(m[1]) : d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
  })();
  const meta = hasResult ? dateLabel : `${dateLabel} · ${escHtml(String(m[2]))} Uhr`;
  const center = hasResult ? `${escHtml(String(dispH))}–${escHtml(String(dispA))}` : "vs";
  const penLine = hasPens ? `<div class="rt-pens">${escHtml(String(penH))}:${escHtml(String(penA))} n.E.</div>` : "";
  return `<div class="round-tile${hasResult ? " done" : ""}">
    <div class="rt-meta">${escHtml(meta)}</div>
    <div class="rt-teams">
      <span class="rt-side${homeOut ? " elim" : ""}"><span class="rt-flag">${fh}</span><span class="rt-name">${escHtml(home)}</span></span>
      <span class="rt-score">${center}</span>
      <span class="rt-side rt-away${awayOut ? " elim" : ""}"><span class="rt-name">${escHtml(away)}</span><span class="rt-flag">${fa}</span></span>
    </div>
    ${penLine}
  </div>`;
}

function renderRoundTiles(matchRows) {
  // Current round = earliest drawn round with an unplayed match; else the latest drawn round.
  let current = null, lastDrawn = null;
  for (const stage of KNOCKOUT_ORDER) {
    const rows = matchRows.filter(m => String(m[4]) === stage && m[5] && m[6]);
    if (!rows.length) continue;
    lastDrawn = stage;
    const incomplete = rows.some(m => String(m[7]) === "" || String(m[8]) === "");
    if (incomplete && !current) current = stage;
  }
  const stage = current || lastDrawn;
  if (!stage) return "";

  const stages = stage === "Final" ? ["Final", "Third Place"] : [stage];
  let tiles = "";
  stages.forEach(st => {
    matchRows
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => String(m[4]) === st && m[5] && m[6])
      .sort((a, b) => new Date(`${String(a.m[1]).slice(0,10)}T${a.m[2] || "00:00"}`) - new Date(`${String(b.m[1]).slice(0,10)}T${b.m[2] || "00:00"}`))
      .forEach(({ m }) => { tiles += roundTile(m); });
  });
  if (!tiles) return "";
  return `<div class="round-section">
    <h3>${escHtml(ROUND_DE[stage] || stage)}</h3>
    <div class="round-tiles">${tiles}</div>
  </div>`;
}

// Ranked top-scorer list. Normally limited to players still in the tournament, but the
// current leader(s) stay even if their team is out — they remain the leading scorer (and
// hold the Torschützenkönig bet) until someone with more goals surpasses them.
function renderKnockoutScorers(scorersRows, set) {
  const valid = scorersRows.filter(r => r[0] && parseInt(r[2]) > 0);
  const globalMax = valid.reduce((m, r) => Math.max(m, parseInt(r[2])), 0);
  const items = valid
    .filter(r => isStillIn(r[1], set) || parseInt(r[2]) === globalMax)
    .slice(0, 10);
  if (!items.length) return "";
  let rank = 1, prev = null, count = 0;
  const body = items.map(r => {
    const v = parseInt(r[2]);
    if (v !== prev) { rank = count + 1; prev = v; }
    count++;
    return `<tr${rank === 1 ? ' class="ks-top"' : ""}><td class="ks-rank">${rank}</td><td>${escHtml(String(r[0]))} <span class="ks-team">(${escHtml(teamDE(String(r[1])))})</span></td><td class="ks-val">${v}</td></tr>`;
  }).join("");
  return `<div class="ks-box">
    <h3>Torschützenkönig <small>(noch im Rennen)</small></h3>
    <table class="ks-table"><tbody>${body}</tbody></table>
  </div>`;
}

// Semifinal-tips grid; picks whose team is out are greyed (cf. halbTable in renderSpecial).
function renderSemiTips(spTipsRows, spPtsRows, set) {
  if (!spTipsRows.length) return "";
  const sfPtsByPlayer = {};
  spPtsRows.forEach(r => { if (r[0]) sfPtsByPlayer[String(r[0])] = r[3]; }); // Special_Points col 3 = SF pts
  // Skip the Special_Tips header row (gviz passes it as data when all columns are text).
  const players = spTipsRows.filter(r => r[0] && String(r[0]).trim() !== "Spieler");
  const rows = players.map(r => {
    const picks = [r[3], r[4], r[5], r[6]].map(v => String(v ?? ""));
    const cells = picks.map(p => {
      if (!p) return `<span class="semi-cell empty">–</span>`;
      const dead = !isStillIn(p, set);
      return `<span class="semi-cell${dead ? " dead" : ""}">${escHtml(teamDE(p))}</span>`;
    }).join("");
    const sf = parseInt(sfPtsByPlayer[String(r[0])], 10);
    const pts = isNaN(sf) ? 0 : sf;
    return `<div class="semi-row">
      <div class="semi-row-head"><span class="semi-player">${escHtml(String(r[0]))}</span><span class="semi-pts">${pts} Pkt</span></div>
      <div class="semi-picks">${cells}</div>
    </div>`;
  }).join("");
  return `<div class="semi-box">
    <h3>Halbfinal-Tipps <small>(ausgeschiedene ausgegraut)</small></h3>
    <div class="semi-list">${rows}</div>
  </div>`;
}

function renderKnockoutDashboard(matchRows, scorersRows, spTipsRows, spPtsRows) {
  const set = stillInTeams(matchRows);
  return renderRoundTiles(matchRows)
       + renderKnockoutScorers(scorersRows, set)
       + renderSemiTips(spTipsRows, spPtsRows, set);
}

// ── Upcoming matches / countdown ───────────────────────────────────────────────

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatCountdown(ms) {
  if (ms <= 0) return "gleich";
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (d > 0) return `${d} Tag${d !== 1 ? "e" : ""} ${h} Std`;
  if (h > 0) return `${h} Std ${m} Min`;
  return `${m} Min`;
}

function renderUpcoming(matches, container) {
  const today = todayStr();
  const todayMatches = matches.filter(m => String(m[1]).slice(0, 10) === today);
  const now = Date.now();

  if (todayMatches.length > 0) {
    container.innerHTML = "";
    return;
  }

  // No match today — find next match without a result
  const upcoming = matches
    .filter(m => m[7] === "" || m[8] === "")
    .map(m => {
      const dateStr = String(m[1]).slice(0, 10);
      const timeStr = String(m[2]) || "00:00";
      const dt = new Date(`${dateStr}T${timeStr}:00`);
      return { m, dt };
    })
    .filter(x => !isNaN(x.dt))
    .sort((a, b) => a.dt - b.dt);

  if (!upcoming.length) {
    container.innerHTML = `<div class="upcoming-section"><p class="upcoming-done">Alle Gruppenspiele abgeschlossen.</p></div>`;
    return;
  }

  const next = upcoming[0];
  const msUntil = next.dt - now;
  const home = teamDE(String(next.m[5]));
  const away = teamDE(String(next.m[6]));
  const dateFormatted = new Date(next.dt).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
  const timeFormatted = String(next.m[2]);

  // Group consecutive matches on the same day
  const nextDay = String(next.m[1]).slice(0, 10);
  const nextDayMatches = upcoming.filter(x => String(x.m[1]).slice(0, 10) === nextDay);

  let html = `<div class="upcoming-section">
    <h3>Nächste Spiele <span class="countdown-badge">in ${formatCountdown(msUntil)}</span></h3>
    <div class="upcoming-list">`;
  for (const { m, dt } of nextDayMatches) {
    const h = teamDE(String(m[5]));
    const a = teamDE(String(m[6]));
    const t = String(m[2]);
    html += `<div class="upcoming-match">
      <span class="upcoming-teams">${escHtml(h)} <span class="vs">vs</span> ${escHtml(a)}</span>
      <span class="upcoming-time">${escHtml(t)} Uhr</span>
    </div>`;
  }
  html += `</div></div>`;
  container.innerHTML = html;
}

// ── Today's matches with tips (homepage) ──────────────────────────────────────

async function renderTodayMatches(matchRows, pointsMatrix, tipsMap, container) {
  const today = todayStr();
  const todayMatches = matchRows
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => String(m[1]).slice(0, 10) === today && m[4] === "Group Stage");

  if (!todayMatches.length) { container.innerHTML = ""; return; }

  const groupMatchIndices = [];
  matchRows.forEach((m, i) => { if (m[4] === "Group Stage") groupMatchIndices.push(i); });

  const players = pointsMatrix.map(r => r[0]);
  const now = Date.now();
  const kickoffMs = x => new Date(`${today}T${String(x.m[2])}:00`).getTime();
  const hasStarted = x => now >= kickoffMs(x);
  const isLive = x => { const k = kickoffMs(x); return now >= k && now < k + 120 * 60 * 1000; };

  // Visible window: most recently started match + next upcoming match
  const lastStarted = todayMatches.filter(hasStarted).at(-1);
  const nextUpcoming = todayMatches.find(x => !hasStarted(x));
  const visibleSet = new Set(
    [lastStarted, nextUpcoming].filter(Boolean).map(x => x.i)
  );

  const visibleMatches = todayMatches.filter(x => visibleSet.has(x.i));
  const otherMatches   = todayMatches.filter(x => !visibleSet.has(x.i));

  const buildCard = ({ m, i: matchIdx }, opts = {}) => {
    const { collapsible = false, collapsed = false } = opts;
    const entry = { m, i: matchIdx };
    const home = teamDE(String(m[5]));
    const away = teamDE(String(m[6]));
    const homeScore = m[7], awayScore = m[8];
    const hasResult = homeScore !== "" && awayScore !== "";
    const live = isLive(entry);
    const resultStr = hasResult ? `${homeScore} – ${awayScore}` : String(m[2]) + " Uhr";
    const liveBadge = live ? ` <span class="live-badge">● LIVE</span>` : "";
    const gmCol = groupMatchIndices.indexOf(matchIdx);
    const ptCol = gmCol >= 0 ? gmCol + 1 : -1;
    const collapseClass = collapsed ? " tm-collapsed" : "";
    const headerToggle = collapsible ? ` onclick="this.closest('.today-match-card').classList.toggle('tm-collapsed')"` : "";
    const chevron = collapsible ? `<span class="tm-chevron">▾</span>` : "";
    const headerCursor = collapsible ? "" : " style=\"cursor:default\"";

    let card = `<div class="today-match-card${collapseClass}">
      <div class="today-match-header"${headerToggle}${headerCursor}>
        <span class="today-match-teams">${escHtml(home)} <span class="vs">vs</span> ${escHtml(away)}${liveBadge}</span>
        <span class="today-match-result ${hasResult ? "final" : "pending"}">${escHtml(resultStr)}</span>
        ${chevron}
      </div>`;
    if (players.length && ptCol >= 0) {
      card += `<table class="today-tips-table"><tbody>`;
      players.forEach((player, pi) => {
        const pts = parseInt(String(pointsMatrix[pi]?.[ptCol] ?? ""), 10);
        const ptClass = pts === 3 ? "exact" : pts === 1 ? "outcome" : hasResult ? "miss" : "no-result";
        const tipRow = tipsMap[String(player)];
        const tipStr = tipRow ? String(tipRow[ptCol] ?? "") : "";
        const ptLabel = !hasResult ? "" : isNaN(pts) ? "–" : `${pts} Pkt`;
        card += `<tr>
          <td class="today-tip-player">${escHtml(String(player))}</td>
          <td class="today-tip-str">${escHtml(tipStr)}</td>
          <td class="today-tip-pts"><span class="${ptClass}">${ptLabel || "–"}</span></td>
        </tr>`;
      });
      card += `</tbody></table>`;
    }
    card += `</div>`;
    return card;
  };

  let html = `<div class="today-section"><h3>Heutige Spiele</h3>`;

  const minVisible = Math.min(...[...visibleSet]);
  const earlierMatches = otherMatches.filter(x => x.i < minVisible);
  const laterMatches   = otherMatches.filter(x => x.i > Math.max(...[...visibleSet]));

  if (earlierMatches.length) {
    html += `<div class="today-matches-list">`;
    for (const x of earlierMatches) html += buildCard(x, { collapsible: true, collapsed: true });
    html += `</div>`;
  }

  if (visibleMatches.length) {
    html += `<div class="today-matches-grid">`;
    for (const x of visibleMatches) html += buildCard(x, { collapsible: false });
    html += `</div>`;
  }

  if (laterMatches.length) {
    html += `<div class="today-matches-list">`;
    for (const x of laterMatches) html += buildCard(x, { collapsible: true, collapsed: true });
    html += `</div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

// ── Rangliste / Homepage (index.html) ─────────────────────────────────────────

async function renderLeaderboard() {
  const container = document.getElementById("leaderboard-container");
  const upcomingContainer = document.getElementById("upcoming-container");
  const todayContainer = document.getElementById("today-container");
  const statusEl = document.getElementById("status");

  try {
    const [{ rows: lbRows }, { rows: matchRows }, { rows: pointsRows }, tipsData, spTipsData, scorersData, spPtsData, newsData] = await Promise.all([
      fetchSheet("Leaderboard"),
      fetchSheet("Matches"),
      fetchSheet("Points"),
      fetchSheet("Tips").catch(() => ({ headers: [], rows: [] })),
      fetchSheet("Special_Tips").catch(() => ({ headers: [], rows: [] })),
      fetchSheet("Top_Scorers").catch(() => ({ headers: [], rows: [] })),
      fetchSheet("Special_Points").catch(() => ({ headers: [], rows: [] })),
      fetchSheet("News").catch(() => ({ headers: [], rows: [] })),
    ]);

    const tipsMap = {};
    tipsData.rows.forEach(r => { tipsMap[String(r[0])] = r; });

    // player → Weltmeister tip (Special_Tips col 1)
    const weltmeisterMap = {};
    spTipsData.rows.forEach(r => { if (r[0]) weltmeisterMap[String(r[0])] = String(r[1] || ""); });

    // Phase 2 (knockout): show the knockout dashboard above the banner and let the
    // round tiles supersede the group-phase "Nächste Spiele" block.
    const groupComplete = isGroupPhaseComplete(matchRows);
    const phase2Container = document.getElementById("phase2-container");
    if (phase2Container) {
      phase2Container.innerHTML = groupComplete
        ? renderKnockoutDashboard(matchRows, scorersData.rows, spTipsData.rows, spPtsData.rows)
        : "";
    }

    if (upcomingContainer && matchRows.length && !groupComplete) {
      renderUpcoming(matchRows, upcomingContainer);
    } else if (upcomingContainer && groupComplete) {
      upcomingContainer.innerHTML = "";
    }

    if (todayContainer && matchRows.length && !groupComplete) {
      await renderTodayMatches(matchRows, pointsRows, tipsMap, todayContainer);
    } else if (todayContainer && groupComplete) {
      todayContainer.innerHTML = "";
    }

    if (!lbRows.length) {
      container.innerHTML = "<p class='empty'>Noch keine Punkte eingetragen.</p>";
      return;
    }

    // Phase 2: group stage done → special points are awarded, so emphasize them.
    const emphCls = groupComplete ? " sp-emphasis" : "";
    const banner = groupComplete
      ? `<div class="phase-banner">⭐ Gruppenphase abgeschlossen — die ersten Spezialtipps wurden vergeben! <a href="special.html">Spezialtipps ansehen</a></div>`
      : "";

    let html = banner + `<table class="leaderboard-table">
      <thead><tr>
        <th>#</th>
        <th>Spieler</th>
        <th>Gesamt</th>
        <th>Spiele</th>
        <th class="${emphCls.trim()}">Spezialtipps</th>
      </tr></thead><tbody>`;

    lbRows.forEach((row) => {
      const rank = row[0];
      const name = row[1];
      const total = row[2];
      const matchPts = row[3];
      const specialPts = row[4];
      const medal = rank === 1 ? "🏆" : "";
      const rowClass = rank === 1 ? "rank-1" : "";
      const wm = weltmeisterMap[String(name)] || "";
      const flag = wm ? (TEAM_FLAG[wm.toLowerCase()] || "") : "";
      const flagHtml = flag ? ` <span title="${escHtml(wm)}">${flag}</span>` : "";
      html += `<tr class="${rowClass}">
        <td class="rank-cell">${medal || rank}</td>
        <td class="name-cell"><a class="player-link" href="player.html?player=${encodeURIComponent(String(name))}">${escHtml(String(name))}</a>${flagHtml}</td>
        <td class="pts-cell total">${total}</td>
        <td class="pts-cell">${matchPts}</td>
        <td class="pts-cell${emphCls}">${specialPts}</td>
      </tr>`;
    });

    html += "</tbody></table>";
    container.innerHTML = html;

    const chartContainer = document.getElementById("chart-container");
    if (chartContainer) renderProgressChart(matchRows, pointsRows, chartContainer);

    const newsContainer = document.getElementById("news-container");
    if (newsContainer) renderNews(newsData.rows, newsContainer);

    if (statusEl) statusEl.textContent = `Aktualisiert: ${new Date().toLocaleTimeString("de-DE")}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
}

// ── Points progression chart ──────────────────────────────────────────────────

let _progressChart = null;

const CHART_COLORS = ["#4f86f7","#f5c518","#4ade80","#f87171","#c084fc","#fb923c","#38bdf8","#f472b6"];
const CHART_SHAPES = ["circle","triangle","rect","rectRot","star","cross","crossRot","dash"];

// "#rrggbb" → "rgba(r,g,b,a)"
function hexAlpha(hex, a) {
  const h = String(hex).replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// Highlight one curve (index hi) by dimming the others; hi === null resets.
function applyChartHighlight(chart, hi) {
  chart.data.datasets.forEach((ds, i) => {
    const base = ds._baseColor;
    if (hi === null)      { ds.borderColor = base; ds.borderWidth = 2; }
    else if (i === hi)    { ds.borderColor = base; ds.borderWidth = 3.5; }
    else                  { ds.borderColor = hexAlpha(base, 0.12); ds.borderWidth = 1.5; }
  });
  chart.update("none");
}

// Draws each player's name at the right end of their line, and records the label
// hit-boxes so onHover can highlight the matching curve.
const endLabelPlugin = {
  id: "endLabels",
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    const hi = chart.$hoverLabel ?? null;
    const entries = chart.data.datasets.map((ds, i) => {
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden || !meta.data || !meta.data.length) return null;
      const last = meta.data[meta.data.length - 1];
      return { i, x: last.x, y: last.y, label: ds.label, color: ds._baseColor };
    }).filter(Boolean);

    // Spread labels vertically so close line-ends don't overlap.
    entries.sort((a, b) => a.y - b.y);
    const gap = 15;
    for (let k = 1; k < entries.length; k++) {
      if (entries[k].y - entries[k - 1].y < gap) entries[k].y = entries[k - 1].y + gap;
    }
    const overflow = entries.length && entries[entries.length - 1].y - chartArea.bottom;
    if (overflow > 0) entries.forEach(e => { e.y -= overflow; });

    ctx.save();
    ctx.textBaseline = "middle";
    const rects = [];
    entries.forEach(e => {
      const active = hi === e.i;
      const dim = hi !== null && !active;
      ctx.font = `${active ? "700" : "400"} 12px "Segoe UI", system-ui, sans-serif`;
      ctx.fillStyle = dim ? hexAlpha(e.color, 0.25) : e.color;
      const tx = e.x + 8;
      ctx.fillText(e.label, tx, e.y);
      const w = ctx.measureText(e.label).width;
      rects.push({ i: e.i, x: tx - 3, y: e.y - 9, w: w + 8, h: 18 });
    });
    ctx.restore();
    chart.$labelRects = rects;
  },
};

function renderProgressChart(matchRows, pointsRows, container) {
  if (typeof Chart === "undefined") { container.innerHTML = ""; return; }

  const groupMatchIndices = [];
  matchRows.forEach((m, i) => { if (m[4] === "Group Stage") groupMatchIndices.push(i); });

  // Only played matches (have a result)
  const playedIndices = groupMatchIndices.filter(i => matchRows[i][7] !== "" && matchRows[i][8] !== "");
  if (!playedIndices.length) { container.innerHTML = ""; return; }

  const labels = ["0", ...playedIndices.map((_, i) => String(i + 1))];

  const datasets = pointsRows.map((row, pi) => {
    const name = String(row[0]);
    let cum = 0;
    const data = [0];
    playedIndices.forEach((matchIdx, colOffset) => {
      const colIdx = groupMatchIndices.indexOf(matchIdx) + 1;
      const v = parseInt(String(row[colIdx] ?? ""), 10);
      cum += isNaN(v) ? 0 : v;
      data.push(cum);
    });
    const color = CHART_COLORS[pi % CHART_COLORS.length];
    return {
      label: name,
      data,
      borderColor: color,
      backgroundColor: color,
      _baseColor: color,
      pointStyle: CHART_SHAPES[pi % CHART_SHAPES.length],
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0.3,
      borderWidth: 2,
    };
  });

  container.innerHTML = `<div class="chart-box"><h3>Punkteverlauf</h3><div class="chart-canvas-wrap"><canvas id="progress-chart"></canvas></div></div>`;
  const ctx = document.getElementById("progress-chart").getContext("2d");

  if (_progressChart) { _progressChart.destroy(); _progressChart = null; }

  _progressChart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    plugins: [endLabelPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 96 } },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          title: { display: true, text: "Gespielte Spiele", color: "#8892b0" },
          ticks: { color: "#8892b0" },
          grid: { color: "#2a3555" },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Punkte", color: "#8892b0" },
          ticks: { color: "#8892b0", stepSize: 1, callback: v => Number.isInteger(v) ? v : null },
          grid: { color: "#2a3555" },
        },
      },
    },
  });

  // Hover a name label → highlight that curve. A direct canvas listener is more
  // reliable than Chart's onHover, which doesn't fire for the right-padding area
  // where the labels live. Element positions and label rects are in CSS pixels,
  // matching clientX/Y minus the canvas rect.
  const cv = ctx.canvas;
  function setHover(found) {
    if ((_progressChart.$hoverLabel ?? null) !== found) {
      _progressChart.$hoverLabel = found;
      applyChartHighlight(_progressChart, found);
    }
  }
  cv.addEventListener("mousemove", ev => {
    const rect = cv.getBoundingClientRect();
    const x = ev.clientX - rect.left, y = ev.clientY - rect.top;
    let found = null;
    for (const r of (_progressChart.$labelRects || [])) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) { found = r.i; break; }
    }
    cv.style.cursor = found !== null ? "pointer" : "default";
    setHover(found);
  });
  cv.addEventListener("mouseleave", () => setHover(null));
}

function renderNews(rows, container) {
  // Columns: A=Timestamp, B=Überschrift (optional), C=Nachricht
  // Reverse so newest (bottom) is shown first.
  const items = rows.slice(1).filter(r => r[0] || r[1] || r[2]).reverse();
  if (!items.length) { container.innerHTML = ""; return; }

  let html = `<div class="news-section"><h3>📰 Neuigkeiten</h3>`;
  items.forEach(r => {
    const ts      = escHtml(String(r[0] || ""));
    const heading = escHtml(String(r[1] || ""));
    const msg     = escHtml(String(r[2] || "")).split(/\n/).map(l => `<p>${l}</p>`).join("");
    html += `<div class="news-item">
      ${ts ? `<div class="news-timestamp">${ts}</div>` : ""}
      ${heading ? `<div class="news-heading">${heading}</div>` : ""}
      ${msg ? `<div class="news-message">${msg}</div>` : ""}
    </div>`;
  });
  html += `</div>`;
  container.innerHTML = html;
}

// ── Ergebnisse (results.html) ──────────────────────────────────────────────────

async function renderResults() {
  const container = document.getElementById("results-container");
  const statusEl = document.getElementById("status");

  try {
    const [matchData, pointsData, tipsData] = await Promise.all([
      fetchSheet("Matches"),
      fetchSheet("Points"),
      fetchSheet("Tips").catch(() => ({ headers: [], rows: [] })),
    ]);

    const matches = matchData.rows;
    if (!matches.length) {
      container.innerHTML = "<p class='empty'>Keine Spiele gefunden.</p>";
      return;
    }

    const players = pointsData.rows.map((r) => r[0]);
    const pointsMatrix = pointsData.rows;

    // Tips tab: col 0 = player name, col 1..N = raw tip strings in group-match order
    // Build lookup: playerName → tips array
    const tipsMap = {};
    tipsData.rows.forEach((r) => { tipsMap[String(r[0])] = r; });
    const hasTips = tipsData.rows.length > 0;

    // Build ordered list of group-match indices (position in Matches tab)
    const groupMatchIndices = [];
    matches.forEach((m, i) => {
      if (m[4] === "Group Stage") groupMatchIndices.push(i);
    });

    const groups = {};
    matches.forEach((m, i) => {
      const group = m[3] || "Andere";
      if (!groups[group]) groups[group] = [];
      groups[group].push({ match: m, matchIdx: i });
    });

    // Build group-nav data: group → unique teams in order of appearance
    const groupTeams = {};
    matches.forEach(m => {
      if (m[4] !== "Group Stage") return;
      const g = m[3] || "?";
      if (!groupTeams[g]) groupTeams[g] = [];
      [teamDE(String(m[5])), teamDE(String(m[6]))].forEach(t => {
        if (!groupTeams[g].includes(t)) groupTeams[g].push(t);
      });
    });
    const groupKeys = Object.keys(groupTeams).sort();

    let navHtml = `<div class="group-nav">`;
    groupKeys.forEach(g => {
      navHtml += `<a class="group-nav-box" href="#group-${encodeURIComponent(g)}">
        <div class="group-nav-letter">Gruppe ${escHtml(g)}</div>
        <div class="group-nav-teams">${groupTeams[g].map(t => `<div class="group-nav-team">${escHtml(t)}</div>`).join("")}</div>
      </a>`;
    });
    navHtml += `</div>`;

    let html = navHtml;

    for (const [groupName, items] of Object.entries(groups)) {
      if (items[0].match[4] !== "Group Stage") continue;

      html += `<section class="group-section" id="group-${encodeURIComponent(groupName)}"><h2>Gruppe ${escHtml(groupName)}<a class="group-top-link" href="#" title="Nach oben">↑</a></h2>`;

      items.forEach(({ match, matchIdx }) => {
        const date = new Date(match[1]).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
        const time = match[2];
        const home = teamDE(String(match[5]));
        const away = teamDE(String(match[6]));
        const homeScore = match[7];
        const awayScore = match[8];
        const hasResult = homeScore !== "" && awayScore !== "";
        const resultStr = hasResult ? `${homeScore} – ${awayScore}` : "—";

        const gmCol = groupMatchIndices.indexOf(matchIdx);
        const ptCol = gmCol >= 0 ? gmCol + 1 : -1;

        html += `<div class="match-card mc-collapsed">
          <div class="match-header" onclick="this.closest('.match-card').classList.toggle('mc-collapsed')">
            <span class="match-date">${escHtml(date)} ${escHtml(String(time))}</span>
            <span class="match-teams">${escHtml(home)} <span class="vs">vs</span> ${escHtml(away)}</span>
            <span class="match-result ${hasResult ? "final" : "pending"}">${resultStr}</span>
            <span class="mc-chevron">▾</span>
          </div>`;

        if (players.length && ptCol >= 0) {
          html += `<table class="tips-table"><tbody>`;
          players.forEach((player, pi) => {
            const pts = parseInt(String(pointsMatrix[pi]?.[ptCol] ?? ""), 10);
            const ptClass = pts === 3 ? "exact" : pts === 1 ? "outcome" : hasResult ? "miss" : "no-result";
            const ptLabel = !hasResult ? "–" : isNaN(pts) ? "–" : `${pts} Pkt`;
            const tipRow = tipsMap[String(player)];
            const tipStr = (hasTips && tipRow) ? String(tipRow[ptCol] ?? "") : "";
            html += `<tr>
              <td class="tip-player"><a class="player-link" href="player.html?player=${encodeURIComponent(String(player))}">${escHtml(String(player))}</a></td>
              <td class="tip-str">${escHtml(tipStr)}</td>
              <td class="tip-pts"><span class="${ptClass}">${ptLabel}</span></td>
            </tr>`;
          });
          html += `</tbody></table>`;
        }

        html += `</div>`;
      });

      html += `</section>`;
    }

    container.innerHTML = html || "<p class='empty'>Keine Gruppenspiele gefunden.</p>";
    if (statusEl) statusEl.textContent = `Aktualisiert: ${new Date().toLocaleTimeString("de-DE")}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
}

// ── Spezialtipps (special.html) ───────────────────────────────────────────────

async function renderSpecial() {
  const container = document.getElementById("special-container");
  const statusEl = document.getElementById("status");

  try {
    const [spPtsData, spTipsData, matchData, scorersData] = await Promise.all([
      fetchSheet("Special_Points"),
      fetchSheet("Special_Tips").catch(() => ({ headers: [], rows: [] })),
      fetchSheet("Matches").catch(() => ({ headers: [], rows: [] })),
      fetchSheet("Top_Scorers").catch(() => ({ headers: [], rows: [] })),
    ]);

    if (!spPtsData.rows.length) {
      container.innerHTML = "<p class='empty'>Noch keine Spezialtipps eingetragen.</p>";
      return;
    }

    // Special_Points columns:
    // 0: Spieler, 1: TW pts, 2: TS pts, 3-6: SF (blank), 7: TMGG pts,
    // 8: PMGG pts, 9: TGG guess, 10: TGG pts, 11: Gesamt

    // Special_Tips columns:
    // 0: Spieler, 1: Weltmeister, 2: Torschützenkönig,
    // 3-6: Halbfinalist 1-4, 7: Mannschaft meiste Tore, 8: Spieler meiste Tore, 9: Gesamttore-Tipp

    const tipsMap = {};
    spTipsData.rows.forEach(r => { tipsMap[String(r[0])] = r; });

    const players = spPtsData.rows.map(r => {
      const tips = tipsMap[String(r[0])] || [];
      return {
        name:      String(r[0]),
        tw_pts:    r[1],
        ts_pts:    r[2],
        sf_pts:    r[3],
        tmgg_pts:  r[7],
        pmgg_pts:  r[8],
        tgg_guess: r[9],
        tgg_pts:   r[10],
        total:     r[11],
        // raw tips
        tw_tip:    String(tips[1] ?? ""),
        ts_tip:    String(tips[2] ?? ""),
        sf_tips:   [tips[3], tips[4], tips[5], tips[6]].map(v => String(v ?? "")),
        tmgg_tip:  String(tips[7] ?? ""),
        pmgg_tip:  String(tips[8] ?? ""),
      };
    });

    // Cell: tip value + optional awarded points badge
    const cell = (tip, pts) => {
      const n = parseInt(pts, 10);
      const scored = !isNaN(n) && n > 0;
      return `<td class="sp-cell ${scored ? "scored" : tip ? "miss" : "empty"}">${escHtml(tip || "–")}${scored ? `<em>(${n})</em>` : ""}</td>`;
    };

    const sumPts = (...vals) => vals.reduce((s, v) => { const n = parseInt(v, 10); return s + (isNaN(n) ? 0 : n); }, 0);
    const ptsCell = n => `<td class="sp-cell total">${n}</td>`;

    const buildTable = (headers, rowsFn) => {
      const ths = headers.map(([label, sub]) =>
        `<th>${escHtml(label)}${sub ? `<small>${escHtml(sub)}</small>` : ""}</th>`).join("");
      const rows = players.map(rowsFn).join("");
      return `<div class="sp-outer"><div class="sp-scroll"><table class="special-table">
        <thead><tr><th class="sp-player-hdr">Spieler</th>${ths}<th class="sp-total-hdr">Pkt</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div></div>`;
    };

    const gruppenTable = buildTable(
      [["Mannschaft", "meiste Tore 5P"], ["Spieler", "meiste Tore 5P"], ["Gesamttore", "10/5P"]],
      p => {
        const tggN = parseInt(p.tgg_pts, 10);
        const tggGuess = p.tgg_guess !== "" ? String(p.tgg_guess) : "–";
        return `<tr>
          <td class="sp-player">${escHtml(p.name)}</td>
          ${cell(p.tmgg_tip, p.tmgg_pts)}
          ${cell(p.pmgg_tip, p.pmgg_pts)}
          <td class="sp-cell ${!isNaN(tggN) && tggN > 0 ? "scored" : "miss"}">${escHtml(tggGuess)}${!isNaN(tggN) && tggN > 0 ? `<em>(${tggN})</em>` : ""}</td>
          ${ptsCell(sumPts(p.tmgg_pts, p.pmgg_pts, p.tgg_pts))}
        </tr>`;
      }
    );

    const halbTable = buildTable(
      [["Halbfinalist 1", "5P"], ["Halbfinalist 2", "5P"], ["Halbfinalist 3", "5P"], ["Halbfinalist 4", "5P"]],
      p => {
        const sfN = parseInt(p.sf_pts, 10);
        return `<tr>
          <td class="sp-player">${escHtml(p.name)}</td>
          ${p.sf_tips.map(t => cell(t, "")).join("")}
          ${ptsCell(isNaN(sfN) ? 0 : sfN)}
        </tr>`;
      }
    );

    const finaleTable = buildTable(
      [["Weltmeister", "15P"], ["Torschützenkönig", "10P"]],
      p => `<tr>
        <td class="sp-player">${escHtml(p.name)}</td>
        ${cell(p.tw_tip, p.tw_pts)}
        ${cell(p.ts_tip, p.ts_pts)}
        ${ptsCell(sumPts(p.tw_pts, p.ts_pts))}
      </tr>`
    );

    // ── Team goals (computed from Matches tab) ──────────────────────────────
    const teamGoals = {};
    matchData.rows.forEach(m => {
      if (String(m[4]) !== "Group Stage") return;
      const home = teamDE(String(m[5])), away = teamDE(String(m[6]));
      const hs = parseInt(m[7]), as = parseInt(m[8]);
      if (!isNaN(hs) && hs >= 0) teamGoals[home] = (teamGoals[home] || 0) + hs;
      if (!isNaN(as) && as >= 0) teamGoals[away] = (teamGoals[away] || 0) + as;
    });
    const topTeams = Object.entries(teamGoals)
      .filter(([, g]) => g > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // ── Goals per game stats ─────────────────────────────────────────────────
    let totalGoals = 0, gamesPlayed = 0;
    matchData.rows.forEach(m => {
      if (String(m[4]) !== "Group Stage") return;
      const hs = parseInt(m[7]), as = parseInt(m[8]);
      if (!isNaN(hs) && hs >= 0 && !isNaN(as) && as >= 0) {
        totalGoals += hs + as;
        gamesPlayed++;
      }
    });
    const avgGoals = gamesPlayed > 0 ? totalGoals / gamesPlayed : null;
    const projection = avgGoals !== null ? Math.round(avgGoals * 72) : null;

    const statsBox = gamesPlayed > 0 ? `<div class="sp-mini-table-box sp-stats-box">
      <h3>Tore Vorrunde</h3>
      <div class="sp-stat-row"><span class="sp-stat-label">Ø pro Spiel</span><span class="sp-stat-big">${avgGoals.toFixed(2)}</span></div>
      <div class="sp-stat-row"><span class="sp-stat-label">Gesamt bisher</span><span class="sp-stat-num">${totalGoals} / ${gamesPlayed} Sp.</span></div>
      <div class="sp-stat-row sp-stat-proj"><span class="sp-stat-label">Projektion (72)</span><span class="sp-stat-num">${projection}</span></div>
    </div>` : "";

    // ── Top scorers (from Top_Scorers tab) ──────────────────────────────────
    const topScorers = scorersData.rows
      .filter(r => r[0] && parseInt(r[2]) > 0)
      .slice(0, 10);

    // Shared ranked-list renderer
    const miniTable = (title, items, nameFn, valFn) => {
      if (!items.length) return `<div class="sp-mini-table-box"><h3>${title}</h3><p class="sp-mini-empty">Noch keine Daten</p></div>`;
      let rank = 1, prevVal = null, count = 0;
      const rowsHtml = items.map(item => {
        const v = valFn(item);
        if (v !== prevVal) { rank = count + 1; prevVal = v; }
        count++;
        return `<tr${rank === 1 ? ' class="sp-mini-top"' : ""}><td class="sp-mini-rank">${rank}</td><td>${escHtml(nameFn(item))}</td><td class="sp-mini-val">${v}</td></tr>`;
      }).join("");
      return `<div class="sp-mini-table-box"><h3>${title}</h3><table class="sp-mini-table"><tbody>${rowsHtml}</tbody></table></div>`;
    };

    const sideTables = (statsBox || topScorers.length || topTeams.length) ? `<div class="sp-side-tables">
      ${statsBox}
      ${miniTable("Torschützenliste", topScorers, r => `${r[0]} (${teamDE(String(r[1]))})`, r => parseInt(r[2]))}
      ${miniTable("Torreichste Teams", topTeams, ([name]) => name, ([, g]) => g)}
    </div>` : "";

    const html = `${sideTables}
      <div class="sp-phase-section"><h3 class="sp-phase-heading">Gruppenphase</h3>${gruppenTable}</div>
      <div class="sp-phase-section"><h3 class="sp-phase-heading">Halbfinale</h3>${halbTable}</div>
      <div class="sp-phase-section"><h3 class="sp-phase-heading">Finale</h3>${finaleTable}</div>`;

    container.innerHTML = html;
    if (statusEl) statusEl.textContent = `Aktualisiert: ${new Date().toLocaleTimeString("de-DE")}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
}

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function playerImgSrc(name) {
  const slug = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "_");
  return `img/${slug}.jpg?v=2`;
}

// ── Mitspieler overview (players.html) ────────────────────────────────────────

async function renderPlayers() {
  const container = document.getElementById("players-container");
  const statusEl  = document.getElementById("status");
  try {
    const { rows: lbRows } = await fetchSheet("Leaderboard");
    const players = lbRows.map(r => ({ rank: r[0], name: String(r[1]), total: r[2] }))
      .sort((a, b) => a.name.localeCompare(b.name, "de"));

    let html = `<div class="players-grid">`;
    players.forEach(p => {
      const src = playerImgSrc(p.name);
      html += `<a class="player-tile" href="player.html?player=${encodeURIComponent(p.name)}">
        <img class="player-tile-img" src="${escHtml(src)}" alt="${escHtml(p.name)}"
             onerror="this.onerror=null;this.src='img/placeholder.svg'">
        <div class="player-tile-name">${escHtml(p.name)}</div>
        <div class="player-tile-pts">${p.total} Pkt</div>
      </a>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    if (statusEl) statusEl.textContent = `Aktualisiert: ${new Date().toLocaleTimeString("de-DE")}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
}

// ── Family tree (players.html) ────────────────────────────────────────────────

async function renderFamilyTree() {
  const container = document.getElementById("tree-container");
  const statusEl  = document.getElementById("status");
  try {
    // The tree must render even if the Leaderboard (Google Sheets) is slow or
    // blocked — points are a nice-to-have. Cap its wait so it never blocks.
    const lbPromise = Promise.race([
      fetchSheet("Leaderboard").catch(() => ({ rows: [] })),
      new Promise(res => setTimeout(() => res({ rows: [] }), 4000)),
    ]);
    const [famResp, lb] = await Promise.all([fetch("family.json?t=" + Date.now()), lbPromise]);
    if (!famResp.ok) throw new Error("family.json nicht gefunden");
    const family = await famResp.json();
    const lbRows = lb.rows || [];

    // name → total points from the live Leaderboard
    const pts = {};
    lbRows.forEach(r => { pts[String(r[1])] = r[2]; });

    // Enrich player nodes with avatar + live points; mark them for click-through
    family.forEach(n => {
      n.data = n.data || {};
      if (n.player) {
        if (!n.data.avatar) n.data.avatar = playerImgSrc(n.player);
        const t = pts[n.player];
        n.data.points = (t !== undefined && t !== "") ? `${t} Pkt` : "";
        n.data.player = n.player; // duplicate inside data so the click handler can read it
      }
    });

    container.innerHTML = "";
    drawFamilyGenogram(family, container);
    if (statusEl) statusEl.textContent = `Aktualisiert: ${new Date().toLocaleTimeString("de-DE")}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
}

// Lay out the family as a genogram (couples joined by a hidden "union" node) using
// dagre, then render avatar cards + connector lines into a zoom/pan-able SVG.
function drawFamilyGenogram(family, container) {
  const CW = 104, CH = 150, IMG_H = 122;   // card width / height / avatar height
  const byId = {};
  family.forEach(p => { byId[p.id] = p; p.rels = p.rels || {}; });

  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: "TB", nodesep: 26, ranksep: 34, marginx: 24, marginy: 24 });
  g.setDefaultEdgeLabel(() => ({}));

  family.forEach(p => g.setNode(p.id, { width: CW, height: CH }));

  // Collect unions: one per unique parent-set (from children) and per childless couple.
  const unions = {};
  const keyOf = parents => parents.slice().sort().join("+");
  family.forEach(p => {
    const par = (p.rels.parents || []).filter(Boolean);
    if (par.length) {
      const k = keyOf(par);
      (unions[k] || (unions[k] = { parents: par, children: [] })).children.push(p.id);
    }
  });
  family.forEach(p => (p.rels.spouses || []).forEach(s => {
    const k = keyOf([p.id, s]);
    if (!unions[k]) unions[k] = { parents: [p.id, s], children: [] };
  }));

  let ui = 0;
  Object.values(unions).forEach(u => {
    const uid = "__u" + (ui++);
    g.setNode(uid, { width: 1, height: 1, union: true });
    u.parents.forEach(pid => byId[pid] && g.setEdge(pid, uid, { kind: "marriage" }, pid + uid));
    u.children.forEach(cid => g.setEdge(uid, cid, { kind: "child" }, uid + cid));
  });

  dagre.layout(g);
  const gi = g.graph();
  const W = Math.max(gi.width, 200), H = Math.max(gi.height, 200);

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "genogram-svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  const root = document.createElementNS(NS, "g");
  svg.appendChild(root);

  // Connector lines (draw first so cards sit on top)
  const edgesG = document.createElementNS(NS, "g");
  root.appendChild(edgesG);
  g.edges().forEach(e => {
    const pts = g.edge(e).points;
    if (!pts || !pts.length) return;
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", "geno-link");
    edgesG.appendChild(path);
  });

  // Person cards
  g.nodes().forEach(id => {
    const node = g.node(id);
    if (node.union) return;
    const p = byId[id];
    const x = node.x - CW / 2, y = node.y - CH / 2;
    const isPlayer = !!p.player;
    const name = (p.data && p.data["first name"]) || id;

    const grp = document.createElementNS(NS, "g");
    grp.setAttribute("transform", `translate(${x},${y})`);
    grp.setAttribute("class", "geno-card" + (isPlayer ? " geno-player" : " geno-relative"));

    const fo = document.createElementNS(NS, "foreignObject");
    fo.setAttribute("width", CW);
    fo.setAttribute("height", CH);
    const avatar = isPlayer ? `<img class="geno-img" src="${escHtml(playerImgSrc(p.player))}" alt="" onerror="this.style.visibility='hidden'">`
                            : `<div class="geno-silhouette">${svgPersonIcon()}</div>`;
    const ptsTxt = isPlayer && p.data && p.data.points ? `<div class="geno-pts">${escHtml(p.data.points)}</div>` : "";
    fo.innerHTML =
      `<div xmlns="http://www.w3.org/1999/xhtml" class="geno-card-inner" style="--img-h:${IMG_H}px">
         <div class="geno-img-wrap">${avatar}</div>
         <div class="geno-name">${escHtml(name)}</div>${ptsTxt}
       </div>`;
    grp.appendChild(fo);

    if (isPlayer) {
      grp.style.cursor = "pointer";
      grp.addEventListener("click", () => {
        window.location = "player.html?player=" + encodeURIComponent(p.player);
      });
    }
    root.appendChild(grp);
  });

  container.appendChild(svg);

  // Zoom / pan, fitted to the container
  const zoom = d3.zoom().scaleExtent([0.2, 2.5]).on("zoom", ev => {
    root.setAttribute("transform", ev.transform.toString());
  });
  const sel = d3.select(svg);
  sel.call(zoom);
  const cw = container.clientWidth || W, ch = container.clientHeight || H;
  const scale = Math.min(cw / W, ch / H, 1.4) * 0.95;
  const tx = (cw - W * scale) / 2, ty = (ch - H * scale) / 2;
  sel.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
}

function svgPersonIcon() {
  return `<svg viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm0 48c-96.5 0-288 48.4-288 144v32h576v-32c0-95.6-191.5-144-288-144z"/></svg>`;
}

// ── Player detail page (player.html) ─────────────────────────────────────────

async function renderPlayerDetail() {
  const container = document.getElementById("player-container");
  const statusEl  = document.getElementById("status");
  const playerName = new URLSearchParams(location.search).get("player") || "";

  if (!playerName) {
    container.innerHTML = `<p class="error">Kein Spieler angegeben.</p>`;
    return;
  }

  try {
    const [{ rows: lbRows }, { rows: ptsRows }, { headers: ptsHeaders }, spPtsData, spTipsData, { rows: matchRows }, { rows: tipsRows }] = await Promise.all([
      fetchSheet("Leaderboard"),
      fetchSheet("Points"),
      fetchSheet("Points"),
      fetchSheet("Special_Points").catch(() => ({ rows: [] })),
      fetchSheet("Special_Tips").catch(() => ({ rows: [] })),
      fetchSheet("Matches"),
      fetchSheet("Tips").catch(() => ({ rows: [] })),
    ]);

    // Find this player's data
    const lbRow  = lbRows.find(r => String(r[1]) === playerName);
    const ptsRow = ptsRows.find(r => String(r[0]) === playerName);
    const spPtsRow  = spPtsData.rows.find(r => String(r[0]) === playerName);
    const spTipsRow = spTipsData.rows.find(r => String(r[0]) === playerName);

    const rank    = lbRow ? lbRow[0] : "–";
    const total   = lbRow ? lbRow[2] : 0;
    const matchTotal   = lbRow ? lbRow[3] : 0;
    const specialTotal = lbRow ? lbRow[4] : 0;

    // Count exact / outcome / miss — only for matches that have a result
    const groupMatches = matchRows.filter(m => m[4] === "Group Stage");
    const groupMatchCount = groupMatches.length;
    const hasResult = groupMatches.map(m => m[7] !== "" && m[7] !== null && m[8] !== "" && m[8] !== null);
    const countStats = row => {
      let e = 0, o = 0, ms = 0;
      for (let i = 0; i < groupMatchCount; i++) {
        if (!hasResult[i]) continue;
        const v = parseInt(String(row?.[i + 1] ?? ""), 10);
        if (v === 3) e++; else if (v === 1) o++; else ms++;
      }
      return { exact: e, outcome: o, miss: ms, played: e + o + ms };
    };
    const myStats = countStats(ptsRow);
    const { exact, outcome, miss } = myStats;
    const played = myStats.played;

    // Rank helper: 1 = best; higher value = better rank (desc)
    const rankDesc = (myVal, allVals) => {
      const sorted = [...allVals].filter(v => !isNaN(v)).sort((a, b) => b - a);
      return sorted.findIndex(v => v <= myVal) + 1;
    };

    const allTotal   = lbRows.map(r => Number(r[2]));
    const allMatch   = lbRows.map(r => Number(r[3]));
    const allSpecial = lbRows.map(r => Number(r[4]));
    const allExact   = ptsRows.map(r => countStats(r).exact);
    const allOutcome = ptsRows.map(r => countStats(r).outcome);
    const allHit     = ptsRows.map(r => { const s = countStats(r); return s.played > 0 ? (s.exact + s.outcome) / s.played : NaN; });

    const myHitRate = played > 0 ? (exact + outcome) / played : NaN;
    const rTotal   = rankDesc(total,   allTotal);
    const rMatch   = rankDesc(matchTotal,   allMatch);
    const rSpecial = rankDesc(specialTotal, allSpecial);
    const rExact   = rankDesc(exact,   allExact);
    const rOutcome = rankDesc(outcome, allOutcome);
    const rHit     = isNaN(myHitRate) ? null : rankDesc(myHitRate, allHit);
    const rankTag  = r => `<span class="pd-stat-rank">#${r}</span>`;

    // ── Closeness metrics: Manhattan-Distanz + Pech-Faktor ──────────────────
    // For every played group match, measure how far the tip was from the
    // result in goals (|tipHome−actHome| + |tipAway−actAway|). Independent of
    // the points system, so it surfaces "close but scored nothing" near-misses.
    const tipsByPlayer = {};
    tipsRows.forEach(r => { tipsByPlayer[String(r[0])] = r; });
    const parseScoreStr = s => {
      const mm = String(s ?? "").trim().match(/^(\d{1,2})\s*[-:]\s*(\d{1,2})$/);
      return mm ? [parseInt(mm[1]), parseInt(mm[2])] : null;
    };
    const closenessStats = (ptRow, tipRow) => {
      let distSum = 0, distCount = 0, pech = 0;
      for (let i = 0; i < groupMatchCount; i++) {
        if (!hasResult[i]) continue;
        const tip = parseScoreStr(tipRow?.[i + 1]);
        if (!tip) continue;
        const gm = groupMatches[i];
        const ah = parseInt(String(gm[7]), 10), aa = parseInt(String(gm[8]), 10);
        if (isNaN(ah) || isNaN(aa)) continue;
        const d = Math.abs(tip[0] - ah) + Math.abs(tip[1] - aa);
        distSum += d; distCount++;
        const pts = parseInt(String(ptRow?.[i + 1] ?? ""), 10);
        if (pts === 0 && d <= 1) pech++;
      }
      return { avgDist: distCount > 0 ? distSum / distCount : NaN, pech };
    };
    // Rank helper: 1 = best; lower value = better rank (asc) — for distance
    const rankAsc = (myVal, allVals) => {
      const sorted = [...allVals].filter(v => !isNaN(v)).sort((a, b) => a - b);
      return sorted.findIndex(v => v >= myVal) + 1;
    };
    const myClose  = closenessStats(ptsRow, tipsByPlayer[playerName]);
    const allDist  = ptsRows.map(r => closenessStats(r, tipsByPlayer[String(r[0])]).avgDist);
    const allPech  = ptsRows.map(r => closenessStats(r, tipsByPlayer[String(r[0])]).pech);
    const rDist    = isNaN(myClose.avgDist) ? null : rankAsc(myClose.avgDist, allDist);
    const rPech    = rankDesc(myClose.pech, allPech);

    const src = playerImgSrc(playerName);
    let html = `
      <div class="pd-header">
        <img class="pd-photo" src="${escHtml(src)}" alt="${escHtml(playerName)}"
             onerror="this.onerror=null;this.src='img/placeholder.svg'">
        <div class="pd-info">
          <h1 class="pd-name">${escHtml(playerName)}</h1>
          <div class="pd-rank">Rang ${escHtml(String(rank))}</div>
        </div>
      </div>

      <div class="pd-stats-grid">
        <div class="pd-stat"><span class="pd-stat-val">${total}</span><span class="pd-stat-label">Punkte gesamt</span>${rankTag(rTotal)}</div>
        <div class="pd-stat"><span class="pd-stat-val">${matchTotal}</span><span class="pd-stat-label">Spielpunkte</span>${rankTag(rMatch)}</div>
        <div class="pd-stat"><span class="pd-stat-val">${specialTotal}</span><span class="pd-stat-label">Spezialpunkte</span>${rankTag(rSpecial)}</div>
        <div class="pd-stat"><span class="pd-stat-val">${exact}</span><span class="pd-stat-label">Genaue Tipps</span>${rankTag(rExact)}</div>
        <div class="pd-stat"><span class="pd-stat-val">${outcome}</span><span class="pd-stat-label">Tendenz richtig</span>${rankTag(rOutcome)}</div>
        <div class="pd-stat"><span class="pd-stat-val">${played > 0 ? Math.round(100*(exact+outcome)/played) : "–"}${played > 0 ? "%" : ""}</span><span class="pd-stat-label">Trefferquote <span class="pd-tooltip-wrap">?<span class="pd-tooltip">Anteil der Tipps mit mind. 1 Punkt (genaues Ergebnis oder richtiger Ausgang) an allen gewerteten Spielen.</span></span></span>${rHit ? rankTag(rHit) : ""}</div>
        <div class="pd-stat"><span class="pd-stat-val">${isNaN(myClose.avgDist) ? "–" : myClose.avgDist.toFixed(1).replace(".", ",")}</span><span class="pd-stat-label">Manhattan-Distanz <span class="pd-tooltip-wrap">?<span class="pd-tooltip">Wie weit die Tipps im Schnitt vom echten Ergebnis weg waren — Tor-Abweichung pro Spiel für beide Teams zusammengezählt (Tipp 0:0 bei Ergebnis 1:0 = 1). Kleiner = näher an der Realität, ganz unabhängig von den Punkten.</span></span></span>${rDist ? rankTag(rDist) : ""}</div>
        <div class="pd-stat"><span class="pd-stat-val">${myClose.pech}</span><span class="pd-stat-label">Pech-Faktor <span class="pd-tooltip-wrap">?<span class="pd-tooltip">Spiele, die nur 1 Tor von der Realität entfernt waren, aber trotzdem 0 Punkte brachten — ganz knapp daneben. Höher = mehr Pech gehabt.</span></span></span>${rankTag(rPech)}</div>
      </div>`;

    // Spezialtipps table
    if (spTipsRow) {
      const spLabels = ["Weltmeister (15 Pkt)", "Torschützenkönig (10 Pkt)",
        "Halbfinalist 1 (5 Pkt)", "Halbfinalist 2 (5 Pkt)",
        "Halbfinalist 3 (5 Pkt)", "Halbfinalist 4 (5 Pkt)",
        "Mannschaft meiste Tore in Gruppenphase (5 Pkt)", "Spieler meiste Tore in Gruppenphase (5 Pkt)", "Gesamttore Gruppenphase (10 Pkt)"];
      const spPtsCols = [1, 2, 3, 3, 3, 3, 7, 8, 10]; // indices in Special_Points row
      html += `<h2 class="pd-section-title">Spezialtipps</h2>
        <table class="pd-sp-table"><tbody>`;
      spLabels.forEach((label, i) => {
        const tip = String(spTipsRow[i + 1] || "–");
        const pts = spPtsRow ? parseInt(String(spPtsRow[spPtsCols[i]] ?? ""), 10) : NaN;
        const scored = !isNaN(pts) && pts > 0;
        const ptLabel = scored ? `<em class="scored">(${pts} Pkt)</em>` : "";
        html += `<tr><td class="pd-sp-label">${escHtml(label)}</td><td class="pd-sp-val">${escHtml(tip)} ${ptLabel}</td></tr>`;
      });
      html += `</tbody></table>`;
    }

    // ── Scored match tips box ────────────────────────────────────────────────
    const myTipsRow = tipsRows.find(r => String(r[0]) === playerName);
    const groupMatchIndices2 = [];
    matchRows.forEach((m, i) => { if (m[4] === "Group Stage") groupMatchIndices2.push(i); });

    const scoredTips = [];
    groupMatchIndices2.forEach((matchIdx, offset) => {
      const ptCol = offset + 1;
      const pts = parseInt(String(ptsRow?.[ptCol] ?? ""), 10);
      if (isNaN(pts) || pts <= 0) return;
      const m = matchRows[matchIdx];
      if (m[7] === "" || m[8] === "") return;
      scoredTips.push({
        date: String(m[1]).slice(0, 10),
        home: teamDE(String(m[5])),
        away: teamDE(String(m[6])),
        homeScore: m[7], awayScore: m[8],
        tip: myTipsRow ? String(myTipsRow[ptCol] ?? "") : "",
        pts,
      });
    });
    scoredTips.sort((a, b) => b.date.localeCompare(a.date));

    if (scoredTips.length) {
      html += `<h2 class="pd-section-title" style="margin-top:1.75rem">Gewertete Tipps</h2>
        <div class="pd-scored-box">`;
      scoredTips.forEach(t => {
        const d = new Date(t.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
        const ptClass = t.pts === 3 ? "exact" : "outcome";
        html += `<div class="pd-scored-row">
          <span class="pd-scored-date">${escHtml(d)}</span>
          <span class="pd-scored-match">${escHtml(t.home)} <span class="vs">vs</span> ${escHtml(t.away)}</span>
          <span class="pd-scored-tip"><span class="pd-scored-label">Tipp</span> ${escHtml(t.tip)}</span>
          <span class="pd-scored-result"><span class="pd-scored-label">Erg.</span> ${escHtml(String(t.homeScore))}:${escHtml(String(t.awayScore))}</span>
          <span class="pd-scored-pts ${ptClass}">${t.pts} Pkt</span>
        </div>`;
      });
      html += `</div>`;
    }

    container.innerHTML = html;
    document.title = `${playerName} — WM Tippspiel 2026`;
    if (statusEl) statusEl.textContent = `Aktualisiert: ${new Date().toLocaleTimeString("de-DE")}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
}

function autoRefresh(fn) {
  loadConfig().then(() => {
    fn();
    setInterval(fn, REFRESH_MS);
  });
}
