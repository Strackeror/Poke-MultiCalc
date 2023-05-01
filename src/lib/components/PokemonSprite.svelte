<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import { Icons, Sprites } from '@pkmn/img';
	import { createEventDispatcher } from 'svelte';

	export let icon: boolean = false;
	export let pokemon: Pokemon;
	export let selected: boolean = false;
	export let disabled: boolean = false;

	const event = createEventDispatcher();

	const Aliases: {[id: string]: string} = {
		"Minior-Red": "Minior"
	}

	let species: string = "";
	$: {
		species = pokemon.species.name;
		if (pokemon.species.name in Aliases) species = Aliases[species];
 		if (pokemon.species.name.endsWith("-Totem")) species = species.slice(0, -6);
	}
</script>

<button class:selected on:click={() => event('clicked')}>
	{#if icon}
		<span class="pokeicon" style={Icons.getPokemon(species).style} />
	{:else}
		{@const img = Sprites.getPokemon(species, {gen: "gen5"})}
		<img class:disabled src={img.url} alt={species} width={img.w} height={img.h} />
		{#if pokemon.item}
			{@const item = Icons.getItem(pokemon.item)}
			<span class:disabled class="itemicon" style={item.style}/>
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

	.disabled {
		opacity: 0.4;
	}

	.itemicon {
		position: absolute;
		bottom: 5px;
		right: 5px;
	}

</style>
