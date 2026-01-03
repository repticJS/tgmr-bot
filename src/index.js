const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { token } = require("./config");
const { loadCommands } = require("./handlers/commandHandler");
const { loadEvents } = require("./handlers/eventHandler");

async function main() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel]
  });

  await loadCommands(client);
  await loadEvents(client);

  await client.login(token);
}

main().catch(console.error);