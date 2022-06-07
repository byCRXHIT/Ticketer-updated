/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, TextInputComponent, Permissions,
} = require('discord.js');

/* Export */
module.exports = async (interaction, client, dbGuild) => {
  const reason = dbGuild.options[Number(interaction.values[0])].label;
  const waitEmbed = new MessageEmbed()
    .setTitle('> Please wait')
    .setColor('BLURPLE')
    .setDescription('Your ticket will be created')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  let permissions = [
    { id: client.user.id, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'], deny: [] },
    { id: interaction.member.id, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'], deny: [] },
    { id: interaction.guild.roles.everyone, deny: ['VIEW_CHANNEL'] },
  ];

  if (dbGuild.options[Number(interaction.values[0])].permissions !== 'none') {
    permissions.push({
      id: dbGuild.options[Number(interaction.values[0])].permissions,
      allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
      deny: [],
    });
  } else {
    if (dbGuild.settings.staff.role !== 'none') {
      permissions.push({
        id: dbGuild.settings.staff.role,
        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
        deny: [],
      });
    }

    dbGuild.settings.staff.members.forEach((staff) => {
      permissions.push({
        id: staff,
        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
        deny: [],
      });
    });
  }

  if (dbGuild.settings.staff.role !== 'none') {
    permissions.push({
      id: dbGuild.settings.staff.role,
      allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
      deny: [],
    });
  }

  try {
    interaction.reply({ embeds: [waitEmbed], ephemeral: true });
  } catch (e) {
    return;
  }

  setTimeout(async () => {
    let ticket;
    if (!interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) {
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('I don\'t have permission to create a channel')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTimestamp();

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      ticket = await interaction.guild.channels.create(dbGuild.settings.nameprefix.replace('{id}', dbGuild.ticketid), {
        type: 'text',
        permissionOverwrites: permissions,
        parent: dbGuild.settings.category,
      });
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('I don\'t have permission to create a channel')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTimestamp();

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (!ticket) {
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('An unknown error occurred while creating the ticket.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTimestamp();

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      ticket.permissionOverwrites.set(permissions);
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('I don\'t have permission to change channel permissions.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTimestamp();

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await ticket.setParent(dbGuild.settings.category);
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setColor('RED')
        .setDescription('I don\'t have permission to set the parent of this channel.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTimestamp();

      return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    const ticketEmbed = new MessageEmbed()
      .setTitle(`> Ticket ${dbGuild.ticketid}`)
      .setColor('BLURPLE')
      .setDescription(`Welcome to this ticket. Please describe your issue in detail while a Staff member can handle your ticket.\n\nReason: \`${reason}\``)
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
          .setCustomId('ticket-members')
          .setLabel('Add user')
          .setStyle('PRIMARY')
          .setEmoji('978747421892968538'),
        new MessageButton()
          .setCustomId('ticket-lock')
          .setLabel('Lock/Unlock')
          .setStyle('DANGER')
          .setEmoji('979002078154358784'),
        new MessageButton()
          .setCustomId('ticket-close')
          .setLabel('Close')
          .setStyle('DANGER')
          .setEmoji('977712715554488391'),
      );

    const message = await ticket.send({
      embeds: [ticketEmbed], ephemeral: false, components: [row],
    });

    dbGuild.tickets.push({
      id: dbGuild.ticketid, reason, created: new Date(), channel: ticket.id, creator: interaction.user.id, members: [{ id: interaction.user.id, name: interaction.user.tag }], messages: [], claimed: 'none', state: 'open', message: message.id,
    });

    const successEmbed = new MessageEmbed()
      .setTitle('> Ticket created')
      .setColor('BLURPLE')
      .setDescription(`The ticket ${ticket} was successfully created! If you cant see it contact your server Admin.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    try {
      interaction.editReply({ embeds: [successEmbed], ephemeral: true });
    } catch (e) {}

    dbGuild.ticketid += 1;
    dbGuild.save();
  }, 500);
};
