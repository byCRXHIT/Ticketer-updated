const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed, MessageActionRow, MessageButton, Permissions,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resend')
    .setDescription('Provides you a list default commands'),
  async execute(interaction, client) {
    if (interaction.member.permissions.has(Permissions.MANAGE_GUILD)) {
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

      interaction.deferReply();
      interaction.deleteReply();
      interaction.channel.send({ embeds: [helpEmbed], ephemeral: false, components: [row] });
    } else {
      const errorEmbed = new MessageEmbed()
        .setTitle('> Settings')
        .setDescription('You are not a server administrator of this guild.')
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
