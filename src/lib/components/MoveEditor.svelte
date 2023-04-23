<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	import { Move } from '$lib/calc';
	import type { Generation, MoveCategory, Type, TypeName } from '@pkmn/data';

	export let gen: Generation;
	export let move: Move;
	export let moveNames: string[];
	export let types: Type[];

	let uniqueId = counter++;

	$: name = move.name;
	function changeMove(name: string) {
		move = new Move(gen, name);
	}

	$: category = move.overrides?.category ?? move.category;
	function updateCategory(value: string) {
		let category = value as MoveCategory;
		move.overrides = { ...move.overrides, category };
	}

	$: type = move.overrides?.type ?? move.type;
	function updateType(value: string) {
		let type = value as TypeName;
		move.overrides = { ...move.overrides, type };
	}

	$: basePower = move.overrides?.basePower ?? move.bp;
	function updateBp(value: string) {
		let basePower = +value;
		move.overrides = { ...move.overrides, basePower };
	}

	let hits: number[];
	$: {
		let multihit = gen.moves.get(move.name)?.multihit;
		if (!multihit) hits = [1];
		else if (typeof multihit == 'number') hits = [multihit];
		else {
			hits = [];
			for (let i = multihit[0]; i <= multihit[1]; ++i) hits.push(i)
		}
	}
</script>

<div>
	<select
		class="move-selector small-select"
		value={name}
		on:change={(e) => changeMove(e.currentTarget.value)}
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
		on:input={(e) => updateBp(e.currentTarget.value)}
	/>
	<select class="move-type" value={type} on:change={(e) => updateType(e.currentTarget.value)}>
		<option hidden value="" />
		{#each types as type}
			<option value={type.name}>{type.name}</option>
		{/each}
	</select>
	{#if gen.num >= 4}
		<select value={category} on:change={(e) => updateCategory(e.currentTarget.value)}>
			<option value="Physical">Physical</option>
			<option value="Special">Special</option>
		</select>
	{/if}
	<br />
	<input type="checkbox" id="crit{uniqueId}" bind:checked={move.isCrit} />
	<label class="btn crit-btn" for="crit{uniqueId}" title="Force this attack to be a critical hit?"
		>Crit</label
	>
	{#if gen.num == 7}
		<input type="checkbox" id="zMove{uniqueId}" bind:checked={move.useZ} />
		<label for="zMove{uniqueId}" title="Make this attack a Z-move?">Z</label>
	{/if}
	
	{#if gen.num == 8}
		<input type="checkbox" id="maxMove{uniqueId}" bind:checked={move.useMax} />
		<label for="maxMove{uniqueId}" title="Make this attack a max attack?">Max</label>
	{/if}


	{#if hits.length > 1}
		<select class="move-hits" bind:value={move.hits}>
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
		>
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
