<script lang="ts">
	import type { Pokemon, Move } from '$lib/calc';
	import { PokemonState, currentGame } from '$lib/state';
	import type { TypeName } from '@pkmn/data';
	import { Sets, Team, type PokemonSet } from '@pkmn/sets';
	import { selectedPokemon } from '$lib/state';
	import { derived } from 'svelte/store';
	import { localSetToPokemonSet, type LocalSet, pokeToSet, setToPoke } from '$lib/sets/sets';
	// @ts-ignore
	import Svelecte, { addFormatter } from 'svelecte';
	import { createEventDispatcher } from 'svelte';

	const event = createEventDispatcher<{ teamUpdated: void }>();

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

	let selectedSets: SetEntry[];
	function setListUpdate(_: unknown) {
		importText = selectedSets
			.map((set) => localSetToPokemonSet(set.name, set.value))
			.map((set) => Sets.exportSet(set))
			.join('\n\n');
	}

	function renderListElem(item: typeof selectedSets[0], isSelected: boolean): string {
		if (isSelected) {
			return `${item.name}: ${item.text}`;
		}
		return item.text;
	}
	addFormatter('with-name', renderListElem);

	$: selectedPokemonState = $selectedPokemon;
	$: allies = derived(allyStates, (p) => p);
	$: enemies = derived(enemyStates, (p) => p);

	function importTextPokemon() {
		let set = Sets.importSet(importText);
		let poke = setToPoke(gen, set);
		if (!poke) {
			window.alert(`failed to import: \n ${importText}`);
			return;
		}
		event('teamUpdated');
		let state = new PokemonState(poke);
		$selectedPokemonState = state.pokemon;
		$selectedPokemon = selectedPokemonState;
	}

	function exportTextPokemon() {
		importText = Sets.exportSet(pokeToSet($selectedPokemonState));
	}

	enum Side {
		Allies,
		Enemies
	}

	function importTextTeam(side: Side): PokemonState[] | undefined {
		let sets = Team.import(importText);
		if (!sets) {
			window.alert(`failed to import: \n ${importText}`);
			return;
		}

		let pokes = sets.team.map((s) => setToPoke(gen, s));
		if (pokes.some((p) => p === undefined)) {
			window.alert(`failed to import: \n ${importText}`);
			return;
		}
		let newTeam = pokes
			.filter((p): p is Pokemon => p !== undefined)
			.map((p) => new PokemonState(p));
		switch (side) {
			case Side.Allies:
				if (allyStates.includes($selectedPokemon)) $selectedPokemon = newTeam[0];
				allyStates = newTeam;
				break;
			case Side.Enemies:
				if (enemyStates.includes($selectedPokemon)) $selectedPokemon = newTeam[0];
				enemyStates = newTeam;
				break;
		}
		event('teamUpdated');
	}

	function exportTextTeam(team: Pokemon[]) {
		importText = team.map((p) => Sets.exportSet(pokeToSet(p))).join();
	}
</script>

<div class="import-text-box">
	<div class="button-grid">
		<button on:click={() => importTextPokemon()}>Import Pokémon</button>
		<button on:click={() => importTextTeam(Side.Allies)}>Import allies</button>
		<button on:click={() => importTextTeam(Side.Enemies)}>Import enemies</button>

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
		multiple
		clearable
		resetOnSelect={false}
		renderer="with-name"
		bind:value={selectedSets}
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
