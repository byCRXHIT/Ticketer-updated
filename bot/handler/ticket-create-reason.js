/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

/* Export */
module.exports = async (interaction, client, dbGuild) => {
  const reason = dbGuild.options[Number(interaction.values[0])].label;
  const waitEmbed = new MessageEmbed()
    .setTitle('> Please wait')
    .setDescription('Your ticket will be created')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  interaction.reply({ embeds: [waitEmbed], ephemeral: true });
  const ticket = await interaction.guild.channels.create(dbGuild.nameprefix.replace('{id}', dbGuild.ticketid), {
    type: 'text',
    permissionOverwrites: [
      { id: interaction.user.id, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'], deny: ['SEND_MESSAGES'] },
      { id: interaction.guild.roles.everyone, deny: ['VIEW_CHANNEL'] },
    ],
  });

  const ticketEmbed = new MessageEmbed()
    .setTitle(`> Ticket ${dbGuild.ticketid}`)
    .setDescription(`Welcome to this ticket. Please describe your issue in detail while a Staff member can handle your ticket.\n\nReason: \`${reason}\`\n\nUser: \`${interaction.user.tag}\``)
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('ticket-claim')
        .setLabel('Claim')
        .setStyle('PRIMARY')
        .setEmoji('977920180711723098'),
      new MessageButton()
        .setCustomId('ticket-transcript')
        .setLabel('Transcript')
        .setStyle('PRIMARY')
        .setEmoji('978041593313501184'),
      new MessageButton()
        .setCustomId('ticket-close')
        .setLabel('Close')
        .setStyle('DANGER')
        .setEmoji('977712715554488391'),
    );

  const message = await ticket.send({
    embeds: [ticketEmbed], ephemeral: false, components: [row], fetchReply: true,
  });

  dbGuild.tickets.push({
    id: dbGuild.ticketid, reason, created: new Date(), channel: ticket.id, creator: interaction.user.id, members: [{ id: interaction.user.id, name: interaction.user.tag }], messages: [], claimed: 'none', state: 'open', message: message.id,
  });

  dbGuild.ticketid += 1;
  dbGuild.save();
};
