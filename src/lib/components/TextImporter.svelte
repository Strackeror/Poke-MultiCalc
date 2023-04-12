<script lang="ts">
	import { dev } from '$app/environment';
	import { Pokemon, Move } from '$lib/calc';
	import { getTeam1, getTeam2 } from '$lib/sets/TestTeam';
	import { PokemonState } from '$lib/state';
	import type { Generation } from '@pkmn/data';
	import { Sets, Team, type PokemonSet } from '@pkmn/sets';
	import { selectedPokemon } from '$lib/state';
	import { derived } from 'svelte/store';

	export let gen: Generation;
	export let allyStates: PokemonState[];
	export let enemyStates: PokemonState[];

	let importText: string = '';

	$: selectedPokemonState = $selectedPokemon;
	$: allies = derived(allyStates, (p) => p);
	$: enemies = derived(enemyStates, (p) => p);

	function setToPoke(set: Partial<PokemonSet<string>>) {
		if (!set?.species) return;

		try {
			let poke = new PokemonState(
				new Pokemon(gen, set.species, {
					item: set.item,
					nature: set.nature,
					moves: set.moves?.map((m) => new Move(gen, m)),
					ability: set.ability,
					level: set.level,
					ivs: set.ivs,
					evs: set.evs
				})
			);
			return poke;
		} catch (e) {
			return;
		}
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
		if (!poke) {
			window.alert(`failed to import: \n ${importText}`);
			return;
		}
		$selectedPokemon = poke;
	}

	function exportTextPokemon() {
		importText = Sets.exportSet(pokeToSet($selectedPokemonState));
	}

	function importTextTeam(): PokemonState[] | undefined {
		let sets = Team.import(importText);
		if (!sets) {
			window.alert(`failed to import: \n ${importText}`);
			return;
		}

		let pokes = sets.team.map((s) => setToPoke(s));
		if (pokes.some(p => p === undefined)) {
			window.alert(`failed to import: \n ${importText}`);
			return;
		}
		return pokes.filter((p): p is PokemonState => p !== undefined);
	}

	function exportTextTeam(team: Pokemon[]) {
		importText = team.map((p) => Sets.exportSet(pokeToSet(p))).join();
	}
</script>

<div class="import-text-box">
	<textarea class="import-text" bind:value={importText} />
	<div class="button-grid">
		<button on:click={importTextPokemon}>Import Pokémon</button>
		<button on:click={() => (allyStates = importTextTeam() ?? allyStates)}>Import allies</button>
		<button on:click={() => (enemyStates = importTextTeam() ?? enemyStates)}>Import enemies</button>

		<button on:click={() => exportTextPokemon()}>Export Pokémon</button>
		<button on:click={() => exportTextTeam($allies)}>Export allies</button>
		<button on:click={() => exportTextTeam($enemies)}>Export enemies</button>

		{#if dev}
			<button
				on:click={() => {
					importText = getTeam1();
					allyStates = importTextTeam() ?? [];
					importText = getTeam2();
					enemyStates = importTextTeam() ?? [];
				}}
				>Toast
			</button>
		{/if}
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
