<script lang="ts">
	import DamageResults from '$lib/components/DamageResults.svelte';
	import FieldEditor from '$lib/components/FieldEditor.svelte';
	import PokemonEditor from '$lib/components/PokemonEditor.svelte';
	import PokemonTeam from '$lib/components/PokemonTeam.svelte';
	import SpeedColumn from '$lib/components/SpeedColumn.svelte';
	import TextImporter from '$lib/components/TextImporter.svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Field, Pokemon } from '$lib/calc';
	import { pokeToSet, setToPoke } from '$lib/sets/sets';
	import { GameNames, HackNames, PokemonState, currentGame, getGame, selectedPokemon } from '$lib/state';
	import type { PokemonSet } from '@pkmn/data';
	import { derived } from 'svelte/store';

	$selectedPokemon = new PokemonState(new Pokemon($currentGame.gen, 'bulbasaur'));
	$: console.log(`selected pokemon changed: ${$selectedPokemon.pokemon.species.name}`);

	let field = new Field();
	let allyStates: PokemonState[] = [$selectedPokemon];
	let enemyStates: PokemonState[] = [];

	$: allies = derived(allyStates, (p) => p);
	$: enemies = derived(enemyStates, (p) => p);

	let genName: string = '';
	genName = $page.url.searchParams.get('game') ?? 'S/V';

	type LocalStorageState = {
		allies: Partial<PokemonSet>[];
		enemies: Partial<PokemonSet>[];
	};
	function saveState() {
		let state: LocalStorageState = {
			allies: $allies.map(pokeToSet),
			enemies: $enemies.map(pokeToSet)
		};
		console.log('Saving state', state);
		localStorage.setItem(`${genName}-state`, JSON.stringify(state));
	}

	let autosave = setInterval(() => {
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
		return true;
	}

	async function updateGen() {
		$currentGame = await getGame(genName);
		$page.url.searchParams.set('game', genName);
		goto(`?${$page.url.searchParams.toString()}`);
		field = new Field();
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
			allyStates = allyStates;
			if (index > 0) $selectedPokemon = allyStates[index - 1];
			else $selectedPokemon = [...allyStates, ...enemyStates][0];
			return;
		}

		index = enemyStates.indexOf($selectedPokemon);
		if (index >= 0) {
			enemyStates.splice(index, 1);
			enemyStates = enemyStates;
			if (index > 0) $selectedPokemon = enemyStates[index - 1];
			else $selectedPokemon = [...allyStates, ...enemyStates][0];
			return;
		}
	}

	function togglePoke() {
		$selectedPokemon.enabled = !$selectedPokemon.enabled;
		allyStates = allyStates;
		enemyStates = enemyStates;
	}

	function clear() {
		if (window.confirm("Are you sure you want to clear ?")) {
			$selectedPokemon = new PokemonState(new Pokemon($currentGame.gen, 'Bulbasaur'));
			allyStates = [$selectedPokemon];
			enemyStates = [];
			saveState();
		}
	}

	let pokemonCollapsed: boolean = false;
	let fieldCollapse: boolean = true;
</script>

<div class="main">
	<div class="edit">
		<div class="box basic-options">
			Games
			<select bind:value={genName} on:change={updateGen}>
				<optgroup label="Vanilla">
					{#each GameNames as name}
						<option value={name}>{name}</option>
					{/each}
				</optgroup>
				<optgroup label="Hacks">
					{#each HackNames as name}
						<option value={name}>{name}</option>
					{/each}
				</optgroup>
			</select>
			<button class="right" on:click={clear}>Clear</button>
		</div>
		<div class="box poke-editor">
			<button on:click={() => (pokemonCollapsed = !pokemonCollapsed)}>Pokémon</button>
			<button
				class="poke-remove right"
				on:click={removePoke}
				disabled={$allies.length + $enemies.length <= 1}>Remove</button
			>
			<button class="right" on:click={togglePoke}>{#if $selectedPokemon.enabled}Hide{:else}Show{/if}</button>
			<div hidden={pokemonCollapsed}>
				<PokemonEditor bind:pokemon={$selectedPokemon} />
			</div>
		</div>
		<div class="box field-editor">
			<button on:click={() => (fieldCollapse = !fieldCollapse)}>Field</button>
			<div hidden={fieldCollapse}>
				<FieldEditor bind:field />
			</div>
		</div>
		<div class="box">
			<TextImporter bind:allyStates bind:enemyStates on:teamUpdated={saveState} />
		</div>
		<div class="box credits">
			Based on: <br />
			<a href="https://github.com/smogon/damage-calc">Smogon damage calc</a> <br />
			{#if $currentGame.basedOn}
				<a href={$currentGame.basedOn}>RomHack calc</a>
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
			<DamageResults attackers={allyStates} defenders={enemyStates} {field} />
			<SpeedColumn leftTeam={$allies} rightTeam={$enemies} {field} />
			<DamageResults attackers={enemyStates} defenders={allyStates} {field} otherSide />
		</div>
	</div>
</div>

<style>
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
		border-radius: 10px;
		border: 1px solid black;
		margin: 5px;
		overflow: hidden;
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
