const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
  log: (message, client, messageBlank, guild, user, channel, location) => {
    console.log(message);

    if (messageBlank) {
      const consoleEmbed = new MessageEmbed()
        .setTitle('> Console')
        .setColor('BLURPLE')
        .setDescription('```js\n' + String(messageBlank) + '```')
        .setAuthor({
          name: `${client.user.username}`,
          iconURL: client.user.avatarURL(),
        })
        .addField('Guild', '`' + guild + '`')
        .addField('User', '`' + user + '`')
        .addField('Channel', '`' + channel + '`')
        .addField('Location', '`' + location + '`')
        .setTimestamp();

      client.channels.cache.get(`${process.env.CONSOLE}`).send({ embeds: [consoleEmbed] });
    }
  },
};
