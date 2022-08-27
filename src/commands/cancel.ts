import { SlashCommandBuilder } from 'discord.js';
import Command from '../base/Command';

export default new Command(
	new SlashCommandBuilder()
		.setName('annuler')
		.setDescription('Annule la partie en cours.')
		.setDMPermission(false)
		.toJSON()
).setInteraction(async interaction => {
	const { client } = interaction;
	if (client.save.state === 'idle')
		return interaction.reply({ content: 'Aucune partie n\'est en cours.', ephemeral: true });
	if (interaction.user.id !== client.save.host)
		return interaction.reply({ content: 'Tu n\'est pas l\'hôte de la partie.', ephemeral: true });
	client.save = { state: 'idle' };
	client.write();
	interaction.reply(`${process.env.PLAYERS_MENTION} **La partie a été annulé!**`);
});