import { SETDEX_RBY } from './gen1';
import { SETDEX_GSC } from './gen2';
import { SETDEX_ADV } from './gen3';
import { SETDEX_DPP } from './gen4';
import { SETDEX_BW } from './gen5';
import { SETDEX_XY } from './gen6';
import { SETDEX_SM } from './gen7';
import { SETDEX_SS } from './gen8';
import { SETDEX_SV } from './gen9';

export type LocalSetStats = { hp: number; at: number; df: number; sa: number; sd: number; sp: number };
export type LocalSet = {
	level: number;
	moves: string[];
	evs?: Partial<LocalSetStats>;
	ivs?: Partial<LocalSetStats>;
  nature?: string,
  item?: string,
  ability?: string,
};

const setMap: {[name: string]: SetList} = {
	RBY: SETDEX_RBY,
	GSC: SETDEX_GSC,
	ADV: SETDEX_ADV,
	DPP: SETDEX_DPP,
	'B/W': SETDEX_BW,
	'X/Y': SETDEX_XY,
	'S/M': SETDEX_SM,
	'S/S': SETDEX_SS,
	'S/V': SETDEX_SV,
};
type SetList = { [poke: string]: { [set: string]: Partial<LocalSet> } };
export function getSets(genName: string): SetList {
  if (!(genName in setMap)) {
    return {};
  }
	return setMap[genName];
}
