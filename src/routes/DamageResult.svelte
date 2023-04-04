<script lang="ts">
	import type { Result } from '../lib/calc/index';
	import { Icons } from '@pkmn/img';

	type Icon = {
		style: string;
	};

	export let result: Result;
	let text: string;
	let attackerIcon: Icon, defenderIcon: Icon;
	$: {
		attackerIcon = Icons.getPokemon(result.attacker.species.name);
		defenderIcon = Icons.getPokemon(result.defender.species.name);
		text = `${result.moveDesc()}: ${result.kochance().text}`;
	}
</script>

<div class="damage-result">
	<span style={attackerIcon.style} class="poke-icon" />
	<div class="damage-description">
		{result.move.name}<br>
		{text}
	</div>
	<span style={defenderIcon.style} class="poke-icon" />
</div>

<style>
	.damage-result {
		display: flex;
		align-items: center;
	}
	.damage-description {
		flex-grow: 1;
	}
	.poke-icon {
		margin-bottom: 5px;
	}
</style>
