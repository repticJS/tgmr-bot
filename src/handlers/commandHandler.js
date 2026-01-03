const fs = require("fs");
const path = require("path");

async function loadCommands(client) {
  client.commands = new Map();

  const commandsPath = path.join(__dirname, "..", "commands");
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const command = require(path.join(commandsPath, file));
    if (!command?.data?.name || !command?.execute) continue;

    client.commands.set(command.data.name, command);
  }
}

module.exports = { loadCommands };
