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
	let editedPoke: Pokemon;
	let field = new Field();
	let allies: Pokemon[];
	let enemies: Pokemon[];

	let genString: keyof typeof generationMap = 'S/V';

	function updateGen() {
		gen = generationMap[genString];
		editedPoke = new Pokemon(gen, 'Bulbasaur');
		allies = [];
		enemies = [];
		field = new Field();
	}
	updateGen();

	$: {
		if (allies.includes(editedPoke))
			allies = allies;
		if (enemies.includes(editedPoke))
			enemies = enemies;
	}

	function addPokeToAllies() {
		allies.push(editedPoke.clone());
		allies = allies;
	}

	function addToPokeEnemies() {
		enemies.push(editedPoke.clone());
		enemies = enemies;
	}

	function removePoke() {
		allies = allies.filter((p) => p != editedPoke);
		enemies = enemies.filter((p) => p != editedPoke);
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
					<PokemonEditor bind:pokemon={editedPoke} {gen} />
					<div style="display: flex; flex-direction: row;">
						<button on:click={addPokeToAllies}>Add to allies</button>
						<button on:click={addToPokeEnemies}>Add to enemies</button>
						{#if allies.indexOf(editedPoke) >= 0 || enemies.indexOf(editedPoke) >= 0}
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
			<TextImporter bind:editedPoke bind:allies bind:enemies {gen} />
		</div>
	</div>
	<div class="data">
		<div class="teams">
			<div class="team ally box">
				<span>Allies</span>
				<PokemonTeam pokemons={allies} bind:selectedPokemon={editedPoke} />
			</div>
			<div class="team enemy box">
				<span>Enemies</span>
				<PokemonTeam pokemons={enemies} bind:selectedPokemon={editedPoke} right />
			</div>
		</div>
		<div class="result-matrix box">
			<DamageResults offense={allies} defense={enemies} {gen} {field} />
			<div class="sep" />
			<SpeedColumn leftTeam={allies} rightTeam={enemies} {gen} {field} />
			<div class="sep" />
			<DamageResults offense={enemies} defense={allies} {gen} {field} otherSide />
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
