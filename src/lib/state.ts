import { writable, type Subscriber, type Writable, type Updater } from 'svelte/store';
import type { Pokemon } from './calc';

export class PokemonState {
	pokemon: Pokemon;
	writable: Writable<Pokemon>;

	constructor(pokemon: Pokemon) {
		this.pokemon = pokemon;
		this.writable = writable(pokemon);
	}

	set(p: Pokemon) {
		return this.writable.set(p);
	}

	update(updater: Updater<Pokemon>) {
		return this.writable.update(updater);
	}

	subscribe(run: Subscriber<Pokemon>, invalidator: (p?: Pokemon) => void) {
		return this.writable.subscribe(run, invalidator);
	}
}

export let selectedPokemon: Writable<PokemonState> = writable();
