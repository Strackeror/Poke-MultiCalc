<script lang="ts">
	import DamageResults from './DamageResults.svelte';
	import PokemonTeam from './PokemonTeam.svelte';
	import PokemonEditor from './PokemonEditor.svelte';
	import {
		Dex,
		type AbilityName,
		type ItemName,
		type MoveName,
		type NatureName,
		type PokemonSet
	} from '@pkmn/dex';
	import { Sets, Team } from '@pkmn/sets';
	import { Generation, Pokemon } from '$lib/calc';
	import { not_equal } from 'svelte/internal';

	let dex = Dex.forGen(9);
	let gen = new Generation(dex);
	let editedPoke: Pokemon = new Pokemon(gen, 'Bulbasaur');
	editedPoke.moves[1] = 'Giga Drain' as MoveName;
	let allies: Pokemon[] = [editedPoke];
	let enemies: Pokemon[] = [];
	let importText: string = '';

	$: {
		if (allies.indexOf(editedPoke) >= 0) {
			allies = allies;
		}

		if (enemies.indexOf(editedPoke) >= 0) {
			enemies = enemies;
		}
	}

	function setToPoke(set: Partial<PokemonSet<string>>) {
		if (!set || !set.species) {
			return undefined;
		}

		let poke = new Pokemon(gen, set.species);
		if (set.item) {
			poke.item = set.item as ItemName;
		}
		if (set.ability) {
			poke.ability = set.ability as AbilityName;
		}
		if (set.nature) {
			poke.nature = set.nature as NatureName;
		}
		if (set.moves) {
			poke.moves = set.moves as MoveName[];
		}
		if (set.level) {
			poke.level = set.level;
		}
		if (set.ivs) {
			poke.ivs = set.ivs;
		}
		if (set.evs) {
			poke.evs = set.evs;
		}
		return poke;
	}

	function importTextPokemon() {
		let set = Sets.importSet(importText);
		let poke = setToPoke(set);
		if (poke) {
			editedPoke = poke;
		}
	}

	function importTextTeam(setEnemies: boolean) {
		let sets = Team.import(importText);
		if (!sets) {
			return;
		}

		let pokes = sets.team.map((s) => setToPoke(s)).filter((s) => s != undefined) as Pokemon[];
		if (setEnemies) {
			enemies = pokes;
		} else {
			allies = pokes;
		}
	}

	function addPokeToAllies() {
		allies.push(editedPoke.clone());
		allies = allies;
	}

	function addToPokeEnemies() {
		enemies.push(editedPoke.clone());
		enemies = enemies;
	}
</script>

<div class="main">
	<div class="edit">
		<div class="box">
			<div class="poke-editor"><PokemonEditor bind:pokemon={editedPoke} /></div>
			<div style="display: flex; flex-direction: row;">
				<button on:click={addPokeToAllies}>Add to allies</button>
				<button on:click={addToPokeEnemies}>Add to enemies</button>
			</div>
		</div>
		<div class="box import-text-box">
			<textarea class="import-text" bind:value={importText} />
			<button on:click={importTextPokemon}>Import</button>
			<button on:click={() => importTextTeam(false)}>Import allies</button>
			<button on:click={() => importTextTeam(true)}>Import enemies</button>
		</div>
	</div>
	<div class="data">
		<div class="teams">
			<div class="team ally box">
				Allies <PokemonTeam pokemons={allies} bind:selectedPokemon={editedPoke} />
			</div>
			<div class="team enemy box">
				Enemies <PokemonTeam pokemons={enemies} bind:selectedPokemon={editedPoke} />
			</div>
		</div>
		<div class="result-matrix box">
			<DamageResults offense={allies} defense={enemies} {gen} />
			<div class="sep"></div>
			<DamageResults offense={enemies} defense={allies} {gen} />
		</div>
	</div>
</div>

<style>
	.main {
		display: flex;
	}
	.edit {
		font: 10pt Verdana;
		width: 420px;
	}
	.data {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		max-height: 100%;
	}

	.result-matrix {
		flex-grow: 1;
		display: flex;
	}

	.sep {
		flex-grow: 100;
	}

	.teams {
		display: flex;
	}

	.import-text {
		margin: 5px;
		height: 10em;
		min-width: 95%;
		max-width: 95%;
	}

	.import-text-box > button {
		margin: 5px;
	}

	.poke-editor {
		margin: 5px;
	}

	.box {
		border-radius: 5px;
		border: 1px solid black;
		box-shadow: 2px 2px black;
		margin: 5px;
	}
	.team {
		flex-grow: 1;
	}
</style>
