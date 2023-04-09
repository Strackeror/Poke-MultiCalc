<script lang="ts">
	import { Pokemon, Move } from '$lib/calc';
	import type { Generation } from '@pkmn/data';
	import { Sets, Team, type PokemonSet } from '@pkmn/sets';

	export let gen: Generation;
	export let editedPoke: Pokemon;
	export let allies: Pokemon[];
	export let enemies: Pokemon[];

	let importText: string = '';

	function setToPoke(set: Partial<PokemonSet<string>>) {
		if (!set || !set.species) {
			return undefined;
		}

		let poke = new Pokemon(gen, set.species, {
			item: set.item,
			nature: set.nature,
			moves: set.moves?.map((m) => new Move(gen, m)),
			ability: set.ability,
			level: set.level,
			ivs: set.ivs,
			evs: set.evs
		});
		return poke;
	}

	function pokeToSet(poke: Pokemon): Partial<PokemonSet<string>> {
		return {
			species: poke.species.name,
			nature: poke.nature,
			ability: poke.ability,
			item: poke.item,
			moves: poke.moves.map((m) => m.name),
			level: poke.level,
			ivs: poke.ivs,
			evs: poke.evs
		};
	}

	function importTextPokemon() {
		let set = Sets.importSet(importText);
		let poke = setToPoke(set);
		if (poke) {
			editedPoke = poke;
		}
	}

	function exportTextPokemon() {
		importText = Sets.exportSet(pokeToSet(editedPoke));
	}

	function importTextTeam(set: (v: Pokemon[]) => void) {
		let sets = Team.import(importText);
		if (!sets) {
			return;
		}

		let pokes = sets.team.map((s) => setToPoke(s)).filter((s) => s != undefined) as Pokemon[];
		set(pokes);
	}

	function exportTextTeam(team: Pokemon[]) {
		importText = team.map((p) => Sets.exportSet(pokeToSet(p))).join();
	}
</script>

<div class="import-text-box">
	<textarea class="import-text" bind:value={importText} />
	<div class="button-grid">
		<button on:click={importTextPokemon}>Import Pokémon</button>
		<button on:click={() => importTextTeam((v) => (allies = v))}>Import allies</button>
		<button on:click={() => importTextTeam((v) => (enemies = v))}>Import enemies</button>

		<button on:click={() => exportTextPokemon()}>Export Pokémon</button>
		<button on:click={() => exportTextTeam(allies)}>Export allies</button>
		<button on:click={() => exportTextTeam(enemies)}>Export enemies</button>
	</div>
</div>

<style>
	.import-text {
		margin: 5px;
		height: 10em;
		min-width: 95%;
		max-width: 95%;
	}

	.button-grid {
		display: grid;
    margin-bottom: 5px;

		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;
	}

	.button-grid > button {
		margin-left: 5px;
		margin-right: 5px;
	}
</style>
