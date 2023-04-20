import { Generation, Generations, type Data } from '@pkmn/data';
import { ModdedDex, type ModData } from '@pkmn/dex';
import { writable, type Subscriber, type Updater, type Writable } from 'svelte/store';
import type { Field, Move, Pokemon, Result, Side } from './calc';
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
import { calculate } from './calc/calc';
import { calculateSpeedSwelSun, calculateSwelSun } from './calc/mechanics/mods/swelsun';
import { getFinalSpeed } from './calc/mechanics/util';

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

type CalcSpeedFunc = (
	gen: Generation,
	poke: Pokemon,
	field: Field,
	side: Side,
) => number;

type CalculateFunc = (
	gen: Generation,
	attacker: Pokemon,
	defender: Pokemon,
	move: Move,
	field: Field
) => Result;

type GameEntry = {
	baseGen: number;
	sets?: SetList | string;
	modData?: string;
	calculate?: CalculateFunc,
	calculateSpeed?: CalcSpeedFunc,
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
	'S/V': { baseGen: 9, sets: SETDEX_SV },
	'Sweltering Sun': {
		baseGen: 7,
		sets: 'data/swelsun/sets.json',
		modData: 'data/swelsun/mod-data.json',
		calculate: calculateSwelSun,
		calculateSpeed: calculateSpeedSwelSun,
	}
};

export const GameNames = Object.keys(GameMap);

function existsOrPast(d: Data) {
	return Generations.DEFAULT_EXISTS(d) || ('isNonstandard' in d && d['isNonstandard'] == 'Past');
}

export async function getGame(name: string): Promise<Game> {
	let gameEntry = GameMap[name as keyof typeof GameMap];
	let data;
	if (gameEntry.modData) {
		data = await (await fetch(gameEntry.modData)).json();
	}

	let sets = gameEntry.sets;
	if (typeof sets == 'string') {
		sets = (await (await fetch(sets)).json()) as SetList;
	}
	let dex = new ModdedDex(`gen${gameEntry.baseGen}` as any, data);
	let gen = new Generation(dex, existsOrPast);
	return {
		gen,
		sets: sets ?? {},
		calculate: gameEntry.calculate ?? calculate,
		calculateSpeed: gameEntry.calculateSpeed ?? getFinalSpeed
	};
}


export type Game = {
	gen: Generation;
	sets: SetList;
	calculate: CalculateFunc
	calculateSpeed: CalcSpeedFunc
};
export let currentGame: Writable<Game> = writable(await getGame("S/V"));
