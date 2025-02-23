import * as ghpages from 'gh-pages';

ghpages.publish(
	'build',
	{ repo: 'https://github.com/Strackeror/Poke-MultiCalc.git', dotfiles: true },
	() => {}
);
