<script lang="ts">
	import { dev } from '$app/environment';
	import { Pokemon, Move } from '$lib/calc';
	import { getTeam1, getTeam2 } from '$lib/sets/TestTeam';
	import { PokemonState, currentGame } from '$lib/state';
	import type { Generation, StatsTable, TypeName } from '@pkmn/data';
	import { Sets, Team, type PokemonSet } from '@pkmn/sets';
	import { selectedPokemon } from '$lib/state';
	import { derived } from 'svelte/store';
	import { localSetToPokemonSet, type LocalSet, type LocalSetStats } from '$lib/sets/sets';
	// @ts-ignore
	import Svelecte, { addFormatter } from 'svelecte';

	export let allyStates: PokemonState[];
	export let enemyStates: PokemonState[];

	let importText: string = '';

	type SetEntry = { value: Partial<LocalSet>; text: string; name: string };
	let setList: { name: string; sets: SetEntry[] }[];
	$: setList = Object.entries($currentGame.sets).map(([name, sets]) => ({
		name,
		sets: Object.entries(sets).map(([setname, set]) => ({ value: set, text: setname, name: name }))
	}));

	$: gen = $currentGame.gen;

	let selectedSet: SetEntry;
	function setListUpdate(_: unknown) {
		importText = Sets.exportSet(localSetToPokemonSet(selectedSet.name, selectedSet.value));
	}

	function renderListElem(item: typeof selectedSet, isSelected: boolean): string {
		if (isSelected) {
			return `${item.name}: ${item.text}`;
		}
		return item.text;
	}
	addFormatter('with-name', renderListElem);

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
					moves: set.moves?.map(
						(m) => new Move(gen, m, { species: set.species, ability: set.ability, item: set.item })
					),
					ability: set.ability,
					level: set.level,
					ivs: set.ivs,
					evs: set.evs,
					selectedTera: set.teraType as TypeName
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
			evs: poke.evs,
			teraType: poke.selectedTera
		};
	}

	function importTextPokemon() {
		let set = Sets.importSet(importText);
		let poke = setToPoke(set);
		if (!poke) {
			window.alert(`failed to import: \n ${importText}`);
			return;
		}
		$selectedPokemonState = poke.pokemon;
		$selectedPokemon = selectedPokemonState;
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
		if (pokes.some((p) => p === undefined)) {
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
	<div class="button-grid">
		<button on:click={() => importTextPokemon()}>Import Pokémon</button>
		<button on:click={() => (allyStates = importTextTeam() ?? allyStates)}>Import allies</button>
		<button on:click={() => (enemyStates = importTextTeam() ?? enemyStates)}>Import enemies</button>

		<button on:click={() => exportTextPokemon()}>Export Pokémon</button>
		<button on:click={() => exportTextTeam($allies)}>Export allies</button>
		<button on:click={() => exportTextTeam($enemies)}>Export enemies</button>
	</div>
	<Svelecte
		options={setList}
		groupLabelField="name"
		groupItemsField="sets"
		virtualList={true}
		valueAsObject
		renderer="with-name"
		bind:value={selectedSet}
		on:change={setListUpdate}
	/>
	<textarea class="import-text" bind:value={importText} />
</div>

<style>
	.import-text {
		margin: 5px;
		height: 20em;
		min-width: 95%;
		max-width: 95%;
		resize: none;
	}

	.button-grid {
		display: grid;
		margin-top: 5px;

		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;
	}

	.button-grid > button {
		margin-left: 5px;
		margin-right: 5px;
	}

	:global(.svelecte-control) {
		position: absolute;
		margin: 5px 5px 0px 5px;
		width: 96%;

		--sv-border-color: #888 !important;
		--sv-color: #111;
	}

	:global(.svelecte-control input::placeholder) {
		color: black;
	}
	/** Dropdown always goes down */
	:global(.sv-dropdown) {
		bottom: auto !important;
	}
</style>
