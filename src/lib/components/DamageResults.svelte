<script lang="ts">
	import type { Field } from '@smogon/calc';
	import { selectedPokemon, type PokemonState } from '$lib/state';
	import DamageResult from './DamageResult.svelte';

	interface Props {
		attackers: PokemonState[];
		defenders: PokemonState[];
		field: Field;
		otherSide?: boolean;
		showAll?: boolean;
	}

	let { attackers, defenders, field, otherSide = false, showAll = false }: Props = $props();

	let currentField: Field = $derived.by(() => {
		if (!otherSide) {
			return field.clone();
		}

		let newField = field.clone();
		let newSides = [newField.defenderSide, newField.attackerSide];
		newField.attackerSide = newSides[0];
		newField.defenderSide = newSides[1];
		return newField;
	});

	let current: readonly [PokemonState, PokemonState][] = $derived.by(() => {
		if (attackers.includes($selectedPokemon)) return defenders.map((d) => [$selectedPokemon, d]);
		if (defenders.includes($selectedPokemon)) return attackers.map((a) => [a, $selectedPokemon]);
		return [];
	});

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
		padding-top: 18px;
		padding-left: 5px;
		padding-right: 5px;
	}


</style>
