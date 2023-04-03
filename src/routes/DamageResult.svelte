<script lang="ts">
	import type { Result } from '../lib/calc/index';
	import { Icons } from '@pkmn/img';

	type Icon = {
		style: string
	}

	export let result: Result;
	let text: string;
	let attackerIcon: Icon, defenderIcon: Icon;
	$: {
	attackerIcon = Icons.getPokemon(result.attacker.name);
	defenderIcon = Icons.getPokemon(result.defender.name);
	text = `${result.moveDesc()}: ${result.kochance().text}`;
	}
</script>

<div class="damage-result">
	<span style={attackerIcon.style} />
	<div class="damage-description">{text}</div>
	<span style={defenderIcon.style} />
</div>


<style>
	.damage-result {
		display: flex;
	}
	.damage-description {
		flex-grow: 1;
	}
</style>