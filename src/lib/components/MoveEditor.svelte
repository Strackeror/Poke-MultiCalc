<script module>
	let counter = 0;
</script>

<script lang="ts">
	import type { Pokemon } from '$lib/pokemon';
	import { Move, toID } from '@smogon/calc';
	import type { Generation, MoveCategory, Type, TypeName } from '@smogon/calc/dist/data/interface';

	interface Props {
		gen: Generation;
		move: Move;
		poke: Pokemon;
		moveNames: string[];
		types: Type[];
		changed: (_: Move) => void;
	}

	let { gen, move = $bindable(), poke, moveNames, types, changed }: Props = $props();

	let uniqueId = counter++;

	function notifyChanged() {
		changed(move);
	}

	let name = $derived(move.name);
	function changeMove(name: string) {
		move = new Move(gen, name, {
			species: poke.species.name,
			ability: poke.ability,
			item: poke.item
		});
		notifyChanged();
	}

	let category = $derived(move.overrides?.category ?? move.category);
	function updateCategory(value: string) {
		let category = value as MoveCategory;
		move.overrides = { ...move.overrides, category };
		notifyChanged();
	}

	let type = $derived(move.overrides?.type ?? move.type);
	function updateType(value: string) {
		let type = value as TypeName;
		move.overrides = { ...move.overrides, type };
		notifyChanged();
	}

	let basePower = $derived(move.overrides?.basePower ?? move.bp);
	function updateBp(value: string) {
		let basePower = +value;
		move.overrides = { ...move.overrides, basePower };
		notifyChanged();
	}

	let hits: number[] = $derived.by(() => {
		let multihit = gen.moves.get(toID(move.name))?.multihit;
		if (!multihit) return [1];
		else if (typeof multihit == 'number') return [multihit];
		else return [...multihit];
	});
</script>

<div>
	<select
		class="move-selector small-select"
		value={name}
		onchange={(e) => changeMove(e.currentTarget.value)}
	>
		<option selected value="">(no move)</option>
		{#each moveNames as moveName}
			<option value={moveName}>{moveName}</option>
		{/each}
	</select>
	<input
		class="move-bp"
		type="number"
		value={basePower}
		oninput={(e) => updateBp(e.currentTarget.value)}
	/>
	<select class="move-type" value={type} onchange={(e) => updateType(e.currentTarget.value)}>
		<option hidden value=""></option>
		{#each types as type}
			<option value={type.name}>{type.name}</option>
		{/each}
	</select>
	{#if gen.num >= 4}
		<select value={category} onchange={(e) => updateCategory(e.currentTarget.value)}>
			<option value="Physical">Physical</option>
			<option value="Special">Special</option>
		</select>
	{/if}
	<br />
	<input type="checkbox" id="crit{uniqueId}" bind:checked={move.isCrit} onchange={notifyChanged} />
	<label class="btn crit-btn" for="crit{uniqueId}" title="Force this attack to be a critical hit?"
		>Crit</label
	>
	{#if gen.num == 7}
		<input type="checkbox" id="zMove{uniqueId}" bind:checked={move.useZ} onchange={notifyChanged} />
		<label for="zMove{uniqueId}" title="Make this attack a Z-move?">Z</label>
	{/if}

	{#if gen.num == 8}
		<input
			type="checkbox"
			id="maxMove{uniqueId}"
			bind:checked={move.useMax}
			onchange={notifyChanged}
		/>
		<label for="maxMove{uniqueId}" title="Make this attack a max attack?">Max</label>
	{/if}

	{#if hits.length > 1}
		<select class="move-hits" bind:value={move.hits} onchange={notifyChanged}>
			{#each hits as hitCount}
				<option value={hitCount}>{hitCount} hits</option>
			{/each}
		</select>
	{/if}

	{#if move.dropsStats}
		<select
			class="stat-drops calc-trigger hide"
			title="How many times was this move used in a row?"
			bind:value={move.timesUsed}
			onchange={notifyChanged}
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
			onchange={notifyChanged}
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
