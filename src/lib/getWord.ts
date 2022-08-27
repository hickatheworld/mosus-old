import axios from 'axios';
import { JSDOM } from 'jsdom';
export default async function getWord(): Promise<string> {
	const res = await axios.get('https://www.palabrasaleatorias.com/mots-aleatoires.php');
	// English equivalent: https://www.palabrasaleatorias.com/random-words.php
	const dom = new JSDOM(res.data);
	const wordElm = dom.window.document.querySelector('table tbody tr td div') as HTMLDivElement;
	const word = wordElm.innerHTML.trim();
	if (word.includes(' '))
		return getWord();
	return word.toLowerCase();
}