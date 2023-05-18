<script lang="ts">
	import type { Field, Pokemon, Result } from '$lib/calc';
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { currentGame, openedPair, type PokemonState } from '$lib/state';

	export let atk: PokemonState, def: PokemonState;
	export let field: Field;

	$: gen = $currentGame.gen;

	let folded: boolean = true;
	$: {
		if (!$openedPair) folded = true;
		else if ($openedPair[0] == atk && $openedPair[1] == def) folded = false;
		else if ($openedPair[0] == def && $openedPair[1] == atk) folded = false;
		else folded = true;
	}

	function toggleFolded() {
		if (folded) $openedPair = [atk, def];
		else $openedPair = undefined;
	}

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
		// Show potential KOs
		if (totalDmg(result)[1] > result.defender.curHP()) {
			return true;
		}

		// Show overlapped max rolls
		if (totalDmg(result)[1] > totalDmg(results[0])[0]) {
			return true;
		}
		return false;
	}

	$: results = getResults($atk, $def, field);
	$: foldedResults = results.filter(showFolded);

	function description(res: Result) {
		if (totalDmg(res)[1] == 0) return '';
		let isCrit = res.move.isCrit ? ' (Crit)' : '';
		return `${res.moveDesc()}: ${res.kochance(false).text}${isCrit}\n`;
	}

	function damageRolls(res: Result) {
		if (totalDmg(res)[1] == 0) return '';
		return res.damage + '\n';
	}

	function quickDesc(res: Result): string {
		let desc = ` ${res.move.bp || ''} ${res.move.type} ${res.move.category}`;
	
		if (res.move.priority > 0) desc += ` +${res.move.priority}`;
		else if (res.move.priority < 0) desc += ` ${res.move.priority}`;

		return desc
	}
</script>

{#if results.length > 0}
	<div class="damage-results">
		<button class="damage-result" on:click={toggleFolded}>
			<div class="icon">
				<PokemonSprite pokemon={$atk} icon={true} />
			</div>
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
							<b>{result.move.name}</b> - <span class="move-desc">{quickDesc(result)}</span><br />
							{description(result)}
							<span class="damage-rolls">{damageRolls(result)}</span>
						</div>
					{/each}
				{/if}
			</div>
			<div class="icon">
				<PokemonSprite pokemon={$def} icon={true} />
			</div>
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
		align-items: flex-start;
	}

	.damage-results:hover {
		background-color: lightgray;
	}

	.damage-description {
		margin: 2px 3px;
		line-height: 1.25em;
		padding-bottom: 5px;
		white-space: pre-line;
	}

	.move-desc {
		font-size: 90%;
	}

	.damage-rolls {
		font-size: 90%;
	}

	.icon {
		margin-top: 6px;
	}
</style>
