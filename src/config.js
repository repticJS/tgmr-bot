require("dotenv").config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,

  apiBaseUrl: process.env.API_BASE_URL || "https://api.dev.rsc-community.com",
  apiKey: process.env.API_KEY || ""
};