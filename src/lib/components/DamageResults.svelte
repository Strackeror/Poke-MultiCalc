<script lang="ts">
	import type { Field } from '@smogon/calc';
	import { selectedPokemon, type PokemonState } from '$lib/state';
	import DamageResult from './DamageResult.svelte';

	export let attackers: PokemonState[];
	export let defenders: PokemonState[];
	export let field: Field;
	export let otherSide: boolean = false;
	export let showAll: boolean = false;

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

	let current: readonly [PokemonState, PokemonState][];
	$: {
		if (attackers.includes($selectedPokemon)) current = defenders.map((d) => [$selectedPokemon, d]);
		if (defenders.includes($selectedPokemon)) current = attackers.map((a) => [a, $selectedPokemon]);
	}
</script>

<div class="results">
	{#if !showAll}
		{#each current as [atk, def]}
			{#if (atk.enabled || $selectedPokemon == atk) && (def.enabled || $selectedPokemon == def)}
				<div>
					<DamageResult {atk} {def} field={currentField} />
				</div>
			{/if}
		{/each}
	{:else}
		{#each attackers as atk}
			{#each defenders as def}
				{#if atk.enabled && def.enabled}
					<div>
						<DamageResult {atk} {def} field={currentField} />
					</div>
				{/if}
			{/each}
		{/each}
	{/if}
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
