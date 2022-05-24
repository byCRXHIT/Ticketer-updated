/* Import modules */
const {
  MessageEmbed,
} = require('discord.js');

/* Import files */
const Guild = require('../../db/models/guild');

/* Export */
module.exports = async (interaction, client, dbGuild) => {
  const value = interaction.getTextInputValue('ticket-members-add-value');
  const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];

  if (!/^[0-9]*$/.test(value) || !interaction.guild.members.cache.get(value)) {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Add user')
      .setDescription('The user you specified was not found.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
  if (dbTicket.members.findIndex((m) => m.id == value) == -1) {
    dbTicket.members.push({ id: interaction.guild.members.cache.get(value).id, name: interaction.guild.members.cache.get(value).tag });

    Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

    Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

    const addEmbed = new MessageEmbed()
      .setTitle('> Add user')
      .setDescription(`The user <@!${value}> has been added to this ticket.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    await interaction.reply({ embeds: [addEmbed], ephemeral: true });
  } else {
    const addEmbed = new MessageEmbed()
      .setTitle('> Add user')
      .setDescription(`The user <@!${value}> is already in this ticket.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    await interaction.reply({ embeds: [addEmbed], ephemeral: true });
  }
};
