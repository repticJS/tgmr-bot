const { apiBaseUrl, apiKey } = require("../config");

function headers() {
  const h = { "Content-Type": "application/json" };
  if (apiKey) h["Authorization"] = `Bearer ${apiKey}`;
  return h;
}

async function postJson(path, body) {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body)
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = typeof data === "string" ? data : (data?.message || "API error");
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  return data;
}

/**
 * NOTE:
 * You only provided POST endpoints. If you add a GET like:
 *   GET /v2/TGMR/players
 * or
 *   GET /v2/TGMR/players?discord_id=...
 * wire it here so /register-team can truly enforce "only signed up players".
 */
async function getSignedUpPlayers() {
  // return fetch(`${apiBaseUrl}/v2/TGMR/players`, { headers: headers() }).then(r => r.json());

  // Fallback: no way to verify via API, so return null (means "skip enforcement").
  return null;
}

async function createPlayer({ discord_id, username, minecraft_username }) {
  return postJson("/v2/TGMR/players", { discord_id, username, minecraft_username });
}

async function createTeam({ teamName, players, logo = null }) {
  // Your API body doesn't include logo, but you said optional logo.
  // If your API supports it, keep it. If not, remove it.
  const payload = logo ? { teamName, players, logo } : { teamName, players };
  return postJson("/v2/TGMR/teams", payload);
}

module.exports = {
  createPlayer,
  createTeam,
  getSignedUpPlayers
};