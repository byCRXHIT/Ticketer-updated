/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

/* Export */
module.exports = (interaction, client, dbGuild) => {
  const deleteEmbed = new MessageEmbed()
    .setTitle('> Delete Ticket')
    .setDescription('This ticket will be deleted in 5 seconds.')
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });
  interaction.channel.messages.cache.get(interaction.message.id).delete();
  interaction.channel.send({ embeds: [deleteEmbed], ephemeral: false });

  setTimeout(() => {
    interaction.channel.delete();
  }, 5000);
};
