<script lang="ts">
	import { calculate, Field, Move, Pokemon, type Result } from '$lib/calc';
	import type { Generation } from '@pkmn/data';
	import DamageResult from './DamageResult.svelte';

	export let offense: Pokemon[];
	export let defense: Pokemon[];
	export let gen: Generation;
	export let field: Field;
	export let otherSide: boolean = false;

	let currentField: Field;
	$: {
		if (otherSide) {
			currentField = field;
		} else {
			currentField = field.clone();
			let newSides = [currentField.defenderSide, currentField.attackerSide];
			currentField.attackerSide = newSides[0];
			currentField.defenderSide = newSides[1];
		}
	}

	let pokePairs: [Pokemon, Pokemon][]
	$: {
		pokePairs = [];
		for (let offensePoke of offense) {
			for (let defensePoke of defense) {
				pokePairs.push([offensePoke, defensePoke])
			}
		}
	}

	function getResults(atk: Pokemon, def: Pokemon): Result[] {
		let pokeResults = [];
		for (let move of atk.moves) {
			pokeResults.push(calculate(gen, atk, def, move, currentField))
		}
		return pokeResults;
	}
</script>

<div class="results">
	{#each pokePairs as [atk, def]}
		{@const results = getResults(atk, def)}
		{#if results.length > 0}
			<div><DamageResult results={getResults(atk, def)} /></div>
		{/if}
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
