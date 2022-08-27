import { Snowflake } from 'discord.js';
export default interface Save {
	host?: Snowflake;
	placedLink?: string;
	state: 'game' | 'idle' | 'vote';
	susPlayer?: Snowflake;
	votes?: Record<Snowflake, { user: Snowflake, word?: string }>
	word?: string;
}
