const { MessageEmbed } = require('discord.js');

module.exports = {
  log: (message, client, messageBlank) => {
    console.log(message);

    if (messageBlank) {
      const consoleEmbed = new MessageEmbed()
        .setTitle('> Console')
        .setColor('BLURPLE')
        .setDescription(messageBlank)
        .setAuthor(client.user.tag, client.user.avatarURL({ dynamic: true }))
        .setTimestamp();

      client.channels.cache.get('984189364655501403').send({ embeds: [consoleEmbed] });
    }
  },
};
