// Reads sheet ID from URL param ?sid=... or falls back to SHEET_ID constant.
// Set SHEET_ID to your spreadsheet ID after running setup.py.
const SHEET_ID = window.TIPPSPIEL_SHEET_ID || "";
const REFRESH_MS = 60_000;

function getSheetId() {
  const params = new URLSearchParams(location.search);
  return params.get("sid") || SHEET_ID;
}

async function fetchSheet(sheetName) {
  const sid = getSheetId();
  if (!sid) throw new Error("No spreadsheet ID configured.");
  const url =
    `https://docs.google.com/spreadsheets/d/${sid}/gviz/tq` +
    `?sheet=${encodeURIComponent(sheetName)}&tqx=out:json`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching sheet "${sheetName}"`);
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

// ── leaderboard.html ───────────────────────────────────────────────────────────

async function renderLeaderboard() {
  const container = document.getElementById("leaderboard-container");
  const statusEl = document.getElementById("status");

  try {
    const { headers, rows } = await fetchSheet("Leaderboard");
    if (!rows.length) {
      container.innerHTML = "<p class='empty'>Noch keine Punkte / No points yet.</p>";
      return;
    }

    // Detect medal ranks
    const topScore = rows[0]?.[2] ?? 0;

    let html = `<table class="leaderboard-table">
      <thead><tr>
        <th>#</th>
        <th>Spieler / Player</th>
        <th>Gesamt / Total</th>
        <th>Spiele / Matches</th>
        <th>Spezialtipps / Special</th>
      </tr></thead><tbody>`;

    rows.forEach((row) => {
      const rank = row[0];
      const name = row[1];
      const total = row[2];
      const matchPts = row[3];
      const specialPts = row[4];
      const medal =
        rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
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
    if (statusEl) statusEl.textContent = `Aktualisiert / Updated: ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler / Error: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
}

// ── results.html ──────────────────────────────────────────────────────────────

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
      container.innerHTML = "<p class='empty'>Keine Spiele / No matches.</p>";
      return;
    }

    // Points tab: row[0] = player name, row[1..N] = match points
    const players = pointsData.rows.map((r) => r[0]);
    const pointsMatrix = pointsData.rows; // pointsMatrix[playerIdx][matchIdx+1]

    // Group matches by group
    const groups = {};
    matches.forEach((m, i) => {
      const group = m[3] || "Other"; // col index 3 = group
      if (!groups[group]) groups[group] = [];
      groups[group].push({ match: m, matchIdx: i });
    });

    let html = "";

    for (const [groupName, items] of Object.entries(groups)) {
      const isGroupStage = items[0].match[4] === "Group Stage"; // col 4 = stage
      if (!isGroupStage) continue;

      html += `<section class="group-section">
        <h2>Gruppe ${escHtml(groupName)} / Group ${escHtml(groupName)}</h2>`;

      items.forEach(({ match, matchIdx }) => {
        const date = match[1];
        const time = match[2];
        const home = match[5];
        const away = match[6];
        const homeScore = match[7];
        const awayScore = match[8];
        const hasResult = homeScore !== "" && awayScore !== "";
        const resultStr = hasResult ? `${homeScore} – ${awayScore}` : "—";

        html += `<div class="match-card">
          <div class="match-header">
            <span class="match-date">${escHtml(String(date))} ${escHtml(String(time))}</span>
            <span class="match-teams">${escHtml(String(home))} <span class="vs">vs</span> ${escHtml(String(away))}</span>
            <span class="match-result ${hasResult ? "final" : "pending"}">${resultStr}</span>
          </div>`;

        if (players.length) {
          html += `<table class="tips-table"><tbody>`;
          players.forEach((player, pi) => {
            const tipRaw = String(pointsMatrix[pi]?.[matchIdx + 1] ?? "");
            // pointsMatrix stores points (0/1/3), not the raw tip.
            // We'll show the points with a color class.
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

    container.innerHTML = html || "<p class='empty'>Keine Gruppenspiele / No group matches.</p>";
    if (statusEl) statusEl.textContent = `Aktualisiert / Updated: ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    container.innerHTML = `<p class="error">Fehler / Error: ${escHtml(e.message)}</p>`;
    console.error(e);
  }
}

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Auto-refresh
function autoRefresh(fn) {
  fn();
  setInterval(fn, REFRESH_MS);
}
