const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resend')
    .setDescription('Provides you a list default commands'),
  async execute(interaction, client) {
    const helpEmbed = new MessageEmbed()
      .setTitle('> Ticket')
      .setDescription('To create a ticket please use the buttons below.')
      .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL({ dynamic: true }) });

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('ticket-create')
          .setDisabled(false)
          .setEmoji('🎫')
          .setStyle('SUCCESS'),
      );

    interaction.deleteReply();
    interaction.channel.send({ embeds: [helpEmbed], ephemeral: false, components: [row] });
  },
};
