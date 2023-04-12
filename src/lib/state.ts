import { writable, type Subscriber, type Writable, type Updater, derived } from 'svelte/store';
import type { Pokemon } from './calc';

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
