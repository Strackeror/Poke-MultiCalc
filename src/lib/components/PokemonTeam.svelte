<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { Sprites } from '@pkmn/img';

	export let pokemons: Pokemon[];
	export let selectedPokemon: Pokemon;
	export let right: boolean = false;

	let imgs: any[] = [];
	$: imgs = pokemons.map((poke) => Sprites.getPokemon(poke.species.name, { gen: 'gen5' }));
</script>

<div class={right ? 'right' : ''}>
	{#each pokemons as pokemon}
		<PokemonSprite {pokemon} bind:selectedPokemon />
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
