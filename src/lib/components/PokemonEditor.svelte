<script lang="ts">
	import { Pokemon, Move, calcStat } from '$lib/calc';
	import type { Generation, Type, Item, Specie, MoveCategory, TypeName } from '@pkmn/data';

	export let gen: Generation;
	export let pokemon: Pokemon;

	let species: readonly Specie[] = [];
	let types: Type[] = [];
	let abilities: string[] = [];
	let moves: string[] = [];
	let items: readonly Item[] = [];
	$: {
		types = [...gen.types];
		abilities = [...gen.abilities].map((a) => a.name);
		items = [...gen.items];
		species = [...gen.species].sort((a, b) => a.name.localeCompare(b.name));
		moves = [...gen.moves].map((m) => m.name).sort();
	}

	class MoveProxy {
		public move: Move;
		constructor(move: Move) {
			this.move = move;
			this.name = move.name;
		}

		public name: string;
		public get category() {
			return this.move.overrides?.category ?? this.move.category;
		}
		public set category(category: MoveCategory) {
			this.move.overrides = { ...this.move.overrides, category };
		}

		public get type() {
			return this.move.overrides?.type ?? this.move.type;
		}
		public set type(type: TypeName) {
			this.move.overrides = { ...this.move.overrides, type };
		}

		public get basePower() {
			return this.move.overrides?.basePower ?? this.move.bp;
		}
		public set basePower(basePower: number) {
			this.move.overrides = { ...this.move.overrides, basePower };
		}

	}

	let moveProxies: MoveProxy[];
	$: {
		moveProxies = [];
		for (let i of [0, 1, 2, 3]) {
			let proxy = new MoveProxy(pokemon.moves[i] ?? new Move(gen, ''));
			moveProxies.push(proxy);
		}
	}

	$: {
		let hpRatio = pokemon.curHP() / pokemon.maxHP();
		for (let stat of gen.stats) {
			pokemon.rawStats[stat] = calcStat(
				gen,
				stat,
				pokemon.species.baseStats[stat],
				pokemon.ivs[stat],
				pokemon.evs[stat],
				pokemon.level,
				pokemon.nature
			);
		}
		pokemon.originalCurHP = Math.floor(pokemon.maxHP() * hpRatio);
	}

	let percentHp: number;
	$: {
		percentHp = Math.round((pokemon.curHP() / pokemon.maxHP()) * 100);
	}

	function genCheck(gens: number[]) {
		if (!gens.includes(gen.num)) {
			return 'hide';
		}
		return '';
	}

	let currentSpecies: string = '';
	$: {
		currentSpecies = pokemon.species.name;
	}
	function setSpecies() {
		let species = gen.species.get(currentSpecies);
		if (species) {
			pokemon.species = species;
		}
	}
</script>

