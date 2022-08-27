import { Client } from 'discord.js'
import Save from './src/types/Save';
import { Scores } from './src/types/Scores';
declare module 'discord.js' {
	interface Client {
		save: Save,
		scores: Scores,
		write: () => void;
	}
}