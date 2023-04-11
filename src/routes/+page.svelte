<script lang="ts">
	import { slide } from 'svelte/transition';
	import DamageResults from '$lib/components/DamageResults.svelte';
	import PokemonTeam from '$lib/components/PokemonTeam.svelte';
	import PokemonEditor from '$lib/components/PokemonEditor.svelte';
	import SpeedColumn from '$lib/components/SpeedColumn.svelte';
	import FieldEditor from '$lib/components/FieldEditor.svelte';
	import TextImporter from '$lib/components/TextImporter.svelte';

	import { Dex, type Data } from '@pkmn/dex';
	import { Generation, Generations } from '@pkmn/data';
	import { Field, Pokemon } from '$lib/calc';

	import { selectedPokemon, PokemonState } from '$lib/state';
	import { derived } from 'svelte/store';

	function existCheck(data: Data) {
		if ('isNonstandard' in data && data.isNonstandard === 'Past') {
			return true;
		}
		return Generations.DEFAULT_EXISTS(data);
	}

	const baseGens = new Generations(Dex, existCheck);
	const generationMap = {
		RBY: baseGens.get(1),
		GSC: baseGens.get(2),
		ADV: baseGens.get(3),
		DPP: baseGens.get(4),
		'B/W': baseGens.get(5),
		'X/Y': baseGens.get(6),
		'S/M': baseGens.get(7),
		'S/S': baseGens.get(8),
		'S/V': baseGens.get(9)
	};
	let gen: Generation;
	let field = new Field();
	let allyStates: PokemonState[];
	let enemyStates: PokemonState[];

	$: allies = derived(allyStates, (p) => p);
	$: enemies = derived(enemyStates, (p) => p);

	let genString: keyof typeof generationMap = 'S/V';

	function updateGen() {
		gen = generationMap[genString];
		$selectedPokemon = new PokemonState(new Pokemon(gen, 'Bulbasaur'));
		allyStates = [];
		enemyStates = [];
		field = new Field();
	}
	updateGen();

	function addPokeToAllies() {
		allyStates.push(new PokemonState($selectedPokemon.pokemon.clone()));
		allyStates = allyStates;
	}

	function addToPokeEnemies() {
		enemyStates.push(new PokemonState($selectedPokemon.pokemon.clone()));
		enemyStates = enemyStates;
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
			<select bind:value={genString} on:change={updateGen}>
				{#each Object.keys(generationMap) as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
		</div>
		<div class="box poke-editor">
			<button on:click={() => (pokemonCollapsed = !pokemonCollapsed)}>Pokémon</button>
			{#if pokemonCollapsed == false}
				<div transition:slide={{ duration: 300 }}>
					<PokemonEditor bind:pokemon={$selectedPokemon} {gen} />
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
					<FieldEditor bind:field {gen} />
				</div>
			{/if}
		</div>
		<div class="box">
			<TextImporter bind:allyStates bind:enemyStates {gen} />
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
			<DamageResults attackers={allyStates} defenders={enemyStates} {gen} {field} />
			<div class="sep" />
			<SpeedColumn leftTeam={$allies} rightTeam={$enemies} {gen} {field} />
			<div class="sep" />
			<DamageResults attackers={enemyStates} defenders={allyStates} {gen} {field} otherSide />
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
	}
	.data {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	}

	.result-matrix {
		min-height: 10em;
		display: flex;
	}

	.sep {
		border-right: 1px solid black;
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
</style>
