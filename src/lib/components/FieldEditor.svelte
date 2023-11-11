<script lang="ts">
	import type { Generation } from '@pkmn/data';
	import type { Field } from '@smogon/calc';
	import { currentGame } from '$lib/state';

	export let field: Field;

	$: gen = $currentGame.gen;

	let leftSwitching: boolean, rightSwitching: boolean;
	$: {
		field.attackerSide.isSwitching = leftSwitching ? 'out' : undefined;
		field.defenderSide.isSwitching = rightSwitching ? 'out' : undefined;
	}


	function hideGenCheck(gen: Generation, gens: number[]) {
		if (!gens.includes(gen.num)) {
			return 'hide';
		}
		return '';
	}
</script>

<div class="panel-body field-info">
	<div class={hideGenCheck(gen, [3, 4, 5, 6, 7, 8, 9])} title="Select the battle format.">
		<input
			class="visually-hidden"
			type="radio"
			name="format"
			value="Singles"
			id="singles-format"
			bind:group={field.gameType}
		/>
		<label class="btn btn-left" for="singles-format">Singles</label>
		<input
			class="visually-hidden"
			type="radio"
			name="format"
			value="Doubles"
			id="doubles-format"
			bind:group={field.gameType}
		/>
		<label class="btn btn-right" for="doubles-format">Doubles</label>
	</div>
	<div class="space {hideGenCheck(gen, [6, 7, 8, 9])}" title="Select the current terrain.">
		<input
			class="visually-hidden"
			type="radio"
			name="terrain"
			bind:group={field.terrain}
			value="None"
			id="noneterrain"
		/><label class="btn btn-left" for="noneterrain">None</label>
		<input
			class="visually-hidden"
			type="radio"
			name="terrain"
			bind:group={field.terrain}
			value="Electric"
			id="electric"
		/><label class="btn btn-mid" for="electric">Electric Terrain</label>
		<input
			class="visually-hidden"
			type="radio"
			name="terrain"
			bind:group={field.terrain}
			value="Grassy"
			id="grassy"
		/><label class="btn btn-mid" for="grassy">Grassy Terrain</label>
		<input
			class="visually-hidden"
			type="radio"
			name="terrain"
			bind:group={field.terrain}
			value="Misty"
			id="misty"
		/><label class="btn btn-right" for="misty">Misty Terrain</label>
	</div>
	<div class={hideGenCheck(gen, [7, 8, 9])} title="Select the current terrain.">
		<input
			class="visually-hidden"
			type="radio"
			name="terrain"
			bind:group={field.terrain}
			value="Psychic"
			id="psychic"
		/><label class="btn btn-mid" for="psychic">Psychic Terrain</label>
	</div>
	<div
		class="space"
		class:hide={gen.num != 9 || field.gameType != "Doubles"}
		role="group"
		title="Select the ruin abilities from other Pok&eacute;mon on the field."
	>
		<input
			class="visually-hidden"
			type="checkbox"
			name="ruin"
			bind:checked={field.isBeadsOfRuin}
			value="Beads"
			id="beads"
		/>
		<label class="btn btn-left" for="beads">Beads of Ruin</label>
		<input
			class="visually-hidden"
			type="checkbox"
			name="ruin"
			bind:checked={field.isTabletsOfRuin}
			value="Tablets"
			id="tablets"
		/>
		<label class="btn btn-mid" for="tablets">Tablets of Ruin</label>
		<input
			class="visually-hidden"
			type="checkbox"
			name="ruin"
			bind:checked={field.isSwordOfRuin}
			value="Sword"
			id="sword"
		/>
		<label class="btn btn-right" for="sword">Sword of Ruin</label>
	</div>
	<div
		class:hide={gen.num != 9 || field.gameType != "Doubles"}
		role="group"
		title="Select the ruin abilities from other Pok&eacute;mon on the field."
	>
		<input class="visually-hidden" type="checkbox" name="ruin" value="Vessel" id="vessel" />
		<label class="btn btn-mid" for="vessel">Vessel of Ruin</label>
	</div>

	<hr class={hideGenCheck(gen, [6, 7, 8, 9])} />
	<div class={hideGenCheck(gen, [3, 4, 5, 6, 7, 8, 9])} title="Select the current weather condition.">
		<input
			class="visually-hidden"
			type="radio"
			name="weather"
			bind:group={field.weather}
			value=""
			id="clear"
			checked
		/>
		<label class="btn btn-left" for="clear">None</label>
		<input
			class="visually-hidden"
			type="radio"
			name="weather"
			bind:group={field.weather}
			value="Sun"
			id="sun"
		/>
		<label class="btn btn-mid" for="sun">Sun</label>
		<input
			class="visually-hidden"
			type="radio"
			name="weather"
			bind:group={field.weather}
			value="Rain"
			id="rain"
		/>
		<label class="btn btn-mid" for="rain">Rain</label>
		<input
			class="visually-hidden"
			type="radio"
			name="weather"
			bind:group={field.weather}
			value="Sand"
			id="sand"
		/>
		<label class="btn btn-mid" for="sand">Sand</label>
		<input
			class="visually-hidden"
			type="radio"
			name="weather"
			bind:group={field.weather}
			value="Hail"
			id="hail"
		/>
		<label class="btn btn-right" for="hail">Hail</label>
	</div>
	<div class={hideGenCheck(gen, [6, 7, 8, 9])} title="Select the current weather condition.">
		<input
			class="visually-hidden"
			type="radio"
			name="weather"
			bind:group={field.weather}
			value="Harsh Sunshine"
			id="harsh-sunshine"
		/>
		<label class="btn btn-left" for="harsh-sunshine">Harsh Sunshine</label>
		<input
			class="visually-hidden"
			type="radio"
			name="weather"
			bind:group={field.weather}
			value="Heavy Rain"
			id="heavy-rain"
		/>
		<label class="btn btn-mid" for="heavy-rain">Heavy Rain</label>
		<input
			class="visually-hidden"
			type="radio"
			name="weather"
			bind:group={field.weather}
			value="Strong Winds"
			id="strong-winds"
		/>
		<label class="btn btn-right" for="strong-winds">Strong Winds</label>
	</div>
	<div class="space {hideGenCheck(gen, [2])}" title="Select the current weather condition.">
		<input
			class="visually-hidden"
			type="radio"
			name="gscWeather"
			bind:group={field.weather}
			value=""
			id="gscClear"
			checked
		/>
		<label class="btn btn-left" for="gscClear">None</label>
		<input
			class="visually-hidden"
			type="radio"
			name="gscWeather"
			bind:group={field.weather}
			value="Sun"
			id="gscSun"
		/>
		<label class="btn btn-mid" for="gscSun">Sun</label>
		<input
			class="visually-hidden"
			type="radio"
			name="gscWeather"
			bind:group={field.weather}
			value="Rain"
			id="gscRain"
		/>
		<label class="btn btn-mid" for="gscRain">Rain</label>
		<input
			class="visually-hidden"
			type="radio"
			name="gscWeather"
			bind:group={field.weather}
			value="Sand"
			id="gscSand"
		/>
		<label class="btn btn-right" for="gscSand">Sand</label>
	</div>
	<div class="{hideGenCheck(gen, [4, 5, 6, 7, 8, 9])} space" title="Is gravity in effect?">
		<input class="visually-hidden" type="checkbox" id="gravity" bind:checked={field.isGravity} />
		<label class="btn" for="gravity">Gravity</label>
	</div>
	<hr class={hideGenCheck(gen, [2, 3, 4, 5, 6, 7, 8, 9])} />
	<div class="btn-group {hideGenCheck(gen, [4, 5, 6, 7, 8])}">
		<div class="left" title="Is Stealth Rock affecting this side of the field?">
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isSR}
				type="checkbox"
				id="srL"
			/>
			<label class="btn" for="srL">Stealth Rock</label>
		</div>
		<div class="right" title="Is Stealth Rock affecting this side of the field?">
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isSR}
				type="checkbox"
				id="srR"
			/>
			<label class="btn" for="srR">Stealth Rock</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [8, 9])}">
		<div class="left" title="Is Steelsurge affecting this side of the field?">
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.steelsurge}
				type="checkbox"
				id="steelsurgeL"
			/>
			<label class="btn" for="steelsurgeL">Steelsurge</label>
		</div>
		<div class="right" title="Is Steelsurge affecting this side of the field?">
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.steelsurge}
				type="checkbox"
				id="steelsurgeR"
			/>
			<label class="btn" for="steelsurgeR">Steelsurge</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [2, 3, 4, 5, 6, 7, 8, 9])}">
		<div class="left" title="Are there Spikes on this side of the field?">
			<input
				class="visually-hidden"
				bind:group={field.attackerSide.spikes}
				type="radio"
				name="spikesL"
				value={0}
				id="spikesL0"
				checked
			/>
			<label class="btn btn-xsmall btn-left" for="spikesL0">0</label>
			<input
				class="visually-hidden"
				bind:group={field.attackerSide.spikes}
				type="radio"
				name="spikesL"
				value={1}
				id="spikesL1"
			/>
			<label class="btn btn-xsmall btn-mid" for="spikesL1">1</label>
			<input
				class="visually-hidden"
				bind:group={field.attackerSide.spikes}
				type="radio"
				name="spikesL"
				value={2}
				id="spikesL2"
			/>
			<label class="btn btn-xsmall btn-mid" for="spikesL2">2</label>
			<input
				class="visually-hidden"
				bind:group={field.attackerSide.spikes}
				type="radio"
				name="spikesL"
				value={3}
				id="spikesL3"
			/>
			<label class="btn btn-wide btn-right" for="spikesL3">3 Spikes</label>
		</div>
		<div class="right" title="Are there Spikes on this side of the field?">
			<input
				class="visually-hidden"
				bind:group={field.defenderSide.spikes}
				type="radio"
				name="spikesR"
				value={3}
				id="spikesR3"
			/>
			<label class="btn btn-wide btn-left" for="spikesR3">3 Spikes</label>
			<input
				class="visually-hidden"
				bind:group={field.defenderSide.spikes}
				type="radio"
				name="spikesR"
				value={2}
				id="spikesR2"
			/>
			<label class="btn btn-xsmall btn-mid" for="spikesR2">2</label>
			<input
				class="visually-hidden"
				bind:group={field.defenderSide.spikes}
				type="radio"
				name="spikesR"
				value={1}
				id="spikesR1"
			/>
			<label class="btn btn-xsmall btn-mid" for="spikesR1">1</label>
			<input
				class="visually-hidden"
				bind:group={field.defenderSide.spikes}
				type="radio"
				name="spikesR"
				value={0}
				id="spikesR0"
				checked
			/>
			<label class="btn btn-xsmall btn-right" for="spikesR0">0</label>
		</div>
	</div>
	<div class="btn-group">
		<div class="left" title="Is this Pok&eacute;mon protected by Reflect and/or Light Screen?">
			<input
				class="visually-hidden"
				type="checkbox"
				bind:checked={field.attackerSide.isReflect}
				id="reflectL"
			/>
			<label class="btn btn-left" for="reflectL">Reflect</label>
			<input
				class="visually-hidden"
				type="checkbox"
				bind:checked={field.attackerSide.isLightScreen}
				id="lightScreenL"
			/>
			<label class="btn btn-right" for="lightScreenL">Light Screen</label>
		</div>
		<div class="right" title="Is this Pok&eacute;mon protected by Reflect and/or Light Screen?">
			<input
				class="visually-hidden"
				type="checkbox"
				bind:checked={field.defenderSide.isLightScreen}
				id="lightScreenR"
			/>
			<label class="btn btn-left" for="lightScreenR">Light Screen</label>
			<input
				class="visually-hidden"
				type="checkbox"
				bind:checked={field.defenderSide.isReflect}
				id="reflectR"
			/>
			<label class="btn btn-right" for="reflectR">Reflect</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [2, 3, 4, 5, 6, 7, 8, 9])}">
		<div class="left" title="Is this Pok&eacute;mon protected?">
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isProtected}
				type="checkbox"
				id="protectL"
			/>
			<label class="btn btn-wide" for="protectL">Protect</label>
		</div>
		<div class="right" title="Is this Pok&eacute;mon protected?">
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isProtected}
				type="checkbox"
				id="protectR"
			/>
			<label class="btn btn-wide" for="protectR">Protect</label>
		</div>
	</div>
	<div class="btn-group">
		<div class="left" title="Has this Pok&eacute;mon been affected by Leech Seed?">
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isSeeded}
				type="checkbox"
				id="leechSeedL"
			/>
			<label class="btn btn-wide" for="leechSeedL">Leech Seed</label>
		</div>
		<div class="right" title="Has this Pok&eacute;mon been affected by Leech Seed?">
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isSeeded}
				type="checkbox"
				id="leechSeedR"
			/>
			<label class="btn btn-wide" for="leechSeedR">Leech Seed</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [2, 3, 4, 5, 6, 7, 8, 9])}">
		<div class="left" title="Has this Pok&eacute;mon been revealed with Foresight or Odor Sleuth?">
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isForesight}
				type="checkbox"
				id="foresightL"
			/>
			<label class="btn btn-wide" for="foresightL">Foresight</label>
		</div>
		<div class="right" title="Has this Pok&eacute;mon been revealed with Foresight or Odor Sleuth?">
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isForesight}
				type="checkbox"
				id="foresightR"
			/>
			<label class="btn btn-wide" for="foresightR">Foresight</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [3, 4, 5, 6, 7, 8, 9])}">
		<div
			class="left"
			title="Has this Pok&eacute;mon's power been boosted by an ally's Helping Hand?"
		>
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isHelpingHand}
				type="checkbox"
				id="helpingHandL"
			/>
			<label class="btn" for="helpingHandL">Helping Hand</label>
		</div>
		<div
			class="right"
			title="Has this Pok&eacute;mon's power been boosted by an ally's Helping Hand?"
		>
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isHelpingHand}
				type="checkbox"
				id="helpingHandR"
			/>
			<label class="btn" for="helpingHandR">Helping Hand</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [4, 5, 6, 7, 8, 9])}">
		<div class="left" title="Has this Pok&eacute;mon's speed been boosted by Tailwind?">
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isTailwind}
				type="checkbox"
				id="tailwindL"
			/>
			<label class="btn" for="tailwindL">Tailwind</label>
		</div>
		<div class="right" title="Has this Pok&eacute;mon's speed been boosted by Tailwind?">
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isTailwind}
				type="checkbox"
				id="tailwindR"
			/>
			<label class="btn" for="tailwindR">Tailwind</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [4, 5, 6, 7, 8, 9])}">
		<div class="left" title="Is the Pok&eacute;mon affected by an ally's Flower Gift?">
			<div hidden id="selectFlowerGiftInstruction">
				Is the Pok&eacute;mon affected by an ally's Flower Gift?
			</div>
			<input
				aria-describedby="selectFlowerGiftInstruction"
				class="visually-hidden"
				type="checkbox"
				bind:checked={field.attackerSide.isFlowerGift}
				id="flowerGiftL"
			/>
			<label class="btn" for="flowerGiftL">Flower Gift</label>
		</div>
		<div class="right" title="Is the Pok&eacute;mon affected by an ally's Flower Gift?">
			<input
				aria-describedby="selectFlowerGiftInstruction"
				class="visually-hidden"
				type="checkbox"
				bind:checked={field.defenderSide.isFlowerGift}
				id="flowerGiftR"
			/>
			<label class="btn" for="flowerGiftR">Flower Gift</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [5, 6, 7, 8, 9])}">
		<div class="left" title="Is the Pok&eacute;mon protected by an ally's Friend Guard?">
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isFriendGuard}
				type="checkbox"
				id="friendGuardL"
			/>
			<label class="btn" for="friendGuardL">Friend Guard</label>
		</div>
		<div class="right" title="Is the Pok&eacute;mon protected by an ally's Friend Guard?">
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isFriendGuard}
				type="checkbox"
				id="friendGuardR"
			/>
			<label class="btn" for="friendGuardR">Friend Guard</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [7, 8, 9])}">
		<div class="left" title="Is the Pok&eacute;mon protected by an ally's Aurora Veil?">
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isAuroraVeil}
				type="checkbox"
				id="auroraVeilL"
			/>
			<label class="btn" for="auroraVeilL">Aurora Veil</label>
		</div>
		<div class="right" title="Is the Pok&eacute;mon protected by an ally's Aurora Veil?">
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isAuroraVeil}
				type="checkbox"
				id="auroraVeilR"
			/>
			<label class="btn" for="auroraVeilR">Aurora Veil</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [7, 8, 9])}">
		<div
			class="left"
			title="Has this Pok&eacute;mon's power been boosted by an ally's Battery ability?"
		>
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isBattery}
				type="checkbox"
				id="batteryL"
			/>
			<label class="btn" for="batteryL">Battery</label>
		</div>
		<div
			class="right"
			title="Has this Pok&eacute;mon's power been boosted by an ally's Battery ability?"
		>
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isBattery}
				type="checkbox"
				id="batteryR"
			/>
			<label class="btn" for="batteryR">Battery</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [8, 9])}">
		<div
			class="left"
			title="Has this Pok&eacute;mon's power been boosted by an ally's Power Spot ability?"
		>
			<input
				class="visually-hidden"
				bind:checked={field.attackerSide.isPowerSpot}
				type="checkbox"
				id="powerSpotL"
			/>
			<label class="btn" for="powerSpotL">Power Spot</label>
		</div>
		<div
			class="right"
			title="Has this Pok&eacute;mon's power been boosted by an ally's Power Spot ability?"
		>
			<input
				class="visually-hidden"
				bind:checked={field.defenderSide.isPowerSpot}
				type="checkbox"
				id="powerSpotR"
			/>
			<label class="btn" for="powerSpotR">Power Spot</label>
		</div>
	</div>
	<div class="btn-group {hideGenCheck(gen, [2, 3, 4, 5, 6, 7, 8, 9])}">
		<div class="left" title="Is the defending Pok&eacute;mon switching out?">
			<input
				class="visually-hidden"
				bind:checked={leftSwitching}
				type="checkbox"
				id="switchingL"
			/>
			<label class="btn" for="switchingL">Switching out</label>
		</div>
		<div class="right" title="Is the defending Pok&eacute;mon switching out?">
			<input
				class="visually-hidden"
				bind:checked={rightSwitching}
				type="checkbox"
				id="switchingR"
			/>
			<label class="btn" for="switchingR">Switching out</label>
		</div>
	</div>
