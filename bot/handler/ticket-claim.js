/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

/* Export */
module.exports = (interaction, client, dbGuild) => {
  if (interaction.member.roles.cache.has(dbGuild.staff_role)) {
    const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
    dbTicket.claimed = interaction.user.id;
    dbGuild.save();

    const claimEmbed = new MessageEmbed()
      .setTitle('> Claim ticket')
      .setDescription(`This ticket has been claimed by ${interaction.user}. He will now help you with your problem.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    interaction.reply({ embeds: [claimEmbed], ephemeral: false });
  } else {
    const errorEmbed = new MessageEmbed()
      .setTitle('> Claim ticket')
      .setDescription('You are not a staff member of this guild.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
};
