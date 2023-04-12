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

export function deriveField<T, U>(
	store: Writable<T>,
	fieldGet: (source: T) => U,
	fieldSet: (source: T, field: U) => T
): Writable<U> {
	const { subscribe } = derived(store, fieldGet);
	return {
		subscribe,
		set(field) {
			store.update((p) => fieldSet(p, field));
		},
		update(updater) {
			store.update((p) => fieldSet(p, updater(fieldGet(p))));
		}
	};
}

interface Updatable<F> {
	value: F;
	update(): void;
}
function updatable<T, F extends undefined>(
	store: Writable<T>,
	updater: (store: T, field: F) => void,
	defaultValue?: F
): Updatable<F>;

function updatable<T, F>(
	store: Writable<T>,
	updater: (store: T, field: F) => void,
	defaultValue: F
): Updatable<F>;

function updatable<T, F>(
	store: Writable<T>,
	updater: (store: T, field: F) => void,
	defaultValue: F
) {
	return {
		value: defaultValue,
		update() {
			store.update((store) => {
				updater(store, this.value);
				return store;
			});
		}
	};
}
