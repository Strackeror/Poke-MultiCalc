<script lang="ts">
	import type { Pokemon } from '$lib/calc/pokemon';
	import { Sprites } from '@pkmn/img';

	export let pokemons: Pokemon[];
	let imgs: any[] = [];
  $: imgs = pokemons.map((poke) => Sprites.getPokemon(poke.name));

</script>

{#each imgs as sprite}
	<img src={sprite.url} alt={sprite.url} width={sprite.w} height={sprite.h} />
{/each}
