import { writable, type Writable } from 'svelte/store';
import type { Pokemon } from './calc';

export type PokemonState = Writable<Pokemon>;

export let selectedPokemon: Writable<PokemonState> = writable();
