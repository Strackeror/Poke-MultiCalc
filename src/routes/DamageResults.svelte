<script lang="ts">
	import { calculate, Generations, type Result } from '$lib/calc';
	import { Move } from '$lib/calc/move';
	import type { Pokemon } from '$lib/calc/pokemon';
	import type { GenerationNum } from '@pkmn/dex';
	import DamageResult from './DamageResult.svelte';

	export let offense: Pokemon[];
	export let defense: Pokemon[];
  export let genNo: GenerationNum = 9;

	let results: Result[] = [];

	$: {
    let gen = Generations.get(genNo);
    results = []
		for (let offensePoke of offense) {
			for (let defensePoke of defense) {
				for (let moveName of offensePoke.moves) {
          let move = new Move(gen, moveName);
          results.push(calculate(gen, offensePoke, defensePoke, move));
				}
			}
		}
	}
</script>

<div class="team">
  {#each results as result}
    <DamageResult result={result}/>
  {/each}
</div>

<style>
  .team {
    display: flex;
  }
</style>
