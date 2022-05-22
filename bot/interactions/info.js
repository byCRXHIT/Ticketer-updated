const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows you informations about the bot.'),
  async execute(interaction, client) {
    const infoMessage = `
    <:right:977610957985558628> **/help** \`Shows you this list.\`
    <:right:977610957985558628> **/info** \`General statistics about the bot.\`
    <:right:977610957985558628> **/invite** \`Posts the invite link for the bot\`
    <:right:977610957985558628> **/vote** \`Gives you the vote link for the bot\`
    <:right:977610957985558628> **/dashboard** \`Shows you the dashboard for this guild\`
    `;

    const infoEmbed = new MessageEmbed()
      .setTitle('> Information')
      .setDescription(`Here are some general informations about the bot\n\n__Commands__${infoMessage}\n\n__Support__\nFeel free to contact us on our Discord Server if you have any questions or suggestions.`)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    interaction.reply({ embeds: [infoEmbed], ephemeral: true });
  },
};
