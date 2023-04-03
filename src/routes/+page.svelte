<script lang="ts">
	import { Pokemon } from '$lib/calc/pokemon';
	import { Generations } from '$lib/calc/test/gen';
	import { Dex } from '@pkmn/dex';
	import DamageResults from './DamageResults.svelte';
	import PokemonTeam from './PokemonTeam.svelte';
  import PokemonEditor from './PokemonEditor.svelte';

	let allies: Pokemon[] = [];
	let enemies: Pokemon[] = [];
	allies.push(new Pokemon(new Generations(Dex).get(4), 'Torterra'));

	function addTorterra() {
		allies.push(new Pokemon(new Generations(Dex).get(4), 'Torterra'));
		allies = allies;
	}
</script>

<div class="main">
  <div class="edit">
    <PokemonEditor pokemon={allies[0]}/>
  </div>
	<div class="data">
		<div class="result-matrix box">
			<DamageResults offense={allies} defense={enemies} />
		</div>
		<div class="teams">
			<div class="team ally box">Allies <PokemonTeam pokemons={allies} /></div>
			<div class="team enemy box">Enemies</div>
		</div>
		<button on:click={addTorterra}>Add</button>
	</div>
</div>

<style>
  .main {
    display: flex;
  }
  .edit {
    font: 10pt Verdana;
    width: 400px;
  }
	.data {
		display: flex;
    flex-grow: 1;
		flex-direction: column;
	}

	.result-matrix {
		height: 500px;
		margin: 5px;
		display: flex;
	}

	.teams {
		display: flex;
	}

  .box {
    border-radius: 3px;
    border: 1px solid black;
		box-shadow: 2px 2px black;
  }
	.team {
		flex-grow: 1;
		margin: 5px;
	}
</style>
