<script lang="ts">
	import DamageResults from '$lib/components/DamageResults.svelte';
	import FieldEditor from '$lib/components/FieldEditor.svelte';
	import PokemonEditor from '$lib/components/PokemonEditor.svelte';
	import PokemonTeam from '$lib/components/PokemonTeam.svelte';
	import SpeedColumn from '$lib/components/SpeedColumn.svelte';
	import TextImporter from '$lib/components/TextImporter.svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Pokemon } from '$lib/pokemon';
	import { Field } from '@smogon/calc';
	import { pokeToSet, setToPoke } from '$lib/sets/sets';
	import { GameNames, PokemonState, currentGame, getGame, selectedPokemon } from '$lib/state';
	import type { PokemonSet } from '@pkmn/sets';
	import { writable } from 'svelte/store';

	$selectedPokemon = new PokemonState(new Pokemon($currentGame.gen, 'Bulbasaur'));

	const field = writable(new Field());
	let allyStates: PokemonState[] = $state([$selectedPokemon]);
	let enemyStates: PokemonState[] = $state([]);
	let showAll: boolean = $state(false);

	let genName: string = $state('');
	genName = page.url.searchParams.get('game') ?? 'S/V';

	type LocalStorageState = {
		allies: Partial<PokemonSet>[];
		enemies: Partial<PokemonSet>[];
	};

	function saveState() {
		let state: LocalStorageState = {
			allies: allyStates.map((p) => pokeToSet(p.pokemon)),
			enemies: enemyStates.map((p) => pokeToSet(p.pokemon))
		};
		console.log('Saving state', state);
		localStorage.setItem(`${genName}-state`, JSON.stringify(state));
	}

	setInterval(() => {
		saveState();
	}, 20_000);

	function loadState() {
		let storage = localStorage.getItem(`${genName}-state`);
		if (!storage) return false;
		let state: LocalStorageState = JSON.parse(storage);
		allyStates = state.allies
			.map((set) => setToPoke($currentGame.gen, set))
			.filter((p): p is Pokemon => !!p)
			.map((p) => new PokemonState(p));
		enemyStates = state.enemies
			.map((set) => setToPoke($currentGame.gen, set))
			.filter((p): p is Pokemon => !!p)
			.map((p) => new PokemonState(p));
		$selectedPokemon = [...allyStates, ...enemyStates][0];
		return $selectedPokemon != undefined;
	}

	async function updateGen() {
		$currentGame = await getGame(genName);
		page.url.searchParams.set('game', genName);
		goto(`?${page.url.searchParams.toString()}`);
		$field = new Field();
		if (loadState()) return;

		$selectedPokemon = new PokemonState(new Pokemon($currentGame.gen, 'Bulbasaur'));
		allyStates = [$selectedPokemon];
		enemyStates = [];
		return;
	}
	updateGen();

	function removePoke() {
		let index = allyStates.indexOf($selectedPokemon);
		if (index >= 0) {
			allyStates.splice(index, 1);
			if (index > 0) $selectedPokemon = allyStates[index - 1];
			else $selectedPokemon = [...allyStates, ...enemyStates][0];
			return;
		}

		index = enemyStates.indexOf($selectedPokemon);
		if (index >= 0) {
			enemyStates.splice(index, 1);
			if (index > 0) $selectedPokemon = enemyStates[index - 1];
			else $selectedPokemon = [...allyStates, ...enemyStates][0];
			return;
		}
	}

	function togglePoke() {
		$selectedPokemon.enabled = !$selectedPokemon.enabled;
		$selectedPokemon.update();
	}

	function clear() {
		if (window.confirm('Are you sure you want to clear ?')) {
			$selectedPokemon = new PokemonState(new Pokemon($currentGame.gen, 'Bulbasaur'));
			allyStates = [$selectedPokemon];
			enemyStates = [];
			saveState();
		}
	}

	let pokemonCollapsed: boolean = $state(false);
	let fieldCollapse: boolean = $state(true);
