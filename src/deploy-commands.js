const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { clientId, guildId, token } = require("./config");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of files) {
  const command = require(path.join(commandsPath, file));
  if (command?.data) commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(`🚀 Deploying ${commands.length} commands...`);
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log("✅ Deployed!");
  } catch (err) {
    console.error(err);
  }
})();