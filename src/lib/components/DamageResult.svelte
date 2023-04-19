<script lang="ts">
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { calculate, type Result, type Pokemon, Field } from '$lib/calc';
	import { currentGame, type PokemonState } from '$lib/state';

	export let atk: PokemonState, def: PokemonState;
	export let field: Field;

	$: gen = $currentGame.gen;

	function getResults(atk: Pokemon, def: Pokemon, field: Field): Result[] {
		console.log(`calc ${atk.name} ${def.name}`);
		let results: Result[] = [];
		for (let move of atk.moves) {
			if (move.name.length) {
				results.push(calculate(gen, atk, def, move, field));
			}
		}
		results.sort((a, b) => b.range()[0] - a.range()[0]);
		return results;
	}

	$: results = getResults($atk, $def, field);
	let showOthers: boolean = false;

	function description(res: Result) {
		return `${res.moveDesc()}: ${res.kochance(false).text}`;
	}
</script>

{#if results.length > 0}
	<div class="damage-results">
		<button class="damage-result" on:click={() => (showOthers = !showOthers)}>
			<PokemonSprite pokemon={results[0].attacker} icon={true} />
			<div class="damage-description">
				{results[0].move.name}<br />
				{description(results[0])}
			</div>
			<PokemonSprite pokemon={results[0].defender} icon={true} />
		</button>

		{#if showOthers}
			<div class="main-damage folded">{results[0].damage}</div>
			{#each results.slice(1) as result}
				<div class="damage-description folded">
					{result.move.name}<br />
					{description(result)} <br />
					{result.damage}
				</div>
			{/each}
		{/if}
	</div>
{/if}

<style>
	button {
		font-size: 100%;
		font-family: inherit;
		background: none;
		border: 0;
		padding: 0;
		text-align: inherit;
		padding-top: 3px;
		width: 100%;
	}
	.damage-result {
		display: flex;
		align-items: center;
	}

	.damage-results:hover {
		background-color: lightgray;
	}

	.damage-description {
		margin: 0px 3px;
		padding-bottom: 5px;
	}

	.damage-description.folded {
		padding-top: 8px;
	}

	.folded {
		margin-left: 48px;
	}
</style>
