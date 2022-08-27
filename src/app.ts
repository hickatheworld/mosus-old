import { Client, GatewayIntentBits } from 'discord.js';
import { readdirSync, writeFileSync } from 'fs';
import Command from './base/Command';
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
const commands: Record<string, Command> = {};
const commandFiles = readdirSync('./build/commands');
for (const file of commandFiles) {
	if (!file.endsWith('.js'))
		continue;
	const command = require(`./commands/${file}`).default as Command;
	commands[command.name] = command;
}
try {
	client.save = require('../save.json');
	if (!('state' in client.save))
		throw new Error();
} catch (err) {
	client.save = {
		state: 'idle'
	}
}
try {
	client.scores = require('../scores.json');
} catch (err) {
	client.scores = {};

}
const ids = process.env.PLAYERS_IDS!.split(',');
for (const id of ids) {
	if (!(id in client.scores))
		client.scores[id] = 0;
}
client.write = () => {

	writeFileSync('save.json', JSON.stringify(client.save, null, 4));
	writeFileSync('scores.json', JSON.stringify(client.scores, null, 4));
};
client.write();

client.on('ready', () => {
	console.log(`Logged in as ${client.user!.tag}!`);
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if (!process.env.PLAYERS_IDS!.includes(interaction.user.id))
		return void interaction.reply({ content: 'Non non toi tu joues pas.', ephemeral: true });
	if (interaction.commandName in commands) {
		commands[interaction.commandName].execute(interaction);
	} else {
		console.warn('Received unknown command:', interaction.commandName);
	}
});

client.on('messageCreate', async message => {
	if (client.save.state === 'game' && message.author.id === client.save.susPlayer) {
		if (message.content.toLowerCase().includes(client.save.word!)) {
			client.save.placedLink = message.url;
			client.write();
			message.author.send('Bien joué. J\'espère que t\'as été discret...');
		}
	}
});

client.login(process.env.BOT_TOKEN!);