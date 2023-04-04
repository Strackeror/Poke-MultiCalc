<script lang="ts">
	import DamageResults from './DamageResults.svelte';
	import PokemonTeam from './PokemonTeam.svelte';
  import PokemonEditor from './PokemonEditor.svelte';
	import { Dex, type GenerationNum } from '@pkmn/dex';
	import { Generation, Pokemon } from '$lib/calc';

	let dex = Dex.forGen(9);
	let gen = new Generation(dex);
	let editedPoke: Pokemon = new Pokemon(gen, "Bulbasaur");
	let allies: Pokemon[] = [];
	let enemies: Pokemon[] = [];
	let importText: string = "";

	

</script>

<div class="main">
  <div class="edit">
		<div class="box poke-editor">
	    <PokemonEditor pokemon={editedPoke}/>
		</div>
		<div class="box import-text-box">
			<textarea class="import-text" bind:value={importText}/>
			<button>Import</button>
		</div>
  </div>
	<div class="data">
		<div class="result-matrix box">
			<DamageResults offense={allies} defense={enemies} gen={gen}/>
		</div>
		<div class="teams">
			<div class="team ally box">Allies <PokemonTeam pokemons={allies} /></div>
			<div class="team enemy box">Enemies</div>
		</div>
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
		display: flex;
	}

	.teams {
		display: flex;
	}

	.import-text {
		margin: 5px;
		height: 10em;
		width: 95%;
		max-width: 95%;
	}

	.import-text-box > button {
		margin: 5px;
	}

  .box {
    border-radius: 3px;
    border: 1px solid black;
		box-shadow: 2px 2px black;
		margin: 5px;
  }
	.team {
		flex-grow: 1;
	}
</style>
