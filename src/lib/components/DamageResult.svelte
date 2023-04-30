<script lang="ts">
	import type { Field, Pokemon, Result } from '$lib/calc';
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { currentGame, type PokemonState } from '$lib/state';

	export let atk: PokemonState, def: PokemonState;
	export let field: Field;
	export let open: boolean = false;

	$: gen = $currentGame.gen;

	function totalDmg(res: Result) {
		let [min, max] = res.range();
		return [min * res.move.hits, max * res.move.hits];
	}

	function getResults(atk: Pokemon, def: Pokemon, field: Field): Result[] {
		console.log(`calc ${atk.name} ${def.name}`);
		let results: Result[] = [];
		for (let move of atk.moves) {
			if (move.name.length) {
				results.push($currentGame.calculate(gen, atk, def, move, field));
			}
		}
		results.sort((a, b) => totalDmg(b)[1] - totalDmg(a)[1]);
		return results;
	}

	function showFolded(result: Result, _index: any, results: Result[]) {
		// Always show priority KOs
		if (result.move.priority > 0 && totalDmg(result)[1] > result.defender.curHP()) {
			return true;
		}

		// Always show overlapped max rolls
		if (totalDmg(result)[1] > totalDmg(results[0])[0]) {
			return true;
		}
		return false;
	}

	$: results = getResults($atk, $def, field);
	$: foldedResults = results.filter(showFolded);

	let folded = !open;
	function description(res: Result) {
		if (totalDmg(res)[1] == 0) return '';
		return `${res.moveDesc()}: ${res.kochance(false).text}\n`;
	}

	function damageRolls(res: Result) {
		if (totalDmg(res)[1] == 0) return '';
		return res.damage + '\n';
	}
</script>

{#if results.length > 0}
	<div class="damage-results">
		<button class="damage-result" on:click={() => (folded = !folded)}>
			<PokemonSprite pokemon={foldedResults[0].attacker} icon={true} />
			<div>
				{#if folded}
					{#each foldedResults as result}
						<div class="damage-description">
							<b>{result.move.name}</b><br />
							{description(result)}
						</div>
					{/each}
				{:else}
					{#each results as result}
						<div class="damage-description folded">
							<b>{result.move.name}</b><br />
							{description(result)}
							{damageRolls(result)}
						</div>
					{/each}
				{/if}
			</div>
			<PokemonSprite pokemon={foldedResults[0].defender} icon={true} />
		</button>
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
		white-space: pre-line;
	}
</style>
