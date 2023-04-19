import { Generation, Generations, type Data } from '@pkmn/data';
import { Dex, ModdedDex, type ModData } from '@pkmn/dex';
import { derived, writable, type Subscriber, type Updater, type Writable } from 'svelte/store';
import type { Pokemon } from './calc';
import { SETDEX_RBY } from './sets/gen1';
import { SETDEX_GSC } from './sets/gen2';
import { SETDEX_ADV } from './sets/gen3';
import { SETDEX_DPP } from './sets/gen4';
import { SETDEX_BW } from './sets/gen5';
import { SETDEX_XY } from './sets/gen6';
import { SETDEX_SM } from './sets/gen7';
import { SETDEX_SS } from './sets/gen8';
import { SETDEX_SV } from './sets/gen9';
import type { SetList } from './sets/sets';

export class PokemonState {
	pokemon: Pokemon;
	writable: Writable<Pokemon>;

	constructor(pokemon: Pokemon) {
		this.pokemon = pokemon;
		this.writable = writable(pokemon);
	}

	set(p: Pokemon) {
		this.pokemon = p;
		return this.writable.set(p);
	}

	update(updater: Updater<Pokemon>) {
		this.writable.set(updater(this.pokemon));
	}

	subscribe(run: Subscriber<Pokemon>, invalidator: (p?: Pokemon) => void) {
		return this.writable.subscribe(run, invalidator);
	}
}

export let selectedPokemon: Writable<PokemonState> = writable();

type GameEntry = {
	baseGen: number;
	sets?: SetList;
	modData?: ModData;
};

const GameMap: { [id: string]: GameEntry } = {
	RBY: { baseGen: 1, sets: SETDEX_RBY },
	GSC: { baseGen: 2, sets: SETDEX_GSC },
	ADV: { baseGen: 3, sets: SETDEX_ADV },
	DPP: { baseGen: 4, sets: SETDEX_DPP },
	'B/W': { baseGen: 5, sets: SETDEX_BW },
	'X/Y': { baseGen: 6, sets: SETDEX_XY },
	'S/M': { baseGen: 7, sets: SETDEX_SM },
	'S/S': { baseGen: 8, sets: SETDEX_SS },
	'S/V': { baseGen: 9, sets: SETDEX_SV }
};

export const GameNames = Object.keys(GameMap);

function existsOrPast(d: Data) {
	return Generations.DEFAULT_EXISTS(d) || ('isNonstandard' in d && d['isNonstandard'] == 'Past');
}

export function getGame(name: string): Game {
	let gameEntry = GameMap[name as keyof typeof GameMap];
	let dex = new ModdedDex(`gen${gameEntry.baseGen}` as any, gameEntry.modData);
	let gen = new Generation(dex, existsOrPast);
	return {
		gen,
		sets: gameEntry.sets ?? {}
	};
}

export type Game = {
	gen: Generation;
	sets: SetList;
};
export let currentGame: Writable<Game> = writable();
