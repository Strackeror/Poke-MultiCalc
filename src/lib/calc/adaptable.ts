// By default, importing `$lib/calc` provides a convenience wrapper that is roughly equivalent
// to importing `$lib/calc/adaptable` and `import Generations from '$lib/calc/data'` and
// using  `Generations` to populate the `Generation` param to these exports. Alternatively, an
// application may implement a different `$lib/calc/data/interface` and pass a `Generation` from
// that to these exports.

export {calculate} from './calc';
export {Pokemon} from './pokemon';
export {Move} from './move';
export {Field, Side} from './field';
export {Result} from './result';
export {Stats} from './stats';
