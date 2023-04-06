<script lang="ts">
	import { calculate, Field, Move, Pokemon, type Result } from '$lib/calc';
	import type { Generation } from '@pkmn/data';
	import DamageResult from './DamageResult.svelte';

	
	export let offense: Pokemon[];
	export let defense: Pokemon[];
	export let gen: Generation;
	export let field: Field;
	export let otherSide: boolean = false;

	let results: Result[] = [];

	$: {
		let curField = field;
		if (otherSide) {
			curField = field.clone()
		  let newSides = [curField.defenderSide, curField.attackerSide]
			curField.attackerSide = newSides[0];
			curField.defenderSide = newSides[1];
		}
		results = [];
		for (let offensePoke of offense) {
			for (let defensePoke of defense) {
				let bestResult: Result | undefined = undefined;
				for (let moveName of offensePoke.moves) {
					let move = new Move(gen, moveName);
					let result = calculate(gen, offensePoke, defensePoke, move, curField);
					if (!bestResult || result.range()[0] > bestResult.range()[0]) {
						bestResult = result;
					}
				}
				if (bestResult) {
					results.push(bestResult);
				}
			}
		}
	}
</script>

<div class="results">
	{#each results as result}
		<div><DamageResult {result} /></div>
	{/each}
</div>

<style>
	.results {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		overflow: auto;
	}

	.results > div {
		border-bottom: 1px solid black;
	}
	.results > div:last-of-type {
		border-bottom: 0px;
	}
</style>
