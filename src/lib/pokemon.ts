import { Move, Pokemon as SPokemon, } from "@smogon/calc";
import type { StatsTable, TypeName } from "@smogon/calc/dist/data/interface";

export class Pokemon extends SPokemon {
  moveStates: Move[] = []
  baseStatOverrides: Partial<StatsTable> = {}
  selectedTera?: TypeName
}