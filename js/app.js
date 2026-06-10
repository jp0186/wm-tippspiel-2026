const SHEET_ID = window.TIPPSPIEL_SHEET_ID || "";
const REFRESH_MS = 60_000;

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
  "Bosnia and Herzegovina": "Bosnien und Herzegowina",
  "Brazil": "Brasilien",
  "Bulgaria": "Bulgarien",
  "Cameroon": "Kamerun",
  "Canada": "Kanada",
  "Chile": "Chile",
  "China PR": "China",
  "Colombia": "Kolumbien",
  "Congo DR": "DR Kongo",
  "Costa Rica": "Costa Rica",
  "Croatia": "Kroatien",
  "Cuba": "Kuba",
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
  // Google wraps the JSON in a callback: google.visualization.Query.setResponse({...});
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

// ── Rangliste (index.html) ─────────────────────────────────────────────────────

async function renderLeaderboard() {
  const container = document.getElementById("leaderboard-container");
  const statusEl = document.getElementById("status");

  try {
    const { rows } = await fetchSheet("Leaderboard");
    if (!rows.length) {
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

    rows.forEach((row) => {
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
    const [matchData, pointsData] = await Promise.all([
      fetchSheet("Matches"),
      fetchSheet("Points"),
    ]);

    const matches = matchData.rows;
    if (!matches.length) {
      container.innerHTML = "<p class='empty'>Keine Spiele gefunden.</p>";
      return;
    }

    const players = pointsData.rows.map((r) => r[0]);
    const pointsMatrix = pointsData.rows;

    const groups = {};
    matches.forEach((m, i) => {
      const group = m[3] || "Andere";
      if (!groups[group]) groups[group] = [];
      groups[group].push({ match: m, matchIdx: i });
    });

    let html = "";

    for (const [groupName, items] of Object.entries(groups)) {
      const isGroupStage = items[0].match[4] === "Group Stage";
      if (!isGroupStage) continue;

      html += `<section class="group-section">
        <h2>Gruppe ${escHtml(groupName)}</h2>`;

      items.forEach(({ match, matchIdx }) => {
        const date = new Date(match[1]).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
        const time = match[2];
        const home = teamDE(String(match[5]));
        const away = teamDE(String(match[6]));
        const homeScore = match[7];
        const awayScore = match[8];
        const hasResult = homeScore !== "" && awayScore !== "";
        const resultStr = hasResult ? `${homeScore} – ${awayScore}` : "—";

        html += `<div class="match-card">
          <div class="match-header">
            <span class="match-date">${escHtml(date)} ${escHtml(String(time))}</span>
            <span class="match-teams">${escHtml(home)} <span class="vs">vs</span> ${escHtml(away)}</span>
            <span class="match-result ${hasResult ? "final" : "pending"}">${resultStr}</span>
          </div>`;

        if (players.length) {
          html += `<table class="tips-table"><tbody>`;
          players.forEach((player, pi) => {
            const tipRaw = String(pointsMatrix[pi]?.[matchIdx + 1] ?? "");
            const pts = parseInt(tipRaw, 10);
            const ptClass = pts === 3 ? "exact" : pts === 1 ? "outcome" : hasResult ? "miss" : "no-result";
            const ptLabel = !hasResult ? "–" : isNaN(pts) ? "–" : pts;
            html += `<tr>
              <td class="tip-player">${escHtml(String(player))}</td>
              <td class="tip-pts ${ptClass}">${ptLabel}</td>
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

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function autoRefresh(fn) {
  fn();
  setInterval(fn, REFRESH_MS);
}
