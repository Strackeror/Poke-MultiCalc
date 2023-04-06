<script lang="ts">
	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import type { Result } from '../lib/calc/index';
	export let result: Result;
	let text: string;
	$: {
		text = `${result.moveDesc()}: ${result.kochance(false).text}`;
	}
</script>

<div class="damage-result">
	<PokemonSprite pokemon={result.attacker} icon={true} />
	<div class="damage-description">
		{result.move.name}<br />
		{text}
	</div>
	<PokemonSprite pokemon={result.defender} icon={true} />
</div>

<style>
	.damage-result {
		display: flex;
		align-items: center;
		margin: 2px 0px;
	}
	.damage-description {
		flex-grow: 1;
		margin: 0px 3px;
		margin-bottom: 5px;
	}
</style>
