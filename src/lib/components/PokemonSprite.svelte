<script lang="ts">
	import type { Pokemon } from '$lib/pokemon';
	import { currentGame } from '$lib/state';
	import { Icons, Sprites } from '@pkmn/img';

	interface Props {
		icon?: boolean;
		pokemon: Pokemon;
		selected?: boolean;
		disabled?: boolean;
		clicked?: () => void;
	}

	let {
		icon = false,
		pokemon,
		selected = false,
		disabled = false,
		clicked = () => {}
	}: Props = $props();

	let clickable = $derived(clicked != undefined)

	const Aliases: { [id: string]: string } = {
		'Minior-Red': 'Minior'
	};

	let species: string = $derived.by(() => {
		let species = pokemon.species.name;
		if (species in Aliases) return Aliases[species];
		if (species.endsWith('-Totem')) return species.slice(0, -6);
		return species;
	});
	let override: [string, string] | undefined = $derived($currentGame.spriteOverrides[species]);
</script>

<button class:selected class:clickable onclick={clicked}>
	{#if icon}
		{#if override}
			<img class="pokeicon" src={override[1]} alt={species} />
		{:else}
			<span class="pokeicon" style={Icons.getPokemon(species).style}></span>
		{/if}
	{:else}
		{#if override}
			<img class:disabled src={override[0]} alt={species} height="100" width="100" />
		{:else}
			{@const img = Sprites.getPokemon(species, { gen: 'gen5' })}
			<img class:disabled src={img.url} alt={species} width={img.w} height={img.h} />
		{/if}
		{#if pokemon.item}
			{@const item = Icons.getItem(pokemon.item)}
			<span class:disabled class="itemicon" style={item.style}></span>
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
	.selected {
		background-color: darkgray;
	}
	.clickable :hover {
		background-color: lightgray;
	}
	.disabled {
		opacity: 0.4;
	}
	.itemicon {
		pointer-events: none;
		position: absolute;
		bottom: 5px;
		right: 5px;
	}
</style>
