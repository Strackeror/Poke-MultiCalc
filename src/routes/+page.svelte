<script lang="ts">
	import { slide } from 'svelte/transition';
	import DamageResults from '$lib/components/DamageResults.svelte';
	import PokemonTeam from '$lib/components/PokemonTeam.svelte';
	import PokemonEditor from '$lib/components/PokemonEditor.svelte';
	import SpeedColumn from '$lib/components/SpeedColumn.svelte';
	import FieldEditor from '$lib/components/FieldEditor.svelte';
	import TextImporter from '$lib/components/TextImporter.svelte';

	import { Field, Pokemon } from '$lib/calc';

	import { selectedPokemon, PokemonState, currentGame, getGame, GameNames } from '$lib/state';
	import { derived } from 'svelte/store';

	$selectedPokemon = new PokemonState(new Pokemon($currentGame.gen, 'Bulbasaur'));
	$: console.log(`selected pokemon changed: ${$selectedPokemon.pokemon.species.name}`);

	let field = new Field();
	let allyStates: PokemonState[] = [];
	let enemyStates: PokemonState[] = [];

	$: allies = derived(allyStates, (p) => p);
	$: enemies = derived(enemyStates, (p) => p);

	let genName: string = 'S/V';
	async function updateGen() {
		$currentGame = await getGame(genName);
		$selectedPokemon = new PokemonState(new Pokemon($currentGame.gen, 'Bulbasaur'));
		allyStates = [];
		enemyStates = [];
		field = new Field();
	}

	function pokeInTeams(poke: PokemonState) {
		return allyStates.includes(poke) || enemyStates.includes(poke);
	}

	function addPokeToAllies() {
		let poke = pokeInTeams($selectedPokemon)
			? new PokemonState($selectedPokemon.pokemon.clone())
			: $selectedPokemon;
		allyStates = [...allyStates, poke];
	}

	function addToPokeEnemies() {
		let poke = pokeInTeams($selectedPokemon)
			? new PokemonState($selectedPokemon.pokemon.clone())
			: $selectedPokemon;
		enemyStates = [...enemyStates, poke];
	}

	function removePoke() {
		allyStates = allyStates.filter((p) => p != $selectedPokemon);
		enemyStates = enemyStates.filter((p) => p != $selectedPokemon);
	}

	let pokemonCollapsed: boolean = false;
	let fieldCollapse: boolean = true;
</script>

<div class="main">
	<div class="edit">
		<div class="box basic-options">
			Games
			<select bind:value={genName} on:change={updateGen}>
				{#each GameNames as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
			<button class="clear" on:click={updateGen}>Clear</button>
		</div>
		<div class="box poke-editor">
			<button on:click={() => (pokemonCollapsed = !pokemonCollapsed)}>Pokémon</button>
			{#if pokemonCollapsed == false}
				<div transition:slide={{ duration: 300 }}>
					<PokemonEditor bind:pokemon={$selectedPokemon} />
					<div style="display: flex; flex-direction: row;">
						<button on:click={addPokeToAllies}>Add to allies</button>
						<button on:click={addToPokeEnemies}>Add to enemies</button>
						{#if allyStates.indexOf($selectedPokemon) >= 0 || enemyStates.indexOf($selectedPokemon) >= 0}
							<button on:click={removePoke}>Remove</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
		<div class="box field-editor">
			<button on:click={() => (fieldCollapse = !fieldCollapse)}>Field</button>
			{#if fieldCollapse == false}
				<div transition:slide={{ duration: 300 }}>
					<FieldEditor bind:field />
				</div>
			{/if}
		</div>
		<div class="box">
			<TextImporter bind:allyStates bind:enemyStates />
		</div>
	</div>
	<div class="data">
		<div class="teams">
			<div class="team ally box">
				<span>Allies</span>
				<PokemonTeam pokemonStates={allyStates} />
			</div>
			<div class="team enemy box">
				<span>Enemies</span>
				<PokemonTeam pokemonStates={enemyStates} />
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
	.field-editor {
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

	.clear {
		float: right;
	}
</style>
