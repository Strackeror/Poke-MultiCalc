<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import { Icons, Sprites } from '@pkmn/img';

	export let icon: boolean = false;
	export let pokemon: Pokemon;
	export let selectedPokemon: Pokemon | undefined = undefined;
	export let hoveredPokemon: Pokemon | undefined = undefined;

	let selectedClass: string;
	$: {
		selectedClass = selectedPokemon == pokemon ? 'selected' : '';
	}

	let img: {
		gen: number;
		w: number;
		h: number;
		url: string;
		pixelated: boolean;
	};
	$: {
		if (!icon) {
			img = Sprites.getPokemon(pokemon.species.name, {gen: "gen5"});
		}
	}
</script>

{#if icon}
	<span class={selectedClass} style={Icons.getPokemon(pokemon.species.name).style} />
{:else}
	<img
		class={selectedClass}
		on:click={() => (selectedPokemon = pokemon)}
		src={img.url}
		alt={pokemon.species.name }
		width={img.w}
		height={img.h}
	/>
{/if}



<style>
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
