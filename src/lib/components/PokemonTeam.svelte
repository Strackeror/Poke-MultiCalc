<script lang="ts">
	import { Pokemon } from '$lib/pokemon';
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { selectedPokemon, currentGame, PokemonState } from '$lib/state';
	import { derived as derived_  } from 'svelte/store';

	interface Props {
		pokemonStates: PokemonState[];
		right?: boolean;
	}

	let { pokemonStates = $bindable(), right = false }: Props = $props();

	let pokemons = $derived(derived_(pokemonStates, (p) => p));

	let pokemonStateInstances: [Pokemon, PokemonState][] = $derived($pokemons.map(
			(p, i) => [p, pokemonStates[i]] as [Pokemon, PokemonState]
		));
</script>

<div class:right>
	{#each pokemonStateInstances as [pokemon, pokemonState]}
		<PokemonSprite
			{pokemon}
			disabled={!pokemonState.enabled}
			selected={$selectedPokemon == pokemonState}
			clicked={() => ($selectedPokemon = pokemonState)}
		/>
	{/each}
</div>

<style>
	div {
		height: 96px;
		display: flex;
		flex-wrap: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
	}
</style>
