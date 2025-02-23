<script lang="ts">
	import type { Pokemon } from '$lib/pokemon';
	import type { Field, Result } from '$lib/calc';
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { currentGame, openedPair, type PokemonState } from '$lib/state';

	interface Props {
		atk: PokemonState;
		def: PokemonState;
		field: Field;
	}

	let { atk, def, field }: Props = $props();

	let gen = $derived($currentGame.gen);

	const folded: boolean = $derived.by(() => {
		if (!$openedPair) return true;
		else if ($openedPair[0] == atk && $openedPair[1] == def) return false;
		else if ($openedPair[0] == def && $openedPair[1] == atk) return false;
		else return true;
	});

	function toggleFolded() {
		if (folded) $openedPair = [atk, def];
		else $openedPair = undefined;
	}

	function totalDmg(res: Result) {
		return res.range();
	}

	function getResults(atk: Pokemon, def: Pokemon, field: Field): Result[] {
		console.log(`calc ${atk.name} ${def.name}`);
		let results: Result[] = [];
		for (let move of atk.moveStates) {
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

	let results = $derived(getResults($atk, $def, field));
	let foldedResults = $derived(results.filter(showFolded));

	function description(res: Result) {
		if (totalDmg(res)[1] == 0) return '';
		let isCrit = res.move.isCrit ? ' (Crit)' : '';
		let hits = res.move.hits > 1 ? ` (${res.move.hits} hits)` : '';
		return `${res.moveDesc()}: ${res.kochance(false).text}${isCrit}${hits}\n`;
	}

	function damageRolls(res: Result) {
		if (totalDmg(res)[1] == 0) return '';
		return res.damage + '\n';
	}

	function quickDesc(res: Result): string {
		let desc = ` ${res.move.bp || ''} ${res.move.type} ${res.move.category}`;

		if (res.move.priority > 0) desc += ` +${res.move.priority}`;
		else if (res.move.priority < 0) desc += ` ${res.move.priority}`;

		return desc;
	}
</script>

{#if results.length > 0}
	<div class="damage-results">
		<button class="damage-result" onclick={toggleFolded}>
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
		background: #222;
		display: flex;
		align-items: flex-start;
		border-radius: 3px;
		box-shadow: 3px 3px 5px #0b0b0b;
		margin-bottom: 10px;
	}

	.damage-result:hover {
		background: #333;
		box-shadow: 3px 3px 5px #0b0b0b;
	}

	.damage-description {
		margin: 2px 3px;
		line-height: 1.25em;
		padding-bottom: 5px;
		white-space: pre-line;
	}

	.damage-results {
		padding-right: 3px;
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
