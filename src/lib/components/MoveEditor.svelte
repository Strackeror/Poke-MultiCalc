<script lang="ts">
	import { Move } from '$lib/calc';
	import { deriveField } from '$lib/state';
	import type { Generation, Type } from '@pkmn/data';
	import { writable, type Writable } from 'svelte/store';

	export let gen: Generation;
	export let move: Move;
	export let moveNames: string[];
	export let types: Type[];

	$: name = move.name;
	function changeMove() {
		move = new Move(gen, name);
	}

	$: category = deriveField(
		writable(),
		(_) => move.overrides?.category ?? move.category,
		(_, category) => {
			move.overrides = { ...move.overrides, category };
		}
	);

	$: type = deriveField(
		writable(),
		(_) => move.overrides?.type ?? move.type,
		(_, type) => {
			move.overrides = { ...move.overrides, type };
		}
	);
  
	$: basePower = deriveField(
		writable(),
		(_) => move.overrides?.basePower ?? move.bp,
		(_, basePower) => {
			move.overrides = { ...move.overrides, basePower };
		}
	);
</script>

<div>
	<select class="move-selector small-select" bind:value={name} on:change={changeMove}>
		<option selected value="">(no move)</option>
		{#each moveNames as moveName}
			<option value={moveName}>{moveName}</option>
		{/each}
	</select>
	<input class="move-bp" type="number" bind:value={$basePower} />
	<select class="move-type" bind:value={$type}>
		<option hidden value="" />
		{#each types as type}
			<option value={type.name}>{type.name}</option>
		{/each}
	</select>
	{#if gen.num >= 4}
		<select bind:value={$category}>
			<option value="Physical">Physical</option>
			<option value="Special">Special</option>
		</select>
	{/if}
	<br />
	<input type="checkbox" id="crit" bind:checked={move.isCrit} />
	<label class="btn crit-btn" for="crit" title="Force this attack to be a critical hit?">Crit</label
	>
	{#if gen.num == 7}
		<input type="checkbox" id="zMove" bind:checked={move.isZ} />
		<label for="zMove" title="Make this attack a Z-move?">Z</label>
	{/if}
	{#if move.hits > 1}
		<select class="move-hits" bind:value={move.hits}>
			<option value={2}>2 hits</option>
			<option value={3}>3 hits</option>
			<option value={4}>4 hits</option>
			<option value={5}>5 hits</option>
		</select>
	{/if}

	{#if move.dropsStats}
		<select
			class="stat-drops calc-trigger hide"
			title="How many times was this move used in a row?"
			bind:value={move.timesUsed}
		>
			<option value={1}>Once</option>
			<option value={2}>Twice</option>
			<option value={3}>3 times</option>
			<option value={4}>4 times</option>
			<option value={5}>5 times</option>
		</select>
	{/if}

	{#if move.timesUsedWithMetronome}
		<select
			class="metronome calc-trigger hide"
			title="How many times was this move successfully and consecutively used while holding Metronome before this turn?"
			bind:value={move.timesUsedWithMetronome}
		>
			<option value={0} selected>Never</option>
			<option value={1}>Once</option>
			<option value={2}>Twice</option>
			<option value={3}>3 times</option>
			<option value={4}>4 times</option>
			<option value={5}>5 times</option>
		</select>
	{/if}
</div>

<style>
	.move-selector {
		width: 9em;
	}

	input[type='number'] {
		width: 3em;
	}
</style>
