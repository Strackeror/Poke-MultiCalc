import { Pokemon } from '$lib/pokemon';
import { Move, toID } from '@smogon/calc';
import type { Generation, TypeName } from '@smogon/calc/dist/data/interface';
import type { PokemonSet, StatsTable } from '@pkmn/dex';

export type LocalSetStats = {
	hp: number;
	at: number;
	df: number;
	sa: number;
	sd: number;
	sp: number;
};
export type LocalSet = {
	level: number;
	moves: string[];
	evs?: Partial<LocalSetStats>;
	ivs?: Partial<LocalSetStats>;
	nature?: string;
	item?: string;
	ability?: string;
};
export type SetList = { [poke: string]: { [set: string]: Partial<LocalSet> } };

export function localSetToPokemonSet(
	species: string,
	localset: Partial<LocalSet>
): Partial<PokemonSet> {
	function statsFromLocalSet(stats: Partial<LocalSetStats>, def: number): StatsTable {
		return {
			hp: stats.hp ?? def,
			atk: stats.at ?? def,
			def: stats.df ?? def,
			spe: stats.sp ?? def,
			spa: stats.sa ?? def,
			spd: stats.sd ?? def
		};
	}

	return {
		species,
		...localset,
		ivs: statsFromLocalSet(localset?.ivs ?? {}, 31),
		evs: statsFromLocalSet(localset?.evs ?? {}, 0)
	};
}

export function pokeToSet(poke: Pokemon): Partial<PokemonSet> {
	return {
		species: poke.species.name,
		nature: poke.nature,
		ability: poke.ability,
		item: poke.item,
		moves: poke.move_states.map((m) => m.name),
		level: poke.level,
		ivs: poke.ivs,
		evs: poke.evs,
		teraType: poke.selectedTera
	};
}

export function setToPoke(gen: Generation, set: Partial<PokemonSet>) {
	if (!set?.species) return;

	if (set.ability && !gen.abilities.get(toID(set.ability))) return;
	if (set.item && !gen.items.get(toID(set.item))) return;
	if (set.nature && !gen.natures.get(toID(set.nature))) return;

	set.moves = set.moves?.filter((m) => gen.moves.get(toID(m)));
	try {
		let poke = new Pokemon(gen, set.species, {
			item: set.item,
			nature: set.nature,
			ability: set.ability,
			level: set.level,
			ivs: set.ivs,
			evs: set.evs
		});
		poke.move_states =
			set.moves?.map(
				(m) => new Move(gen, m, { species: set.species, ability: set.ability, item: set.item })
			) ?? [];
		poke.selectedTera = set.teraType as TypeName;
		return poke;
	} catch (e) {
		return;
	}
}
