<script lang="ts">
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import type { Result } from '../lib/calc/index';

	export let results: Result[];

	let showOthers: boolean = false;

	$: {
		results.sort((a, b) => b.range()?.[0]- a.range()?.[0]);
	}

	function description(res: Result) {
		return `${res.moveDesc()}: ${res.kochance(false).text}`;
	}
</script>

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
