import { Embed, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import Command from '../base/Command';

export default new Command(
	new SlashCommandBuilder()
		.setName('scores')
		.setDescription('Affiche le tableau des scores')
		.setDMPermission(false)
		.toJSON()
).setInteraction(async interaction => {
	const { scores } = interaction.client;
	let entries = Object.entries(scores);
	entries.sort((a, b) => b[1] - a[1]);
	let scoreString = '';
	let i = 1;
	for (const [id, score] of entries) {
		scoreString += `**${i++}.** <@${id}> - **${score}** points\n`;
	}
	const embed = new EmbedBuilder()
		.setTitle('Tableau des scores')
		.setColor('#2F3136')
		.setDescription(scoreString);
	interaction.reply({embeds: [embed]});
});