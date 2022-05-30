const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Shows you the dashboard for this guild'),
  async execute(interaction, client) {
      const dashboardEmbed = new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(`You can find the dashboard by clicking [here](https://ticketer.developersdungeon.xyz/dashboard/${interaction.guild.id})`)


          const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setLabel('Dashboard')
              .setURL(`https://ticketer.developersdungeon.xyz/dashboard/${interaction.guild.id}`)
              .setStyle('LINK'),
          );

          await interaction.reply({ embeds: [dashboardEmbed], ephemeral: true, components: [row] });
  },
};
