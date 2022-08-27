import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';

export default class Command {
	callback?: (interaction: CommandInteraction) => void;
	name: string;
	options: RESTPostAPIApplicationCommandsJSONBody;
	constructor(options: RESTPostAPIApplicationCommandsJSONBody) {
		this.name = options.name;
		this.options = options;
	}
	
	setInteraction(callback: typeof this.callback): Command {
		this.callback = callback; 
		return this;
	}

	execute(interaction: CommandInteraction) {
		if (this.callback)
			this.callback(interaction);
		else
			console.warn(`Missing callback for command '${this.name}'`);
	}
}