<script lang="ts">
	import type { Pokemon } from '$lib/pokemon';
	import type { Field } from '@smogon/calc/';

	import PokemonSprite from '$lib/components/PokemonSprite.svelte';
	import { currentGame, PokemonState, selectedPokemon } from '$lib/state';

	interface Props {
		field: Field;
		leftTeam: PokemonState[];
		rightTeam: PokemonState[];
	}

	let { field, leftTeam, rightTeam }: Props = $props();

	let gen = $derived($currentGame.gen);

	type PokeSide = 'Left' | 'Right';

	let pokemon = $derived($selectedPokemon);
	let speeds: { speed: number; pokes: { poke: Pokemon; side: PokeSide }[] }[] = $derived.by(() => {
		let _ = [$pokemon];
		console.log('speedsupdated');
		let pokeBySpeed: { [speed: number]: { poke: Pokemon; side: PokeSide }[] } = {};
		for (let poke of leftTeam) {
			let speed = $currentGame.calculateSpeed(gen, poke.pokemon, field, field.attackerSide);
			if (!(speed in pokeBySpeed)) {
				pokeBySpeed[speed] = [];
			}

			pokeBySpeed[speed].push({ poke: poke.pokemon, side: 'Left' });
		}
		for (let poke of rightTeam) {
			let speed = $currentGame.calculateSpeed(gen, poke.pokemon, field, field.defenderSide);
			if (!(speed in pokeBySpeed)) {
				pokeBySpeed[speed] = [];
			}

			pokeBySpeed[speed].push({ poke: poke.pokemon, side: 'Right' });
		}

		let newSpeeds = Object.keys(pokeBySpeed).map((speed) => ({
			speed: Number(speed),
			pokes: pokeBySpeed[Number(speed)]
		}));
		newSpeeds.sort((a, b) => b.speed - a.speed);
		return newSpeeds;
	});

	function getSideClass(side: PokeSide) {
		switch (side) {
			case 'Left':
				return 'left';
			case 'Right':
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
