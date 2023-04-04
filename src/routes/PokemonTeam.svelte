<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import { Sprites } from '@pkmn/img';

	export let pokemons: Pokemon[];
	export let selectedPokemon: Pokemon;

	let imgs: any[] = [];
	$: imgs = pokemons.map((poke) => Sprites.getPokemon(poke.species.name, {gen: "gen5"}));
</script>

{#each pokemons as pokemon, index}
	{#if pokemon == selectedPokemon}
		<img
			class="selected"
			src={imgs[index].url}
			alt={imgs[index].url}
			width={imgs[index].w}
			height={imgs[index].h}
		/>
	{:else}
		<img
			class=""
			on:click={() => (selectedPokemon = pokemon)}
			src={imgs[index].url}
			alt={imgs[index].url}
			width={imgs[index].w}
			height={imgs[index].h}
		/>
	{/if}
{/each}

<style>
	.selected {
		border: 2px solid red;
	}
</style>