</div>

<style>
	/* general button styling */
	.btn {
		text-align: center;
		border: solid 1px #aaaaaa;
		padding: 4px 4px;
		position: relative;
		cursor: pointer;
		color: #555555;
		background: #e9e9e9;
		margin: -1px -3px 0;
		display: inline-block;
		border-radius: 8px;
	}

	.btn-left {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	.btn-right {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.btn-mid {
		border-radius: 0;
	}
	.visually-hidden:focus + .btn, /* Add visual indication when focusing on visually hidden elements */
    .btn:hover {
		z-index: 10;
		border-color: #777777;
		background: #e3e3e3;
	}
	.visually-hidden:checked + .btn {
		color: #111111;
		background: #f8f8f8;
	}

	.btn::after {
		font-weight: bold;
		color: #111111;
		background: #f5f5f5;
	}

	.visually-hidden[type='radio']:checked + .btn {
		cursor: default;
	}

	/* Hide element visually, but not from screen readers. See http://adrianroselli.com/2017/05/under-engineered-custom-radio-buttons-and-checkboxen.html */
	.visually-hidden {
		clip: rect(1px, 1px, 1px, 1px);
		height: 1px;
		overflow: hidden;
		position: absolute;
		top: auto;
		white-space: nowrap; /* https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe */
	}

	.visually-hidden:disabled + .btn {
		color: #999999;
	}
	.btn-group {
		display: inline;
		width: 100%;
	}

	.field-info .btn {
		font-size: 0.8em;
	}

	.left {
		float: left;
	}
	.right {
		float: right;
	}
	.field-info {
		display: flex;
		flex-direction: column;
	}

	.field-info > div {
		align-self: center;
	}
	.hide {
		display: none;
	}

	.space {
		margin-top: 5px;
	}

	hr {
		width: 100%;
	}
</style>
