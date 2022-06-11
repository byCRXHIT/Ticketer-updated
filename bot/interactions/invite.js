const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Displays the invite url'),

  async execute(interaction) {
    const inviteembed = new MessageEmbed()

      .setTitle('Invite Ticketer!')
      .setColor('BLURPLE')
      .setDescription(
        `You can invite **Ticketer** by pressing [here](${process.env.INVITE_LINK}) or using the button bellow!`,
      )
      .setTimestamp()
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    const invitebutton = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Invite')
        .setStyle('LINK')
        .setURL(
          `${process.env.INVITE_LINK}`,
        ),
    );

    await interaction.reply({
      embeds: [inviteembed],
      components: [invitebutton],
    });
  },
};
