const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides you a list default commands'),
  async execute(interaction, client) {
    const helpMessage = `
    <:right:977610957985558628> **/help** \`Shows you this list.\`
    <:right:977610957985558628> **/info** \`General statistics about the bot.\`
    <:right:977610957985558628> **/invite** \`Posts the invite link for the bot\`
    <:right:977610957985558628> **/vote** \`Gives you the vote link for the bot\`
    <:right:977610957985558628> **/dashboard** \`Shows you the dashboard for this guild\`
    `;

    const helpEmbed = new MessageEmbed()
      .setTitle('> Help')
      .setDescription(`Here are some often used commands. Please keep in mind that you can see every command on our Website.\n\n__Commands__${helpMessage}\n\n__Support__\nFeel free to contact us on our Discord Server if you have any questions or suggestions.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel('Invite')
          .setURL('https://discord.gg/fjQyQZ')
          .setStyle('LINK'),
      );

    await interaction.reply({ embeds: [helpEmbed], ephemeral: true, components: [row] });

    const collector = interaction.channel.createMessageComponentCollector({});

    collector.on('collect', (i) => {
      console.log(1);
      i.reply({
        content: 'Test',
        emphermal: true,
      });
    });
  },
};
