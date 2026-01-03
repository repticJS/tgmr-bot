const { SlashCommandBuilder } = require("discord.js");
const { createPlayer } = require("../services/tgmrApi");
const { simplifyError } = require("../utils/errorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("signup")
    .setDescription("Sign up as an individual player.")
    .addStringOption(opt =>
      opt.setName("minecraft_username")
        .setDescription("Your Minecraft username")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const minecraft_username = interaction.options.getString("minecraft_username", true);

    const body = {
      discord_id: interaction.user.id,
      username: interaction.user.username,
      minecraft_username
    };

    try {
      await createPlayer(body);
      await interaction.editReply(`✅ Signed up!\nMinecraft: **${minecraft_username}**`);
    } catch (e) {
      await interaction.editReply(`❌ Signup failed: ${simplifyError(e)}`);
    }
  }
};