</script>

<div class="main">
	<div class="edit">
		<div class="box basic-options">
			Games
			<select bind:value={genName} onchange={updateGen}>
				{#each GameNames as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
			<button class="right" onclick={clear}>Clear</button>
			<br />
			<div class="right">
				<input type="checkbox" id="all" bind:checked={showAll} />
				<label for="all" title="Show All Pokémon interactions">Show All</label>
			</div>
		</div>
		<div class="box poke-editor">
			<button onclick={() => (pokemonCollapsed = !pokemonCollapsed)}>Pokémon</button>
			<button
				class="poke-remove right"
				onclick={removePoke}
				disabled={allyStates.length + enemyStates.length <= 1}>Remove</button
			>
			<button class="right" onclick={togglePoke}
				>{#if $selectedPokemon.enabled}Hide{:else}Show{/if}</button
			>
			<div hidden={pokemonCollapsed}>
				<PokemonEditor bind:pokemon={$selectedPokemon} />
			</div>
		</div>
		<div class="box field-editor">
			<button onclick={() => (fieldCollapse = !fieldCollapse)}>Field</button>
			<button
				class="right"
				onclick={() => {
					$field = new Field();
				}}
				>Reset
			</button>
			<div hidden={fieldCollapse}>
				<FieldEditor bind:field={$field} />
			</div>
		</div>
		<div class="box">
			<TextImporter bind:allyStates bind:enemyStates teamUpdated={saveState} />
		</div>
		<div class="box credits">
			<a target="_blank" href="https://github.com/Strackeror/Poke-MultiCalc">Github</a> <br />
			Based on: <br />
			<a target="_blank" href="https://github.com/smogon/damage-calc">Smogon damage calc</a> <br />
			{#if $currentGame.basedOn}
				<a target="_blank" href={$currentGame.basedOn}>RomHack calc</a>
			{/if}
		</div>
	</div>
	<div class="data">
		<div class="teams">
			<div class="team ally box">
				<span>Allies</span>
				<PokemonTeam bind:pokemonStates={allyStates} />
			</div>
			<div class="team enemy box">
				<span>Enemies</span>
				<PokemonTeam bind:pokemonStates={enemyStates} />
			</div>
		</div>
		<div class="result-matrix box">
			<DamageResults attackers={allyStates} defenders={enemyStates} field={$field} {showAll} />
			<SpeedColumn leftTeam={allyStates} rightTeam={enemyStates} field={$field} />
			<DamageResults
				attackers={enemyStates}
				defenders={allyStates}
				field={$field}
				{showAll}
				otherSide
			/>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #1b1b1b;
		color-scheme: dark;
		color: aliceblue;
	}
	.main {
		display: flex;
		max-width: 100%;
	}
	.edit {
		font: 10pt Verdana;
		width: 380px;
		min-width: 380px;
		max-height: calc(100vh - 20px);
		overflow-y: scroll;
		padding-right: 7px;
	}
	.data {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	}

	.result-matrix {
		min-height: 10em;
		max-height: calc(100vh - 138px);
		min-width: 800px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
	}

	.poke-editor,
	.field-editor,
	.credits {
		padding: 10px;
	}

	.basic-options {
		padding: 5px;
	}

	.box {
		margin: 10px;
		overflow: hidden;
		border-radius: 10px;
		background: #1b1b1b;
		box-shadow:
			5px 5px 10px #0b0b0b,
			-5px -5px 10px #2b2b2b;
	}

	.teams {
		display: grid;
		grid-auto-columns: minmax(0, 1fr);
		grid-auto-flow: column;
	}

	.team {
		position: relative;
	}

	.team > span {
		position: absolute;
		right: 0;
		text-align: right;
		margin: 0px 5px;
		z-index: 1;
	}

	.right {
		float: right;
	}
</style>
