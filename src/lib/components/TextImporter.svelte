<script lang="ts">
	import type { Pokemon } from '$lib/pokemon';
	import { localSetToPokemonSet, pokeToSet, setToPoke, type LocalSet } from '$lib/sets/sets';
	import { PokemonState, currentGame, selectedPokemon } from '$lib/state';
	import { Sets, Team } from '@pkmn/sets';
	import Svelecte from 'svelecte';

	interface Props {
		allyStates: PokemonState[];
		enemyStates: PokemonState[];
		teamUpdated: () => void;
	}

	let { allyStates = $bindable(), enemyStates = $bindable(), teamUpdated }: Props = $props();

	let importText: string = $state('');

	type SetEntry = { poke: string; set_name: string; set: Partial<LocalSet> };
	let setList: { label: string; options: SetEntry[] }[] = $derived(
		Object.entries($currentGame.sets).map(([poke, sets]) => ({
			label: poke,
			options: Object.entries(sets).map(([set_name, set]) => ({
				poke,
				set_name,
				set
			}))
		}))
	);

	let gen = $derived($currentGame.gen);

	let selectedSets: SetEntry[] = $state([]);
	function setListUpdate(_: unknown) {
		importText = selectedSets
			.map((set) => localSetToPokemonSet(set.poke, set.set))
			.map((set) => Sets.exportSet(set))
			.join('\n\n');
	}

	function renderListElem(value: object, selected?: boolean) {
		let entry = value as SetEntry;
		if (selected) return `${entry.poke}: ${entry.set_name}`;
		return entry.set_name;
	}

	let selectedPokemonState = $derived($selectedPokemon);
	let allies = $derived(allyStates.map((p) => p.pokemon));
	let enemies = $derived(enemyStates.map((p) => p.pokemon));

	function importTextPokemon() {
		let set = Sets.importSet(importText);
		let poke = setToPoke(gen, set);
		if (!poke) {
			window.alert(`failed to import: \n ${importText}`);
			return;
		}
		teamUpdated();
		let state = new PokemonState(poke);
		$selectedPokemonState = state.pokemon;
		$selectedPokemon = selectedPokemonState;
	}

	function exportTextPokemon() {
		importText = Sets.exportSet(pokeToSet($selectedPokemonState));
	}

	type Side = 'Allies' | 'Enemies';

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
			case 'Allies':
				if (allyStates.includes($selectedPokemon)) $selectedPokemon = newTeam[0];
				allyStates = newTeam;
				break;
			case 'Enemies':
				if (enemyStates.includes($selectedPokemon)) $selectedPokemon = newTeam[0];
				enemyStates = newTeam;
				break;
		}
		teamUpdated();
	}

	function exportTextTeam(team: Pokemon[]) {
		importText = team.map((p) => Sets.exportSet(pokeToSet(p))).join();
	}
</script>

<div class="import-text-box">
	<div class="button-grid">
		<button onclick={() => importTextPokemon()}>Import Pokémon</button>
		<button onclick={() => importTextTeam('Allies')}>Import allies</button>
		<button onclick={() => importTextTeam('Enemies')}>Import enemies</button>

		<button onclick={() => exportTextPokemon()}>Export Pokémon</button>
		<button onclick={() => exportTextTeam(allies)}>Export allies</button>
		<button onclick={() => exportTextTeam(enemies)}>Export enemies</button>
	</div>
	<Svelecte
		placeholder="Trainer Sets"
		options={setList}
		valueField="set"
		virtualList
		valueAsObject
		keepSelectionInList
		multiple
		clearable
		resetOnSelect={false}
		bind:value={selectedSets}
		renderer={renderListElem}
		onChange={setListUpdate}
	/>
	<textarea
		class="import-text"
		bind:value={
			() => importText,
			(v) => {
				importText = v;
				selectedSets = [];
			}
		}
	></textarea>
</div>

<style>
	.import-text-box {
		--sv-color: #ccc;
		--sv-bg: #2b2a33;
		--sv-disabled-bg: #eee;
		--sv-item-selected-bg: #52525e;
		--sv-item-btn-color: #ccc;
		--sv-item-btn-color-hover: #ccc;
		--sv-dropdown-active-bg: #52525e;
		--sv-dropdown-selected-bg: #42424b;
	}
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
		width: 97%;
	}

	:global(.sv_dropdown) {
		bottom: auto !important;
	}
</style>
