import type { Generation } from '@smogon/calc/dist/data/interface';
import { calculateSMSSSV } from './gen789';
import { Field, Side, type Move, type Pokemon } from '@smogon/calc';
import { getFinalSpeed } from '@smogon/calc/dist/mechanics/util';

export function calculateSwelSun(
	gen: Generation,
	attacker: Pokemon,
	defender: Pokemon,
	move: Move,
	field?: Field
) {
	return calculateSMSSSV(
		gen,
		attacker.clone(),
		defender.clone(),
		move.clone(),
		field?.clone() ?? new Field()
	);
}

export function calculateSpeedSwelSun(gen: Generation, poke: Pokemon, field: Field, side: Side) {
	let speed = getFinalSpeed(gen, poke, field, side);
	if (poke.hasAbility('Solar Rush') && field.weather == 'Sun') speed *= 2;
	if (poke.hasAbility('Volt Rush') && field.terrain == 'Electric') speed *= 2;
	return speed;
}
