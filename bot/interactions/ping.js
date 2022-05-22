const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong'),
  async execute(interaction, client) {
    interaction.reply({ content: 'pong', ephemeral: true });
  },
};
