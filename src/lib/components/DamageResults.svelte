<script lang="ts">
	import type { Field } from '$lib/calc';
	import type { Generation } from '@pkmn/data';
	import DamageResult from './DamageResult.svelte';
	import type { PokemonState } from '$lib/state';

	export let attackers: PokemonState[];
	export let defenders: PokemonState[];
	export let field: Field;
	export let otherSide: boolean = false;

	let currentField: Field;
	$: {
		if (!otherSide) {
			currentField = field;
		} else {
			currentField = field.clone();
			let newSides = [currentField.defenderSide, currentField.attackerSide];
			currentField.attackerSide = newSides[0];
			currentField.defenderSide = newSides[1];
		}
	}
</script>

<div class="results">
	{#each attackers as atk}
		{#each defenders as def}
			<div>
				<DamageResult {atk} {def} field={currentField} />
			</div>
		{/each}
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
