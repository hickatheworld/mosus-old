import { SlashCommandBuilder, Snowflake } from 'discord.js';
import Command from '../base/Command';
import getWord from '../lib/getWord';

export default new Command(
	new SlashCommandBuilder()
		.setName('lancer')
		.setDescription('Lance une nouvelle partie de mosus')
		.setDMPermission(false)
		.toJSON()
).setInteraction(async interaction => {
	const { client } = interaction;
	if (client.save.state !== 'idle')
		return interaction.reply({ content: 'Une partie est déjà en cours!', ephemeral: true });
	await interaction.deferReply();
	let ids = process.env.PLAYERS_IDS!.split(',');
	const susPlayerId = ids[Math.floor(Math.random() * ids.length)];
	const word = await getWord();
	const susPlayer = await interaction.guild!.members.fetch(susPlayerId);
	susPlayer.send(`Salut, c'est toi qui doit placer un mot aujourd'hui. Bon courage!\n\n**Mot à placer**: \`${word}\``);
	const otherPlayers = ids.filter(i => i !== susPlayerId);
	for (const id of otherPlayers) {
		const user = await interaction.guild!.members.fetch(id);
		await user.send('C\'est pas toi qui place aujourd\'hui. Bon courage pour démasquer le sus!');
	}
	client.save = {
		susPlayer: susPlayerId,
		host: interaction.user.id,
		state: 'game',
		word: word
	}
	client.write();
	interaction.editReply(`${process.env.PLAYERS_MENTION} **LA PARTIE EST LANCÉE!**\nÀ vous de jouer! Bon courage...`);
});