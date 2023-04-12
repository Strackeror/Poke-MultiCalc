<script lang="ts">
	import { Pokemon, Move, calcStat } from '$lib/calc';
	import type { PokemonState } from '$lib/state';
	import type {
		Generation,
		Type,
		Item,
		Specie,
		MoveCategory,
		TypeName,
		StatID,
		StatsTable
	} from '@pkmn/data';
	import MoveEditor from './MoveEditor.svelte';

	export let gen: Generation;
	export let pokemon: PokemonState;

	let species: readonly Specie[] = [];
	let types: Type[] = [];
	let abilities: string[] = [];
	let moves: string[] = [];
	let items: readonly Item[] = [];
	let stats: StatID[] = [];
	$: {
		types = [...gen.types];
		abilities = [...gen.abilities].map((a) => a.name);
		items = [...gen.items];
		species = [...gen.species].sort((a, b) => a.name.localeCompare(b.name));
		moves = [...gen.moves].map((m) => m.name).sort();
		stats = [...gen.stats];
		if (gen.num == 1) {
			stats.pop();
		}
	}

	$: {
		for (let i of [0, 1, 2, 3]) {
			if (!$pokemon.moves[i]) {
				$pokemon.moves[i] = new Move(gen, '');
			}
		}
	}

	$: {
		let hpRatio = $pokemon.curHP() / $pokemon.maxHP();
		for (let stat of gen.stats) {
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
			}
		}

		let newHp = Math.floor($pokemon.maxHP() * hpRatio);
		if ($pokemon.originalCurHP != newHp) {
			$pokemon.originalCurHP = newHp;
		}
	}

	let percentHp: string;
	$: {
		percentHp = '' + Math.round(($pokemon.originalCurHP / $pokemon.rawStats.hp) * 100);
	}
	function updatePercent() {
		let ratio = +percentHp / 100;
		$pokemon.originalCurHP = Math.floor($pokemon.rawStats.hp * ratio);
	}

	let speciesString: string;
	$: {
		speciesString = $pokemon.species.name;
	}
	function updateSpecies() {
		$pokemon = new Pokemon(gen, speciesString);
	}

	let dvs: StatsTable = { ...$pokemon.ivs };
	$: {
		for (let stat of stats) {
			dvs[stat] = gen.stats.toDV($pokemon.ivs[stat]);
		}
	}
	function updateDv(stat: StatID) {
		$pokemon.ivs[stat] = gen.stats.toIV(dvs[stat]);
	}

	function genCheck(gen: Generation, gens: number[]) {
		if (!gens.includes(gen.num)) {
			return 'hide';
		}
		return '';
	}
</script>

<div class="panel-body poke-info">
	<div class="info-group top">
		<div>
			<div class="edit">Species</div>
			<select bind:value={speciesString} on:change={updateSpecies}>
				{#each species as specie}
					<option value={specie.name}>{specie.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<div class="edit">Type</div>
			<select class="type1 terrain-trigger" bind:value={$pokemon.types[0]}>
				{#each types as type}
					<option value={type.name}>{type.name}</option>
				{/each}
			</select>
			<select class="type2 terrain-trigger" bind:value={$pokemon.types[1]}>
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
			<input class="level" type="number" min="1" max="100" bind:value={$pokemon.level} />
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
				<th class={genCheck(gen, [3, 4, 5, 6, 7, 8, 9])}>IVs</th>
				<th class={genCheck(gen, [3, 4, 5, 6, 7, 8, 9])}>EVs</th>
				<th class={genCheck(gen, [1, 2])}>DVs</th>
				<th />
				<th />
			</tr>
			{#each stats as stat}
				<tr>
					<td> {gen.stats.display(stat)} </td>
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
				<option value="txc">Badly Poisoned</option>
				<option value="brn">Burned</option>
				<option value="par">Paralyzed</option>
				<option value="slp">Asleep</option>
				<option value="frz">Frozen</option>
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
		<input class="current-hp" type="number" bind:value={$pokemon.originalCurHP} />/<span
			class="max-hp">{$pokemon.maxHP()}</span
		>
		(
		<input class="percent-hp" bind:value={percentHp} on:input={updatePercent} />%)
		<input
			class="max calc-trigger btn-input {genCheck(gen, [8])}"
			type="checkbox"
			id="maxL"
		/><label
			class="btn btn-wide gen-specific {genCheck(gen, [8])}"
			for="maxL"
			title="Use the corresponding Max Move?">Dynamax</label
		>
		<br />
		<br />
	</div>
	{#each $pokemon.moves as move}
		<MoveEditor {gen} moveNames={moves} {types} bind:move />
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

	.hide {
		display: none;
	}
</style>