<div class="panel-body poke-info">
	<div class="info-group top">
		<div>
			<div class="edit">Species</div>
			<select bind:value={currentSpecies} on:change={setSpecies}>
				{#each species as specie}
					<option value={specie.name}>{specie.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<div class="edit">Type</div>
			<select class="type1 terrain-trigger" bind:value={pokemon.types[0]}>
				{#each types as type}
					<option value={type.name}>{type.name}</option>
				{/each}
			</select>
			<select class="type2 terrain-trigger" bind:value={pokemon.types[1]}>
				{#each types as type}
					<option value={type.name}>{type.name}</option>
				{/each}
			</select>
		</div>
		<div class="hide">
			<div class="edit">Forme</div>
			<select class="forme calc-trigger" />
		</div>
		<div class="hide">
			<div class="edit">Gender</div>
			<select class="gender calc-trigger"
				><option /><option>Male</option><option>Female</option></select
			>
		</div>
		<div>
			<div class="edit">Level</div>
			<input class="level" type="number" min="1" max="100" bind:value={pokemon.level} />
		</div>
		<div class="hide">
			<div class="edit">Weight (kg)</div>
			<input class="weight" value="10.0" />
		</div>
	</div>
	<div class="info-group">
		<table>
			<tr>
				<th />
				<th>Base</th>
				<th class={genCheck([3, 4, 5, 6, 7, 8, 9])}>IVs</th>
				<th class={genCheck([3, 4, 5, 6, 7, 8, 9])}>EVs</th>
				<th class={genCheck([1, 2])}>DVs</th>
				<th />
				<th />
			</tr>
			{#each [...gen.stats] as stat}
				<tr class={stat}>
					<td> {gen.stats.display(stat)} </td>
					<td>
						<input type="number" bind:value={pokemon.species.baseStats[stat]} />
					</td>
					<td class={genCheck([3, 4, 5, 6, 7, 8, 9])}>
						<input class="ivs" type="number" min="0" max="31" bind:value={pokemon.ivs[stat]} />
					</td>
					<td class={genCheck([3, 4, 5, 6, 7, 8, 9])}>
						<input
							class="evs"
							type="number"
							min="0"
							max="252"
							step="4"
							bind:value={pokemon.evs[stat]}
						/>
					</td>
					<td class="gen-specific {genCheck([1, 2])} hide">
						<input class="dvs" value="15" />
					</td>
					<td><span class="total">{pokemon.rawStats[stat]}</span> </td>
					{#if stat != 'hp'}
						<td>
							<select class="boost" bind:value={pokemon.boosts[stat]}>
								<option value={6}>+6</option>
								<option value={5}>+5</option>
								<option value={4}>+4</option>
								<option value={3}>+3</option>
								<option value={2}>+2</option>
								<option value={1}>+1</option>
								<option value={0} selected>--</option>
								<option value={-1}>-1</option>
								<option value={-2}>-2</option>
								<option value={-3}>-3</option>
								<option value={-4}>-4</option>
								<option value={-5}>-5</option>
								<option value={-6}>-6</option>
							</select>
						</td>
					{/if}
				</tr>
			{/each}
			<tr class="sl gen-specific {genCheck([1])} hide">
				<td> Special </td>
				<td>
					<input class="base" value="100" />
				</td>
				<td>
					<input class="dvs" value="15" />
				</td>
				<td><span class="total">236</span> </td>
				<td>
					<select class="boost">
						<option value="6">+6</option>
						<option value="5">+5</option>
						<option value="4">+4</option>
						<option value="3">+3</option>
						<option value="2">+2</option>
						<option value="1">+1</option>
						<option value="0" selected>--</option>
						<option value="-1">-1</option>
						<option value="-2">-2</option>
						<option value="-3">-3</option>
						<option value="-4">-4</option>
						<option value="-5">-5</option>
						<option value="-6">-6</option>
					</select>
				</td>
			</tr>
		</table>
	</div>
	<div class="info-group info-selectors">
		<div class={genCheck([3, 4, 5, 6, 7, 8, 9])}>
			<div class="edit">Nature</div>
			<select class="nature" bind:value={pokemon.nature}>
				<option value="Adamant">Adamant (+Atk, -SpA)</option>
				<option value="Bashful">Bashful</option>
				<option value="Bold">Bold (+Def, -Atk)</option>
				<option value="Brave">Brave (+Atk, -Spe)</option>
				<option value="Calm">Calm (+SpD, -Atk)</option>
				<option value="Careful">Careful (+SpD, -SpA)</option>
				<option value="Docile">Docile</option>
				<option value="Gentle">Gentle (+SpD, -Def)</option>
				<option value="Hardy" selected>Hardy</option>
				<option value="Hasty">Hasty (+Spe, -Def)</option>
				<option value="Impish">Impish (+Def, -SpA)</option>
				<option value="Jolly">Jolly (+Spe, -SpA)</option>
				<option value="Lax">Lax (+Def, -SpD)</option>
				<option value="Lonely">Lonely (+Atk, -Def)</option>
				<option value="Mild">Mild (+SpA, -Def)</option>
				<option value="Modest">Modest (+SpA, -Atk)</option>
				<option value="Naive">Naive (+Spe, -SpD)</option>
				<option value="Naughty">Naughty (+Atk, -SpD)</option>
				<option value="Quiet">Quiet (+SpA, -Spe)</option>
				<option value="Quirky">Quirky</option>
				<option value="Rash">Rash (+SpA, -SpD)</option>
				<option value="Relaxed">Relaxed (+Def, -Spe)</option>
				<option value="Sassy">Sassy (+SpD, -Spe)</option>
				<option value="Serious">Serious</option>
				<option value="Timid">Timid (+Spe, -Atk)</option>
			</select>
		</div>
		<div class={genCheck([3, 4, 5, 6, 7, 8, 9])}>
			<div class="edit">Ability</div>
			<select class="ability terrain-trigger" bind:value={pokemon.ability}>
				{#each abilities as ability}
					<option value={ability}>{ability}</option>
				{/each}
			</select>
			<input hidden type="checkbox" title="Is this ability active?" class="abilityToggle" />
			<select hidden aria-label="Allies fainted" class="alliesFainted calc-trigger">
				<option value="0" selected>Zero allies fainted</option>
				<option value="1">One ally fainted</option>
				<option value="2">Two allies fainted</option>
				<option value="3">Three allies fainted</option>
				<option value="4">Four allies fainted</option>
				<option value="5">Five allies fainted</option>
			</select>
		</div>
		<div class={genCheck([2, 3, 4, 5, 6, 7, 8, 9])}>
			<div class="edit">Item</div>
			<select class="item terrain-trigger" bind:value={pokemon.item}>
				<option value={undefined} selected>(none)</option>
				{#each items as item}
					<option value={item.name}>{item.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<div class="edit">Status</div>
			<select class="status" bind:value={pokemon.status}>
				<option value="Healthy">Healthy</option>
				<option value="Poisoned">Poisoned</option>
				<option value="Badly Poisoned">Badly Poisoned</option>
				<option value="Burned">Burned</option>
				<option value="Paralyzed">Paralyzed</option>
				<option value="Asleep">Asleep</option>
				<option value="Frozen">Frozen</option>
			</select>
			<select class="toxic-counter hide">
				<option value="1">1/16</option>
				<option value="2">2/16</option>
				<option value="3">3/16</option>
				<option value="4">4/16</option>
				<option value="5">5/16</option>
				<option value="6">6/16</option>
				<option value="7">7/16</option>
				<option value="8">8/16</option>
				<option value="9">9/16</option>
				<option value="10">10/16</option>
				<option value="11">11/16</option>
				<option value="12">12/16</option>
				<option value="13">13/16</option>
				<option value="14">14/16</option>
				<option value="15">15/16</option>
			</select>
		</div>
	</div>
	<div class="info-group">
		Current HP
		<input class="current-hp" type="number" bind:value={pokemon.originalCurHP} />/<span
			class="max-hp">{pokemon.maxHP()}</span
		>
		(
		<input
			class="percent-hp"
			bind:value={percentHp}
			on:input={() => (pokemon.originalCurHP = Math.round((pokemon.maxHP() * percentHp) / 100))}
		/>%)
		<input class="max calc-trigger btn-input {genCheck([8])}" type="checkbox" id="maxL" /><label
			class="btn btn-wide gen-specific {genCheck([8])}"
			for="maxL"
			title="Use the corresponding Max Move?">Dynamax</label
		>
		<br />
		<br />
	</div>
	{#each [0, 1, 2, 3] as moveId}
		<div class="move{moveId + 1}">
			<select
				class="move-selector small-select"
				bind:value={moveProxies[moveId].name}
				on:change={() => (pokemon.moves[moveId] = new Move(gen, moveProxies[moveId].name))}
			>
				<option selected value="">(no move)</option>
				{#each moves as move}
					<option value={move}>{move}</option>
				{/each}
			</select>
			<input class="move-bp" type="number" bind:value={moveProxies[moveId].basePower} />
			<select class="move-type" bind:value={moveProxies[moveId].type}>
				{#each types as type}
					<option value={type.name}>{type.name}</option>
				{/each}
			</select>
			<select
				class="move-cat {genCheck([4, 5, 6, 7, 8, 9])}}"
				bind:value={moveProxies[moveId].category}
			>
				<option value="Physical">Physical</option>
				<option value="Special">Special</option>
			</select>
			<br />
			<input
				class="move-crit visually-hidden"
				type="checkbox"
				id="critL{moveId}"
				bind:checked={moveProxies[moveId].move.isCrit}
			/>
			<label
				class="btn crit-btn"
				for="critL{moveId}"
				title="Force this attack to be a critical hit?">Crit</label
			>
			<input
				class="move-z visually-hidden {genCheck([7])}"
				type="checkbox"
				id="zL1"
				bind:checked={moveProxies[moveId].move.isZ}
			/>
			<label
				class="btn z-btn gen-specific {genCheck([7])}"
				for="zL1"
				title="Make this attack a Z-move?">Z</label
			>
			{#if moveProxies[moveId].move.hits > 1}
				<select class="move-hits" bind:value={moveProxies[moveId].move.hits}>
					<option value={2}>2 hits</option>
					<option value={3}>3 hits</option>
					<option value={4}>4 hits</option>
					<option value={5}>5 hits</option>
				</select>
			{/if}

			{#if moveProxies[moveId].move.timesUsed}
				<select
					class="stat-drops calc-trigger hide"
					title="How many times was this move used in a row?"
					bind:value={moveProxies[moveId].move.timesUsed}
				>
					<option value={1}>Once</option>
					<option value={2}>Twice</option>
					<option value={3}>3 times</option>
					<option value={4}>4 times</option>
					<option value={5}>5 times</option>
				</select>
			{/if}

			{#if moveProxies[moveId].move.timesUsedWithMetronome}
				<select
					class="metronome calc-trigger hide"
					title="How many times was this move successfully and consecutively used while holding Metronome before this turn?"
					bind:value={moveProxies[moveId].move.timesUsedWithMetronome}
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
	{/each}
</div>

<style>
	.poke-info input:not([type]),
	.poke-info span {
		display: inline-block;
		width: 2.5em;
	}
	.poke-info input[type='number'] {
		display: inline-block;
		width: 3em;
	}

	.edit {
		display: inline-block;
		width: 5em;
	}

	.move-selector {
		width: 9em;
	}

	.hide {
		display: none;
	}
</style>
