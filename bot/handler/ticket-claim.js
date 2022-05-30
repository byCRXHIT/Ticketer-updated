/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

const Guild = require('../../db/models/guild');

/* Export */
module.exports = (interaction, client, dbGuild) => {
  if (interaction.member.roles.cache.has(dbGuild.settings.staff.role) || dbGuild.settings.staff.members.includes(interaction.user.id)) {
    const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
    if (dbTicket.claimed == 'none') {
      dbTicket.claimed = interaction.user.id;

      Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();

      const claimEmbed = new MessageEmbed()
        .setTitle('> Claim ticket')
        .setDescription(`This ticket has been claimed by ${interaction.user}. He will now help you with your problem.`)
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      const claimMessageEmbed = new MessageEmbed()
        .setTitle(`> Ticket ${dbTicket.id}`)
        .setDescription(`Welcome to this ticket. Please describe your issue in detail while a Staff member can handle your ticket.\n\nReason: \`${dbTicket.reason}\`\n\nStaff: \`${interaction.user.tag}\``)
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
  
      interaction.message.edit({ embeds: [claimMessageEmbed], ephemeral: false });
      interaction.reply({ embeds: [claimEmbed], ephemeral: false });
    } else {
      const claimEmbed = new MessageEmbed()
        .setTitle('> Claim ticket')
        .setDescription(`This ticket is already claimed by <@${client.users.cache.get(dbTicket.claimed).id}>.`)
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [claimEmbed], ephemeral: true });
    }
  } else {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Claim ticket')
      .setDescription('You are not a staff member of this guild.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
};
