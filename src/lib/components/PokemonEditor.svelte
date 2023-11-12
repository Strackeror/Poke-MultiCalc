<script lang="ts">
	import { Pokemon } from '$lib/pokemon';
	import { Move, calcStat } from '@smogon/calc';
	import { currentGame, type PokemonState } from '$lib/state';
	import type { Generation } from '@smogon/calc/dist/data/interface';
	import { Generation as DataGeneration, Stats, type StatID, type StatsTable } from '@pkmn/data';
	import MoveEditor from './MoveEditor.svelte';
	import { Dex } from '@pkmn/dex';

	export let pokemon: PokemonState;

	const TOGGLE_ABILITIES = [
		'Flash Fire',
		'Intimidate',
		'Minus',
		'Plus',
		'Slow Start',
		'Unburden',
		'Stakeout',
		'Interstellar',
		'Evoboost'
	];
	function compareName(a: { name: string }, b: { name: string }) {
		return a.name.localeCompare(b.name);
	}

	$: gen = $currentGame.gen;
	$: types = [...gen.types];
	$: species = [...gen.species].sort(compareName);
	$: moves = [...gen.moves].sort(compareName);
	$: moveNames = moves.map((m) => m.name);
	$: abilities = [...gen.abilities].sort(compareName);
	$: items = [...gen.items].sort(compareName);

	let stats: Stats;
	$: {
		stats = new DataGeneration(Dex.forGen(gen.num), () => true).stats;
	}

	$: {
		if ($pokemon.isDynamaxed && $pokemon.dynamaxLevel === undefined) {
			$pokemon.dynamaxLevel = 10;
		}
	}

	let hpRatio = 1;
	function updateOriginalHp() {
		$pokemon.originalCurHP = Math.round($pokemon.rawStats.hp * hpRatio);
	}

	$: percentHp = '' + Math.round(hpRatio * 100);
	function updatePercentHp(value: string) {
		hpRatio = +value / 100;
		updateOriginalHp();
	}

	$: currentHp = Math.round($pokemon.maxHP() * hpRatio);
	function updateCurrentHp(value: number) {
		hpRatio = value / $pokemon.maxHP();
		updateOriginalHp();
	}

	$: {
		for (let stat of stats) {
			let newStat = calcStat(
				gen,
				stat,
				$pokemon.species.baseStats[stat],
				$pokemon.ivs[stat],
				$pokemon.evs[stat],
				$pokemon.level,
				$pokemon.nature
			);

			if (newStat != $pokemon.rawStats[stat]) {
				$pokemon.rawStats[stat] = newStat;
				if (stat == 'hp') updateOriginalHp();
			}
		}
	}

	$: speciesName = $pokemon.species.name;
	function updateSpecies(speciesName: string) {
		$pokemon = new Pokemon(gen, speciesName, { level: $pokemon.level });
		pokemon = pokemon;
	}

	let dvs: StatsTable = { ...$pokemon.ivs };
	$: {
		for (let stat of stats) {
			dvs[stat] = stats.toDV($pokemon.ivs[stat]);
		}
	}
	function updateDv(stat: StatID) {
		$pokemon.ivs[stat] = stats.toIV(dvs[stat]);
	}

	let teraChecked: boolean;
	function updateTeraType() {
		$pokemon.teraType = teraChecked ? $pokemon.selectedTera : undefined;
	}

	function genCheck(gen: Generation, gens: number[]) {
		if (!gens.includes(gen.num)) {
			return 'hide';
		}
		return '';
	}

	function addMove() {
		$pokemon.move_states.push(new Move(gen, ''));
		$pokemon = $pokemon;
	}

	function removeMove() {
		$pokemon.move_states.splice(-1);
		$pokemon = $pokemon;
	}

	function updateMove(current: Move, next: Move) {
		let index = $pokemon.move_states.indexOf(current);
		if (index < 0) return;
		$pokemon.move_states[index] = next;
	}
</script>

