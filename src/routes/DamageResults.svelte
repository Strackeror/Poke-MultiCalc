<script lang="ts">
	import { calculate, Generation, Move, Pokemon, type Result } from '$lib/calc';
	import DamageResult from './DamageResult.svelte';

	export let offense: Pokemon[];
	export let defense: Pokemon[];
	export let gen: Generation;

	let results: Result[] = [];

	$: {
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
