import { Generations } from './gen';
import type {State} from './state';
import type* as I from './interface';
import * as A from './adaptable';
import { Dex } from '@pkmn/dex';

const BaseGens = new Generations(Dex);

export function calculate(
  gen: I.GenerationNum | I.Generation,
  attacker: A.Pokemon,
  defender: A.Pokemon,
  move: A.Move,
  field?: A.Field
): A.Result {
  return (A.calculate)(
    typeof gen === 'number' ? BaseGens.get(gen) : gen,
    attacker,
    defender,
    move,
    field
  );
}

export class Move extends A.Move {
  constructor(
    gen: I.GenerationNum | I.Generation,
    name: string,
    options: Partial<Omit<State.Move, 'ability' | 'item' | 'species'>> & {
      ability?: string;
      item?: string;
      species?: string;
    } = {}
  ) {
    super(typeof gen === 'number' ? BaseGens.get(gen) : gen, name, options as any);
  }
}

export class Pokemon extends A.Pokemon {
  constructor(
    gen: I.GenerationNum | I.Generation,
    name: string,
    options: Partial<Omit<State.Pokemon, 'ability' | 'item' | 'nature'>> & {
      ability?: string;
      item?: string;
      nature?: string;
      curHP?: number;
      ivs?: Partial<I.StatsTable> & {spc?: number};
      evs?: Partial<I.StatsTable> & {spc?: number};
      boosts?: Partial<I.StatsTable> & {spc?: number};
    } = {}
  ) {
    super(typeof gen === 'number' ? BaseGens.get(gen) : gen, name, options as any);
  }

  static getForme(
    gen: I.GenerationNum | I.Generation,
    speciesName: string,
    item?: string,
    moveName?: string
  ) {
    return A.Pokemon.getForme(
      typeof gen === 'number' ? BaseGens.get(gen) : gen,
      speciesName,
      item as I.ItemName,
      moveName as I.MoveName
    );
  }
}

export function calcStat(
  gen: I.GenerationNum | I.Generation,
  stat: I.StatID | 'spc',
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature?: string
) {
  return A.Stats.calcStat(
    typeof gen === 'number' ? BaseGens.get(gen) : gen,
    stat === 'spc' ? 'spa' : stat,
    base,
    iv,
    ev,
    level,
    nature
  );
}

export {Field, Side} from './field';
export {Result} from './result';
export {Generations, Generation} from "./gen";
export type {GenerationNum, StatsTable, StatID} from './interface';
export {toID} from './util';
export type {State} from './state';

export {STATS, Stats} from './stats';
