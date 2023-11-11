<script lang="ts">
	import { Pokemon } from '$lib/pokemon';
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { selectedPokemon, currentGame, PokemonState } from '$lib/state';
	import { derived } from 'svelte/store';

	export let pokemonStates: PokemonState[];
	export let right: boolean = false;

	$: pokemons = derived(pokemonStates, (p) => p);

	let pokemonStateInstances: [Pokemon, PokemonState][];
	$: {
		pokemonStateInstances = $pokemons.map(
			(p, i) => [p, pokemonStates[i]] as [Pokemon, PokemonState]
		);
	}

	function addPokemon() {
		let level = pokemonStates.map((n) => n.pokemon.level).reduce((a, b) => Math.max(a, b), 0);
		if (level == 0) level = 100;
		let newPoke = new PokemonState(new Pokemon($currentGame.gen, 'bulbasaur', { level }));
		pokemonStates = [...pokemonStates, newPoke];
		$selectedPokemon = newPoke;
	}
</script>

<div class:right>
	{#each pokemonStateInstances as [pokemon, pokemonState]}
		<PokemonSprite
			{pokemon}
			disabled={!pokemonState.enabled}
			selected={$selectedPokemon == pokemonState}
			on:clicked={() => ($selectedPokemon = pokemonState)}
		/>
	{/each}
	<div class="add">
		<button on:click={addPokemon}>Add</button>
	</div>
</div>

<style>
	div {
		height: 96px;
		display: flex;
		flex-wrap: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
	}

	.add {
		width: 64x;
		height: 64px;
		padding: 16px;
	}
</style>
