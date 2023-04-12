<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import { Icons, Sprites } from '@pkmn/img';
	import { createEventDispatcher } from 'svelte';

	export let icon: boolean = false;
	export let pokemon: Pokemon;
	export let selected: boolean = false;

	const event = createEventDispatcher();
</script>

<button class:selected on:click={() => event('clicked')}>
	{#if icon}
		<span class="pokeicon" style={Icons.getPokemon(pokemon.species.name).style} />
	{:else}
		{@const img = Sprites.getPokemon(pokemon.species.name, {gen: "gen5"})}
		<img src={img.url} alt={pokemon.species.name} width={img.w} height={img.h} />
		{#if pokemon.item}
			{@const item = Icons.getItem(pokemon.item)}
			<span class="itemicon" style={item.style}/>
		{/if}
	{/if}
</button>

<style>
	button {
		font-size: 100%;
		font-family: inherit;
		background: none;
		border: 0;
		padding: 0;
		text-align: inherit;
		position: relative;
	}
	img {
		border-radius: 8px;
	}
	.pokeicon {
		border-radius: 4px;
	}
	.selected {
		background-color: darkgray;
	}

	.itemicon {
		position: absolute;
		bottom: 5px;
		right: 5px;
	}

</style>
