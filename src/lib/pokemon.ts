import { Move, Pokemon as SPokemon, } from "$lib/calc";
import type { StatsTable, TypeName } from "$lib/calc/data/interface";

export class Pokemon extends SPokemon {
  moveStates: Move[] = []
  baseStatOverrides: Partial<StatsTable> = {}
  selectedTera?: TypeName
}