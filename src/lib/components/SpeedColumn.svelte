<script lang="ts">
	import type { Field, Pokemon } from '$lib/calc/';

	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { currentGame } from '$lib/state';

	export let field: Field;
	export let leftTeam: Pokemon[], rightTeam: Pokemon[];

	$: gen = $currentGame.gen;

	enum PokeSide {
		Left,
		Right
	}

	let speeds: { speed: number; pokes: { poke: Pokemon; side: PokeSide }[] }[] = [];
	$: {
		let pokeBySpeed: { [speed: number]: { poke: Pokemon; side: PokeSide }[] } = {};
		for (let poke of leftTeam) {
			let speed = $currentGame.calculateSpeed(gen, poke, field, field.attackerSide);
			if (!(speed in pokeBySpeed)) {
				pokeBySpeed[speed] = [];
			}

			pokeBySpeed[speed].push({ poke, side: PokeSide.Left });
		}
		for (let poke of rightTeam) {
			let speed = $currentGame.calculateSpeed(gen, poke, field, field.defenderSide);
			if (!(speed in pokeBySpeed)) {
				pokeBySpeed[speed] = [];
			}

			pokeBySpeed[speed].push({ poke, side: PokeSide.Right });
		}

		speeds = Object.keys(pokeBySpeed).map((speed) => ({
			speed: Number(speed),
			pokes: pokeBySpeed[Number(speed)]
		}));
		speeds.sort((a, b) => b.speed - a.speed);
	}

	function getSideClass(side: PokeSide) {
		switch (side) {
			case PokeSide.Left:
				return 'left';
			case PokeSide.Right:
				return 'right';
		}
	}
</script>

<div class="main-column">
	<div class="speed-column">Speed</div>
	{#each speeds as speedEntry}
		<div class="speed-column">
			{speedEntry.speed}
			{#each speedEntry.pokes as poke}
				<div class={getSideClass(poke.side)}>
					<PokemonSprite icon={true} pokemon={poke.poke} />
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.main-column {
		text-align: center;
		display: flex;
		flex-direction: column;
		width: 5em;

		border-left: 1px solid black;
		border-right: 1px solid black;
		overflow-y: scroll;
	}
	.speed-column {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid black;
		margin-top: 5px;
		padding-bottom: 5px;
	}

	.left {
		margin-right: 30px;
	}
	.right {
		margin-left: 30px;
	}
</style>
