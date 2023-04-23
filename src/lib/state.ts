import { Generation, Generations, type Data } from '@pkmn/data';
import { ModdedDex, type ModData } from '@pkmn/dex';
import { writable, type Subscriber, type Updater, type Writable } from 'svelte/store';
import type { Field, Move, Pokemon, Result, Side } from './calc';
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

type CalcSpeedFunc = (gen: Generation, poke: Pokemon, field: Field, side: Side) => number;

type CalculateFunc = (
	gen: Generation,
	attacker: Pokemon,
	defender: Pokemon,
	move: Move,
	field: Field
) => Result;

type GameEntry = {
	baseGen: number;
	basedOn?: string;
	sets: string;
	modData?: string;
	calculate?: CalculateFunc;
	calculateSpeed?: CalcSpeedFunc;
};

const GameMap: { [id: string]: GameEntry } = {
	RBY: { baseGen: 1, sets: '/data/baseSets/gen1.json' },
	GSC: { baseGen: 2, sets: '/data/baseSets/gen2.json' },
	ADV: { baseGen: 3, sets: '/data/baseSets/gen3.json' },
	DPP: { baseGen: 4, sets: '/data/baseSets/gen4.json' },
	'B/W': { baseGen: 5, sets: '/data/baseSets/gen5.json' },
	'X/Y': { baseGen: 6, sets: '/data/baseSets/gen6.json' },
	'S/M': { baseGen: 7, sets: '/data/baseSets/gen7.json' },
	'S/S': { baseGen: 8, sets: '/data/baseSets/gen8.json' },
	'S/V': { baseGen: 9, sets: '/data/baseSets/gen9.json' },
	'Sweltering Sun': {
		baseGen: 7,
		basedOn: 'https://github.com/DarkShinyGiratina/Sweltering-Sun-Damage-Calc',
		sets: '/data/swelsun/sets.json',
		modData: '/data/swelsun/mod-data.json',
		calculate: calculateSwelSun,
		calculateSpeed: calculateSpeedSwelSun
	}
};

export const GameNames = Object.keys(GameMap);

function existsOrPast(d: Data) {
	return Generations.DEFAULT_EXISTS(d) || ('isNonstandard' in d && d['isNonstandard'] == 'Past');
}

const BASE_PATH = '/Poke-MultiCalc';
export async function getGame(name: string): Promise<Game> {
	let gameEntry = GameMap[name as keyof typeof GameMap];
	let data;
	if (gameEntry.modData) {
		data = await (await fetch(BASE_PATH + gameEntry.modData)).json();
	}

	let setUrl = BASE_PATH + gameEntry.sets;
	let sets = (await (await fetch(setUrl)).json()) as SetList;

	let dex = new ModdedDex(`gen${gameEntry.baseGen}` as any, data);
	dex.data.Aliases = {};
	let gen = new Generation(dex, existsOrPast);
	return {
		gen,
		sets: sets ?? {},
		basedOn: gameEntry.basedOn,
		calculate: gameEntry.calculate ?? calculate,
		calculateSpeed: gameEntry.calculateSpeed ?? getFinalSpeed
	};
}

export type Game = {
	gen: Generation;
	sets: SetList;
	calculate: CalculateFunc;
	calculateSpeed: CalcSpeedFunc;
	basedOn?: string | undefined;
};
export let currentGame: Writable<Game> = writable({
	gen: new Generation(new ModdedDex('gen9'), existsOrPast),
	sets: {},
	calculate,
	calculateSpeed: getFinalSpeed
});
