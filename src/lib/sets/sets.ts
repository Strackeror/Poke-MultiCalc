import type { PokemonSet, StatsTable } from "@pkmn/dex";

export type LocalSetStats = { hp: number; at: number; df: number; sa: number; sd: number; sp: number };
export type LocalSet = {
	level: number;
	moves: string[];
	evs?: Partial<LocalSetStats>;
	ivs?: Partial<LocalSetStats>;
  nature?: string,
  item?: string,
  ability?: string,
};
export type SetList = { [poke: string]: { [set: string]: Partial<LocalSet> } };

export function localSetToPokemonSet(species: string, localset: Partial<LocalSet>): Partial<PokemonSet> {
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