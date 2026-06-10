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
    r.c.map((cell) => (cell && cell.v != null ? cell.v : ""))
  );
  return { headers, rows };
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
    let html = `<div class="upcoming-section"><h3>Heutige Spiele</h3><div class="upcoming-list">`;
    for (const m of todayMatches) {
      const home = teamDE(String(m[5]));
      const away = teamDE(String(m[6]));
      const time = String(m[2]);
      const hasResult = m[7] !== "" && m[8] !== "";
      const resultStr = hasResult ? `${m[7]} – ${m[8]}` : time + " Uhr";
      html += `<div class="upcoming-match">
        <span class="upcoming-teams">${escHtml(home)} <span class="vs">vs</span> ${escHtml(away)}</span>
        <span class="upcoming-time ${hasResult ? 'final' : ''}">${escHtml(resultStr)}</span>
      </div>`;
    }
    html += `</div></div>`;
    container.innerHTML = html;
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

// ── Rangliste / Homepage (index.html) ─────────────────────────────────────────

async function renderLeaderboard() {
  const container = document.getElementById("leaderboard-container");
  const upcomingContainer = document.getElementById("upcoming-container");
  const statusEl = document.getElementById("status");

  try {
    const [{ rows: lbRows }, { rows: matchRows }] = await Promise.all([
      fetchSheet("Leaderboard"),
      fetchSheet("Matches"),
    ]);

    if (upcomingContainer && matchRows.length) {
      renderUpcoming(matchRows, upcomingContainer);
    }

    if (!lbRows.length) {
      container.innerHTML = "<p class='empty'>Noch keine Punkte eingetragen.</p>";
      return;
    }

    let html = `<table class="leaderboard-table">
      <thead><tr>
        <th>#</th>
        <th>Spieler</th>
        <th>Gesamt</th>
        <th>Spiele</th>
        <th>Spezialtipps</th>
      </tr></thead><tbody>`;

    lbRows.forEach((row) => {
      const rank = row[0];
      const name = row[1];
      const total = row[2];
      const matchPts = row[3];
      const specialPts = row[4];
      const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
      const rowClass = rank <= 3 ? `rank-${rank}` : "";
      html += `<tr class="${rowClass}">
        <td class="rank-cell">${medal || rank}</td>
        <td class="name-cell">${escHtml(String(name))}</td>
        <td class="pts-cell total">${total}</td>
        <td class="pts-cell">${matchPts}</td>
        <td class="pts-cell">${specialPts}</td>
      </tr>`;
    });

    html += "</tbody></table>";
    container.innerHTML = html;
    if (statusEl) statusEl.textContent = `Aktualisiert: ${new Date().toLocaleTimeString("de-DE")}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
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

    let html = "";

    for (const [groupName, items] of Object.entries(groups)) {
      if (items[0].match[4] !== "Group Stage") continue;

      html += `<section class="group-section"><h2>Gruppe ${escHtml(groupName)}</h2>`;

      items.forEach(({ match, matchIdx }) => {
        const date = new Date(match[1]).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
        const time = match[2];
        const home = teamDE(String(match[5]));
        const away = teamDE(String(match[6]));
        const homeScore = match[7];
        const awayScore = match[8];
        const hasResult = homeScore !== "" && awayScore !== "";
        const resultStr = hasResult ? `${homeScore} – ${awayScore}` : "—";

        // Column index in Points/Tips tabs for this match
        const gmCol = groupMatchIndices.indexOf(matchIdx);
        const ptCol = gmCol >= 0 ? gmCol + 1 : -1;

        html += `<div class="match-card">
          <div class="match-header">
            <span class="match-date">${escHtml(date)} ${escHtml(String(time))}</span>
            <span class="match-teams">${escHtml(home)} <span class="vs">vs</span> ${escHtml(away)}</span>
            <span class="match-result ${hasResult ? "final" : "pending"}">${resultStr}</span>
          </div>`;

        if (players.length && ptCol >= 0) {
          html += `<table class="tips-table"><tbody>`;
          players.forEach((player, pi) => {
            const pts = parseInt(String(pointsMatrix[pi]?.[ptCol] ?? ""), 10);
            const ptClass = pts === 3 ? "exact" : pts === 1 ? "outcome" : hasResult ? "miss" : "no-result";
            const ptLabel = !hasResult ? "–" : isNaN(pts) ? "–" : `${pts} Pkt`;
            const tipRow = tipsMap[String(player)];
            const tipStr = (hasTips && tipRow) ? String(tipRow[ptCol] ?? "") : "";
            const tipLabel = tipStr ? `${escHtml(tipStr)} · ${ptLabel}` : ptLabel;
            html += `<tr>
              <td class="tip-player">${escHtml(String(player))}</td>
              <td class="tip-pts ${ptClass}">${tipLabel}</td>
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
    const [spPtsData, spTipsData] = await Promise.all([
      fetchSheet("Special_Points"),
      fetchSheet("Special_Tips").catch(() => ({ headers: [], rows: [] })),
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

    const playerHeader = players.map(p => `<th>${escHtml(p.name)}</th>`).join("");

    // Cell showing tip text + optional awarded points
    const tipCell = (tip, pts) => {
      const n = parseInt(pts, 10);
      const hasPoints = !isNaN(n) && n > 0;
      const cls = hasPoints ? "scored" : (tip ? "miss" : "miss");
      const tipDisplay = tip || "–";
      return `<td class="sp-pts ${cls}">${escHtml(tipDisplay)}${hasPoints ? ` <em>(${n})</em>` : ""}</td>`;
    };

    // Row for semi-finalists: show all 4 picks stacked in one cell per player
    const sfRow = () => {
      const cells = players.map(p => {
        const n = parseInt(p.sf_pts, 10);
        const hasPoints = !isNaN(n) && n > 0;
        const cls = hasPoints ? "scored" : "miss";
        const picks = p.sf_tips.filter(t => t).join(" · ") || "–";
        return `<td class="sp-pts ${cls}">${escHtml(picks)}${hasPoints ? ` <em>(${n})</em>` : ""}</td>`;
      }).join("");
      return `<tr><td class="sp-label">Halbfinalisten (je 5 Pkt)</td>${cells}</tr>`;
    };

    // Total goals row: show guess + points
    const tggRow = () => {
      const cells = players.map(p => {
        const guess = p.tgg_guess !== "" ? p.tgg_guess : "–";
        const n = parseInt(p.tgg_pts, 10);
        const hasPoints = !isNaN(n) && n > 0;
        const cls = hasPoints ? "scored" : "miss";
        return `<td class="sp-pts ${cls}">${escHtml(String(guess))}${hasPoints ? ` <em>(${n})</em>` : ""}</td>`;
      }).join("");
      return `<tr><td class="sp-label">Gesamttore Gruppenphase (10/5 Pkt)</td>${cells}</tr>`;
    };

    const simpleRow = (label, tipFn, ptsFn) => {
      const cells = players.map(p => tipCell(tipFn(p), ptsFn(p))).join("");
      return `<tr><td class="sp-label">${label}</td>${cells}</tr>`;
    };

    const html = `
    <div class="special-phase">
      <h3>Nach der Gruppenphase</h3>
      <table class="special-table">
        <thead><tr><th>Tipp</th>${playerHeader}</tr></thead>
        <tbody>
          ${simpleRow("Mannschaft — meiste Tore (5 Pkt)", p => p.tmgg_tip, p => p.tmgg_pts)}
          ${simpleRow("Spieler — meiste Tore (5 Pkt)",   p => p.pmgg_tip, p => p.pmgg_pts)}
          ${tggRow()}
        </tbody>
      </table>
    </div>

    <div class="special-phase">
      <h3>Nach dem Halbfinale</h3>
      <table class="special-table">
        <thead><tr><th>Tipp</th>${playerHeader}</tr></thead>
        <tbody>${sfRow()}</tbody>
      </table>
    </div>

    <div class="special-phase">
      <h3>Nach dem Finale</h3>
      <table class="special-table">
        <thead><tr><th>Tipp</th>${playerHeader}</tr></thead>
        <tbody>
          ${simpleRow("Weltmeister (15 Pkt)",            p => p.tw_tip, p => p.tw_pts)}
          ${simpleRow("Torschützenkönig gesamt (10 Pkt)", p => p.ts_tip, p => p.ts_pts)}
          <tr class="total-special">
            <td class="sp-label"><strong>Spezialpunkte gesamt</strong></td>
            ${players.map(p => `<td class="sp-pts total">${p.total !== "" ? p.total : 0}</td>`).join("")}
          </tr>
        </tbody>
      </table>
    </div>`;

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

function autoRefresh(fn) {
  loadConfig().then(() => {
    fn();
    setInterval(fn, REFRESH_MS);
  });
}
