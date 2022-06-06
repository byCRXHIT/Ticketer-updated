/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

/* Import files */
const Guild = require('../../db/models/guild');
const { createTranscript } = require('../../functions/bot');

/* Export */
module.exports = (interaction, client, dbGuild) => {
  const dbTicket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == interaction.channel.id)];

  try {
    dbTicket.state = 'closed';
    Guild.findOneAndUpdate({ id: interaction.guild.id }, { tickets: dbGuild.tickets }).catch();
  } catch (e) {}

  try {
    createTranscript(interaction.guild.id, dbTicket);
  } catch(e) {}

  const deleteEmbed = new MessageEmbed()
    .setTitle('> Delete Ticket')
    .setColor("BLURPLE")
    .setDescription('This ticket will be deleted in 10 seconds.')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

  interaction.channel.messages.cache.get(interaction.message.id).delete();
  interaction.channel.send({ embeds: [deleteEmbed], ephemeral: false });
  if(dbGuild.settings.transcript.enabled) {
    const transcriptEmbed = new MessageEmbed()
      .setTitle('> Ticket transcript')
      .setColor("BLURPLE")
      .setDescription('This is the transcript of this ticket.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
  
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL(`https://ticketer.developersdungeon.xyz/ticket/${interaction.guild.id}/${interaction.channel.id}?password=${String(interaction.guild.id).substring(0, interaction.guild.id.length / 2)}${String(interaction.channel.id).substring(interaction.channel.id.length / 2, interaction.channel.id.length)}`)
          .setLabel('Download')
          .setStyle('LINK'),
      );

      interaction.channel.send({
        embeds: [transcriptEmbed],
        ephemeral: false,
        components: [row],
      });
    }

  setTimeout(() => {
    try {
      interaction.channel.delete();
    } catch (e) {
      const errorEmbed = new MessageEmbed()
      .setTitle('Error')
      .setColor("RED")
      .setDescription('I don\'t have permission to delete this channel.')
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
      .setTimestamp();

    return interaction.channel.send({ embeds: [errorEmbed], ephemeral: true });
    }
  }, 10000);
};
