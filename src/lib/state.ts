import { calculate, Generations, type Field, type Move, type Result, type Side } from '$lib/calc';
import type { Generation, GenerationNum } from '$lib/calc/data/interface';
import { getFinalSpeed } from '$lib/calc/mechanics/util';
import { writable, type Subscriber, type Updater, type Writable } from 'svelte/store';
import type { Pokemon } from './pokemon';
import type { SetList } from './sets/sets';

export class PokemonState {
	pokemon: Pokemon;
	enabled: boolean = true;
	writable: Writable<Pokemon>;

	constructor(pokemon: Pokemon) {
		this.pokemon = pokemon;
		this.writable = writable(pokemon);
	}

	set(p: Pokemon) {
		this.pokemon = p;
		return this.writable.set(p);
	}

	update(updater?: Updater<Pokemon>) {
		let pokemon = updater ? updater(this.pokemon) : this.pokemon
		this.writable.set(pokemon);
	}


	subscribe(run: Subscriber<Pokemon>, invalidator: (p?: Pokemon) => void) {
		return this.writable.subscribe(run, invalidator);
	}
}

export let selectedPokemon: Writable<PokemonState> = writable();
export let openedPair: Writable<[PokemonState, PokemonState] | undefined> = writable(undefined);

type CalcSpeedFunc = (gen: Generation, poke: Pokemon, field: Field, side: Side) => number;

type CalculateFunc = (
	gen: Generation,
	attacker: Pokemon,
	defender: Pokemon,
	move: Move,
	field: Field
) => Result;

type GameEntry = {
	baseGen: GenerationNum;
	sets: string;
	modData?: string;
	calculate?: CalculateFunc;
	calculateSpeed?: CalcSpeedFunc;
};

const GameMap: { [id: string]: GameEntry } = {
	'Scrambled': { baseGen: 9, sets: '/data/baseSets/gen9.json' },
};

export const GameNames = Object.keys(GameMap)

export async function getGame(name: string): Promise<Game> {
	let gameEntry = GameMap[name as keyof typeof GameMap];
	let gen: Generation;
	let spriteOverrides;
	gen = Generations.get(gameEntry.baseGen)

	let setUrl = gameEntry.sets;
	let sets = (await (await fetch(setUrl)).json()) as SetList;

	return {
		gen,
		sets: sets ?? {},
		calculate: gameEntry.calculate ?? calculate,
		calculateSpeed: gameEntry.calculateSpeed ?? getFinalSpeed,
		spriteOverrides: spriteOverrides ?? {}
	};
}

export type Game = {
	gen: Generation;
	sets: SetList;
	calculate: CalculateFunc;
	calculateSpeed: CalcSpeedFunc;
	spriteOverrides: { [id: string]: [string, string] };
	basedOn?: string | undefined;
};

export let currentGame: Writable<Game> = writable({
	gen: Generations.get(9),
	sets: {},
	calculate,
	calculateSpeed: getFinalSpeed,
	spriteOverrides: {}
});
