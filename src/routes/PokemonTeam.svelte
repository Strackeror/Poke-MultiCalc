<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { Sprites } from '@pkmn/img';

	export let pokemons: Pokemon[];
	export let selectedPokemon: Pokemon;

	let imgs: any[] = [];
	$: imgs = pokemons.map((poke) => Sprites.getPokemon(poke.species.name, {gen: "gen5"}));
</script>

<div>
{#each pokemons as pokemon}
	<PokemonSprite pokemon={pokemon} bind:selectedPokemon={selectedPokemon}/>
{/each}
</div>
<style>
	div {
		height: 96px;
	}
</style>
