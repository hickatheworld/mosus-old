import { CommandInteractionOptionResolver, SlashCommandBuilder } from 'discord.js';
import Command from '../base/Command';

const slash = new SlashCommandBuilder()
	.setName('vote')
	.setDescription('Votez pour qui vous trouver sus, et le mot qu\'il a dû placer.')
	.setDMPermission(false);

slash.addUserOption(option => option
	.setName('sus')
	.setDescription('L\'utilisateur que vous trouvez sus.')
	.setRequired(true)
);
slash.addStringOption(option => option
	.setName('mot')
	.setDescription('Le mot qu\'il a dû placer selon vous.')
	.setRequired(false)
)

export default new Command(slash.toJSON())
	.setInteraction(async interaction => {
		const { client } = interaction;
		if (client.save.state !== 'vote')
			return interaction.reply({ content: 'Trop tôt mon pote. Les votes ne sont pas encore ouverts.', ephemeral: true });
		if (client.save.votes && interaction.user.id in client.save.votes)
			return interaction.reply({ content: 'T\'as déjà voté crétin.', ephemeral: true });
		const user = interaction.options.getUser('sus');
		const word = (interaction.options as CommandInteractionOptionResolver).getString('word') || undefined; // I don't know why the fuck discord.js omits all the shit of the thing. 
		if (user!.id === interaction.user.id)
			return interaction.reply({ content: 'Bah nan mais t\'es con tu vas pas voter pour toi même', ephemeral: true });
		if (!client.save.votes)
			client.save.votes = {};
		client.save.votes[interaction.user.id] = {
			user: user!.id,
			word
		}
		client.write();
		if (interaction.user.id === client.save.susPlayer)
			interaction.reply({ content: 'lol ok si tu le dis.', ephemeral: true });
		else
			interaction.reply({ content: 'Ton vote a bien été enregistré!', ephemeral: true });
		const playerCount = process.env.PLAYERS_IDS!.split(',').length;
		const votesCount = Object.keys(client.save.votes).length;
		const channel = interaction.channel!;
		await channel.send(`${interaction.user.toString()} **a voté!** (${votesCount}/${playerCount})`);
		if (votesCount === playerCount) {
			await channel.send(`${process.env.PLAYERS_MENTION} **Tout le monde a voté!**`);
			const reveal = await channel.send(`${process.env.PLAYERS_MENTION}\n**ET LE SUS ÉTAIT...**`);
			setTimeout(async () => {
				await reveal.edit(`${process.env.PLAYERS_MENTION}\n**ET LE SUS ÉTAIT...** <@${client.save.susPlayer}>! Qui devait placer le mot **\`${client.save.word}\`**`);
				const votes = client.save.votes!;
				let susPoints = playerCount - 1;
				for (const [voter, { user, word }] of Object.entries(votes)) {
					if (voter === client.save.susPlayer)
						continue;
					let points = 0;
					if (user === client.save.susPlayer) {
						points++;
						susPoints--;
					}
					if (word === client.save.word)
						points += 2;
					client.scores[voter] += points;
					await channel.send(`<@${voter}> marque **${points}** points!`);
				}
				client.scores[client.save.susPlayer!] += susPoints;
				await channel.send(`<@${client.save.susPlayer}> marque **${susPoints}** points!`);
				client.save = { state: 'idle' };
				client.write();
			}, 3000);
		}
	});