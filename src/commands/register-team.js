const { SlashCommandBuilder } = require("discord.js");
const { createTeam, getSignedUpPlayers } = require("../services/tgmrApi");
const { simplifyError } = require("../utils/errorHandler");

function uniq(arr) {
  return [...new Set(arr)];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register-team")
    .setDescription("Register a team (captain is the user running the command).")
    .addStringOption(opt =>
      opt.setName("team_name")
        .setDescription("Team name")
        .setRequired(true)
    )
    .addUserOption(opt =>
      opt.setName("player2")
        .setDescription("Player 2 (must be signed up)")
        .setRequired(true)
    )
    .addUserOption(opt =>
      opt.setName("player3")
        .setDescription("Player 3 (optional)")
        .setRequired(false)
    )
    .addUserOption(opt =>
      opt.setName("player4")
        .setDescription("Player 4 (optional)")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const teamName = interaction.options.getString("team_name", true);
    const captainId = interaction.user.id;

    const p2 = interaction.options.getUser("player2", true)?.id;
    const p3 = interaction.options.getUser("player3", false)?.id;
    const p4 = interaction.options.getUser("player4", false)?.id;

    // Build player list (captain + chosen players)
    const players = uniq([captainId, p2, p3, p4].filter(Boolean));

    // Prevent captain adding themselves redundantly (uniq already handles)
    // Optional: limit size (2-4 players total? You allowed 2-4 including captain)
    if (players.length < 2) {
      return interaction.editReply("❌ You need at least 1 teammate (Player 2).");
    }
    if (players.length > 4) {
      return interaction.editReply("❌ Max team size is 4 players.");
    }

    // Enforce "only signed up players" if possible
    try {
      const signed = await getSignedUpPlayers();
      if (Array.isArray(signed)) {
        const signedIds = new Set(signed.map(x => String(x.discord_id)));
        const notSigned = players.filter(id => !signedIds.has(String(id)));
        if (notSigned.length) {
          return interaction.editReply(
            `❌ These players are not signed up yet:\n${notSigned.map(id => `<@${id}>`).join(", ")}`
          );
        }
      }
    } catch (e) {
      // If GET check fails, we don't block creation; we just inform.
      // (You can flip this to "hard fail" if you prefer.)
      console.warn("Signed-up validation skipped:", e.message);
    }

    try {
      await createTeam({ teamName, players });
      await interaction.editReply(
        `✅ Team registered: **${teamName}**\nPlayers: ${players.map(id => `<@${id}>`).join(", ")}`
      );
    } catch (e) {
      await interaction.editReply(`❌ Team registration failed: ${simplifyError(e)}`);
    }
  }
};