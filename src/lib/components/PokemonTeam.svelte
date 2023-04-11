<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { selectedPokemon, type PokemonState } from '$lib/state';
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
</script>

<div class={right ? 'right' : ''}>
	{#each pokemonStateInstances as [pokemon, pokemonState]}
		<PokemonSprite
			{pokemon}
			selected={$selectedPokemon == pokemonState}
			on:clicked={() => ($selectedPokemon = pokemonState)}
		/>
	{/each}
</div>

<style>
	div {
		height: 96px;
		display: flex;
		flex-wrap: nowrap;
		overflow-x: scroll;
	}
</style>
