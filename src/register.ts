import { Routes, REST } from 'discord.js';
import { readdirSync } from 'fs';
import Command from './base/Command';
require('dotenv').config();

const commands = [];
const commandFiles = readdirSync('./build/commands');
for (const file of commandFiles) {
	if (!file.endsWith('.js'))
		continue;
	const command = require(`./commands/${file}`).default as Command;
	commands.push(command.options);
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

(async () => {
	// Deletes all commands to get rid of potentially deleted commands from the codebase. 
	await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID!), { body: [] });
	await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID!, process.env.GUILD_ID!), { body: [] });
	await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID!, process.env.GUILD_ID!), { body: commands });
	console.log('Successfully registered commands.');
})();