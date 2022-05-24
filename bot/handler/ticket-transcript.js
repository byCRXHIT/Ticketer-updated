/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

const Guild = require('../../db/models/guild');
const { createTranscript } = require('../../functions/bot');

/* Export */
module.exports = (interaction, client, dbGuild) => {
  const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];
  const transcriptEmbed = new MessageEmbed()
    .setTitle('> Ticket transcript')
    .setDescription('This is the transcript of this ticket.')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(`https://ticketer.tk/ticket/${interaction.guild.id}/${dbTicket.channel}?password=${String(interaction.guild.id).substring(0, interaction.guild.id.length / 2)}${String(dbTicket.channel).substring(dbTicket.channel.length / 2, dbTicket.channel.length)}&user=${interaction.user.id}`)
        .setLabel('Download')
        .setStyle('LINK'),
    );

  interaction.reply({
    embeds: [transcriptEmbed],
    ephemeral: true,
    components: [row],
  });
};
