import { SlashCommandBuilder } from 'discord.js';
import Command from '../base/Command';

export default new Command(
	new SlashCommandBuilder()
		.setName('ouvrir-votes')
		.setDescription('Ouvre la phase de vote de la partie en cours.')
		.setDMPermission(false)
		.toJSON()
).setInteraction(async interaction => {
	const { client } = interaction;
	if (client.save.state === 'idle')
		return interaction.reply({ content: 'Aucune partie en cours.', ephemeral: true });
	if (client.save.state === 'vote')
		return interaction.reply({ content: 'La phase de vote est déjà ouverte.', ephemeral: true });
	if (interaction.user.id !== client.save.host)
		return interaction.reply({ content: 'Tu n\'est pas l\'hôte de la partie en cours.', ephemeral: true });
	if (!client.save.placedLink)
		return interaction.reply({ content: 'Le sus n\'a toujours pas placé son mot.. Quel boloss.', ephemeral: true });
	client.save.state = 'vote';
	client.write();
	interaction.reply(`${process.env.PLAYERS_MENTION} **LES VOTES SOUVENT OUVERTS!** Avez vous grillé le sus..?`);
});