<script lang="ts">
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { calculate, type Result, type Pokemon, Field } from '$lib/calc';
	import type { PokemonState } from '$lib/state';
	import type { Generation } from '@pkmn/data';

	export let atk: PokemonState, def: PokemonState;
	export let gen: Generation;
	export let field: Field;

	function getResults(atk: Pokemon, def: Pokemon): Result[] {
		console.log(`calc ${atk.name} ${def.name}`);
		let results: Result[] = [];
		for (let move of atk.moves) {
			if (move) results.push(calculate(gen, atk, def, move, field));
		}
		results.sort((a, b) => b.range()[0] - a.range()[0]);
		return results;
	}

	$: results = getResults($atk, $def);
	let showOthers: boolean = false;

	function description(res: Result) {
		return `${res.moveDesc()}: ${res.kochance(false).text}`;
	}
</script>

<div class="damage-results">
	{#if results.length > 0}
		<button class="damage-result" on:click={() => (showOthers = !showOthers)}>
			<PokemonSprite pokemon={results[0].attacker} icon={true} />
			<div class="damage-description">
				{results[0].move.name}<br />
				{description(results[0])}
			</div>
			<PokemonSprite pokemon={results[0].defender} icon={true} />
		</button>
	{/if}
	{#if showOthers}
		{#each results.slice(1, 4) as result}
			<div class="damage-description folded">
				{result.move.name}<br />
				{description(result)}
			</div>
		{/each}
	{/if}
</div>

<style>
	button {
		font-size: 100%;
		font-family: inherit;
		background: none;
		border: 0;
		padding: 0;
		text-align: inherit;
	}
	.damage-result {
		display: flex;
		align-items: center;
	}

	.damage-results:hover {
		background-color: lightgray;
	}

	.damage-description {
		flex-grow: 1;
		margin: 0px 3px;
		margin-bottom: 5px;
	}
	.folded {
		margin-left: 48px;
	}
</style>
