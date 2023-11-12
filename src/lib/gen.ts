import { Generation as BaseGen, Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import type {
	Abilities,
	Ability,
	AbilityName,
	Generation,
	GenerationNum,
	ID,
	Items,
	Move,
	MoveCategory,
	MoveName,
	MoveTarget,
	Moves,
	Natures,
	SelfOrSecondaryEffect,
	Specie,
	Species,
	SpeciesName,
	Type,
	TypeEffectiveness,
	TypeName,
	Types
} from '@smogon/calc/dist/data/interface';

// Format for the json data
type AbilityData = { [id: string]: { name: string } };
type MoveData = {
	[id: string]: {
		num: number;
		accuracy: number | boolean;
		basePower: number;
		category: MoveCategory;
		name: string;
		pp: number;
		priority: number;
		critRatio: number;
		type: TypeName;
		target: MoveTarget;
		flags: { [flag: string]: number };

		willCrit?: boolean;
		drain?: [number, number];
		recoil?: [number, number];
		multihit: number | [number, number];
		self?: SelfOrSecondaryEffect;
		secondaries: any;
	};
};
type PokemonData = {
	[id: string]: {
		name: string;
		types: [TypeName] | [TypeName, TypeName];
		baseStats: {
			hp: number;
			atk: number;
			def: number;
			spe: number;
			spa: number;
			spd: number;
		};
		weightkg: number;
		abilities: { 0: AbilityName; 1?: AbilityName; H?: AbilityName };
		evos: any[];
	};
};
type TypeData = {
	[id: string]: {
		name: string;
		effectiveness: { [type in TypeName]?: TypeEffectiveness };
	};
};

class ModAbilities implements Abilities {
	data: AbilityData;
	constructor(data: AbilityData) {
		this.data = data;
	}
	*[Symbol.iterator](): IterableIterator<Ability> {
		for (let key in this.data) {
			yield this.get(key as ID)!;
		}
	}

	get(id: ID) {
		let data = this.data[id];
		if (!data) return;
		return { name: data.name as AbilityName, id, kind: 'Ability' as const };
	}
}

class ModMoves implements Moves {
	data: MoveData;
	constructor(data: MoveData) {
		this.data = data;
	}
	*[Symbol.iterator](): IterableIterator<Move> {
		for (let key in this.data) {
			yield this.get(key as ID)!;
		}
	}

	get(id: ID) {
		let data = this.data[id];
		if (!data) return;
		return { kind: 'Move' as const, id, ...data, name: data.name as MoveName };
	}
}

class ModSpecies implements Species {
	data: PokemonData;
	constructor(data: PokemonData) {
		this.data = data;
	}
	*[Symbol.iterator](): IterableIterator<Specie> {
		for (let key in this.data) {
			yield this.get(key as ID)!;
		}
	}

	get(id: ID) {
		let data = this.data[id];
		if (!data) return;
		return {
			kind: 'Species' as const,
			id,
			...data,
			name: data.name as SpeciesName,
			nfe: data.evos?.length > 0
		};
	}
}

class ModTypes implements Types {
	data: TypeData;
	constructor(data: TypeData) {
		this.data = data;
	}
	*[Symbol.iterator](): IterableIterator<Type> {
		for (let key in this.data) {
			yield this.get(key as ID)!;
		}
	}

	get(id: ID) {
		let data = this.data[id];
		if (!data) return;
		return { kind: 'Type' as const, id, ...data, name: data.name as TypeName };
	}
}

export class ModGen implements Generation {
	baseGen: BaseGen;
	num: GenerationNum;
	items: Items;
	natures: Natures;
	abilities: Abilities;
	moves: Moves;
	species: Species;
	types: Types;

	private constructor(
		num: GenerationNum,
		data: {
			abilityData?: AbilityData;
			moveData?: MoveData;
			pokemonData?: PokemonData;
			typeData?: TypeData;
		}
	) {
		this.num = num;
		this.baseGen = new Generations(Dex).get(num);
		this.items = this.baseGen.items;
		this.natures = this.baseGen.natures;
		this.abilities = this.baseGen.abilities;
		this.moves = this.baseGen.moves;
		this.species = this.baseGen.species;
    this.types = this.baseGen.types;

		if (data?.abilityData) this.abilities = new ModAbilities(data.abilityData);
		if (data?.moveData) this.moves = new ModMoves(data.moveData);
		if (data?.pokemonData) this.species = new ModSpecies(data.pokemonData);
		if (data?.typeData) this.types = new ModTypes(data.typeData);
	}

	static async create(num: GenerationNum, folder: string) {
		let abilityData = await (await fetch(folder + 'abilities.json')).json();
		let moveData = await (await fetch(folder + 'moves.json')).json();
		let pokemonData = await (await fetch(folder + 'pokedex.json')).json();
		let typeData = await (await fetch(folder + 'types.json')).json();
		let gen = new ModGen(num, {abilityData, moveData, pokemonData, typeData});
		return gen;
	}
}
