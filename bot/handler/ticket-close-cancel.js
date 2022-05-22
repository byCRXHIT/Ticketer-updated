/* Import modules */
const {
  MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');

/* Export */
module.exports = (interaction, client, dbGuild) => {
  interaction.channel.messages.cache.get(interaction.message.id).delete();
};