<div class="panel-body poke-info">
	<div class="info-group top">
		<div>
			<div class="edit">Species</div>
			<select value={speciesName} on:change={(e) => updateSpecies(e.currentTarget.value)}>
				{#each species as specie}
					<option value={specie.name}>{specie.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<div class="edit">Type</div>
			<select bind:value={$pokemon.types[0]}>
				{#each types as type}
					<option value={type.name}>{type.name}</option>
				{/each}
			</select>
			<select bind:value={$pokemon.types[1]}>
				<option value="" selected>(none)</option>
				<option value={undefined} hidden>(none)</option>
				{#each types as type}
					<option value={type.name}>{type.name}</option>
				{/each}
			</select>
		</div>
		{#if gen.num == 9}
			<div>
				<div class="edit">Tera Type</div>
				<select bind:value={$pokemon.selectedTera}>
					<option value="" hidden />
					{#each types as type}
						<option value={type.name}>{type.name}</option>
					{/each}
				</select>
				<input
					type="checkbox"
					title="Has this Pok&eacute;mon terastalized?"
					bind:checked={teraChecked}
					on:change={updateTeraType}
				/>
			</div>
		{/if}
		<div>
			<div class="edit">Gender</div>
			<select class="gender calc-trigger" bind:value={$pokemon.gender}>
				<option value="N" hidden />
				{#if $pokemon.gender != 'N'}
					<option value="M">Male</option>
					<option value="F">Female</option>
				{/if}
			</select>
		</div>
		<div>
			<div class="edit">Level</div>
			<input class="level" type="number" min="1" max="100" bind:value={$pokemon.level} />
		</div>
		<div>
			<div class="edit">Weight</div>
			<input class="weight" type="number" step="0.5" bind:value={$pokemon.weightkg} />
			kg
		</div>
	</div>
	<div class="info-group">
		<table>
			<tr>
				<th />
				<th>Base</th>
				<th class={genCheck(gen, [3, 4, 5, 6, 7, 8, 9])}>IVs</th>
				<th class={genCheck(gen, [3, 4, 5, 6, 7, 8, 9])}>EVs</th>
				<th class={genCheck(gen, [1, 2])}>DVs</th>
				<th />
				<th />
			</tr>
			{#each [...stats] as stat}
				<tr>
					<td> {stats.display(stat)} </td>
					<td>
						<input type="number" bind:value={$pokemon.species.baseStats[stat]} />
					</td>
					<td class={genCheck(gen, [3, 4, 5, 6, 7, 8, 9])}>
						<input class="ivs" type="number" min="0" max="31" bind:value={$pokemon.ivs[stat]} />
					</td>
					<td class={genCheck(gen, [3, 4, 5, 6, 7, 8, 9])}>
						<input
							class="evs"
							type="number"
							min="0"
							max="252"
							step="4"
							bind:value={$pokemon.evs[stat]}
						/>
					</td>
					<td class="gen-specific {genCheck(gen, [1, 2])}">
						<input
							class="dvs"
							type="number"
							bind:value={dvs[stat]}
							on:input={() => updateDv(stat)}
						/>
					</td>
					<td><span class="total">{$pokemon.rawStats[stat]}</span> </td>
					{#if stat != 'hp'}
						<td>
							<select class="boost" bind:value={$pokemon.boosts[stat]}>
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
		</table>
	</div>
	<div class="info-group info-selectors">
		<div class={genCheck(gen, [3, 4, 5, 6, 7, 8, 9])}>
			<div class="edit">Nature</div>
			<select class="nature" bind:value={$pokemon.nature}>
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
		<div class={genCheck(gen, [3, 4, 5, 6, 7, 8, 9])}>
			<div class="edit">Ability</div>
			<select class="ability terrain-trigger" bind:value={$pokemon.ability}>
				{#each abilities as ability}
					<option value={ability.name}>{ability.name}</option>
				{/each}
			</select>
			{#if TOGGLE_ABILITIES.includes($pokemon.ability ?? '')}
				<input type="checkbox" bind:checked={$pokemon.abilityOn} />
			{/if}
		</div>
		<div class={genCheck(gen, [2, 3, 4, 5, 6, 7, 8, 9])}>
			<div class="edit">Item</div>
			<select class="item terrain-trigger" bind:value={$pokemon.item}>
				<option value={undefined} selected>(none)</option>
				{#each items as item}
					<option value={item.name}>{item.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<div class="edit">Status</div>
			<select class="status" bind:value={$pokemon.status}>
				<option value="">Healthy</option>
				<option value="psn">Poisoned</option>
				<option value="tox">Badly Poisoned</option>
				<option value="brn">Burned</option>
				<option value="par">Paralyzed</option>
				<option value="slp">Asleep</option>
				<option value="frz">Frozen</option>
			</select>
			{#if $pokemon.status == 'tox'}
				<select bind:value={$pokemon.toxicCounter}>
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
			{/if}
		</div>
	</div>
	<div class="info-group">
		Current HP
		<input
			class="current-hp"
			type="number"
			value={currentHp}
			on:input={(e) => updateCurrentHp(+e.currentTarget.value)}
		/>/
		<span class="max-hp">{$pokemon.maxHP()}</span>
		(
		<input
			class="percent-hp"
			value={percentHp}
			on:input={(e) => updatePercentHp(e.currentTarget.value)}
		/>%)
		<input
			class="max calc-trigger btn-input {genCheck(gen, [8])}"
			type="checkbox"
			id="maxL"
			bind:checked={$pokemon.isDynamaxed}
		/>
		<label
			class="btn btn-wide gen-specific {genCheck(gen, [8])}"
			for="maxL"
			title="Use the corresponding Max Move?">Dynamax</label
		>
		<br />
		<br />
	</div>
	<div class="info-group">
		<div class="move-header">
			Moves
			<span />
			<button on:click={addMove}>Add</button>
			<button on:click={removeMove} disabled={$pokemon.move_states.length == 0}>Remove</button>
		</div>
		{#each $pokemon.move_states as move}
			<MoveEditor
				poke={$pokemon}
				{gen}
				{moveNames}
				{types}
				{move}
				on:changed={(m) => updateMove(move, m.detail)}
			/>
		{/each}
	</div>
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

	.weight {
		width: 5em !important;
	}

	.hide {
		display: none;
	}

	.move-header {
		padding-bottom: 5px;
	}
</style>
