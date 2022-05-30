/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

const Guild = require('../../db/models/guild');

/* Export */
module.exports = async (interaction, client, dbGuild) => {
  if(interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
  const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channelId)];

  if (dbTicket.state == 'open') {
    dbTicket.members.forEach(async (member) => {
      let permissions = { VIEW_CHANNEL: true, SEND_MESSAGES: false };
      const user = await interaction.guild.members.fetch(member.id);
      if (interaction.member.roles.cache.has(dbGuild.settings.staff.role)) permissions = { VIEW_CHANNEL: true, SEND_MESSAGES: true };
      interaction.channel.permissionOverwrites.edit(user.user.id, permissions);
    });

    dbTicket.state = 'stopped';

    Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

    const sucEmbed = new MessageEmbed()
      .setTitle('> Lock ticket')
      .setDescription('This ticket has been locked.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    await interaction.reply({ embeds: [sucEmbed], ephemeral: false });
  } else if (dbTicket.state == 'stopped') {
    dbTicket.members.forEach(async (member) => {
      const user = await interaction.guild.members.fetch(member.id);
      interaction.channel.permissionOverwrites.edit(user.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
    });

    dbTicket.state = 'open';

    Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

    const sucEmbed = new MessageEmbed()
      .setTitle('> Unlock ticket')
      .setDescription('This ticket has been unlocked.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    await interaction.reply({ embeds: [sucEmbed], ephemeral: false });
  } else {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Lock ticket')
      .setDescription('This ticket ist not open nor closed. Is a deleting process running?')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
  } else {
    const errorEmbed = new MessageEmbed()
    .setTitle('> Lock ticket')
    .setDescription('You are not allowed to do lock/unlock tickets.')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
};
