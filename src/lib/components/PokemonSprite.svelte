<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import { Icons, Sprites } from '@pkmn/img';
	import { createEventDispatcher } from 'svelte';

	export let icon: boolean = false;
	export let pokemon: Pokemon;
	export let selected: boolean = false;

	const event = createEventDispatcher();

	let img: {
		gen: number;
		w: number;
		h: number;
		url: string;
		pixelated: boolean;
	};
	$: {
		if (!icon) {
			img = Sprites.getPokemon(pokemon.species.name, { gen: 'gen5' });
		}
	}
</script>

<button on:click={() => event('clicked')}>
	{#if icon}
		<span class:selected style={Icons.getPokemon(pokemon.species.name).style} />
	{:else}
		<img class:selected src={img.url} alt={pokemon.species.name} width={img.w} height={img.h} />
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
	}
	img {
		border-radius: 8px;
	}
	span {
		border-radius: 4px;
	}
	.selected {
		background-color: darkgray;
	}
</style>
