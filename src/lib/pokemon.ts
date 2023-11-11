import type { TypeName } from "@pkmn/data";
import { Move, Pokemon as SPokemon } from "@smogon/calc";

export class Pokemon extends SPokemon {
  move_states: Move[] = []
  selectedTera?: TypeName
}