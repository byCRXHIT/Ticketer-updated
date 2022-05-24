/* Import modules */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ChalkAdvanced } = require('chalk-advanced');

/* Import files */
const { developer } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Shutdowns the bot'),
  async execute(interaction, client) {
    if (developer.includes(interaction.user.id)) {
      const embed = new MessageEmbed()
        .setTitle('> Shutdown')
        .setDescription('Shutting down...')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [embed], ephemeral: true });
      client.destroy();
      console.log(ChalkAdvanced.bgBlack(ChalkAdvanced.white(` [SYS] Shutting down (${interaction.user.tag} ${interaction.user.id}) `)));
      setTimeout(() => {
        process.exit();
      }, 1000);
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Shutdown')
        .setDescription('You are not a developer of this bot.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
