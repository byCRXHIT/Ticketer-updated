/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

/* Export */
module.exports = async (interaction, client, dbGuild) => {
  const createEmbed = new MessageEmbed()
    .setTitle('> Create Ticket')
    .setDescription('Please specify the reason for your ticket.')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  const options = dbGuild.options;

  const input = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('ticket-create-reason')
        .setPlaceholder('Nothing selected')
        .addOptions(options)
        .setMaxValues(1)
        .setMinValues(1),
    );

  interaction.reply({ embeds: [createEmbed], ephemeral: true, components: [input] });
};
