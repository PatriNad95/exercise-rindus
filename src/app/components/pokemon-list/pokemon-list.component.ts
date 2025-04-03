import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import {
  PokemonBasicInfo,
  PokemonListResponse,
} from '../../utils/pokemon.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import _ from 'lodash';

@Component({
  selector: 'app-pokemon-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  dataSource = new MatTableDataSource<PokemonBasicInfo>();
  #apiUrl: string = '';
  #initialUrl: string = 'https://pokeapi.co/api/v2/pokemon';
  dataPokemon: PokemonListResponse = {
    results: [],
    next: '',
    previous: '',
    count: 0,
  };
  displayedColumns: string[] = ['id', 'name', 'sprite'];
  allPokemons: PokemonBasicInfo[] = [];

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit(): void {
    this.#apiUrl = this.#initialUrl;
    this._callServiceList();
    this._getAllPokemons();
  }

  /**
   * Calls the Pokémon service to fetch the list of Pokémon from the API.
   * After successfully fetching the list, it processes the data, maps it with
   * necessary transformations (e.g., capitalizing names, adding IDs, adding sprites),
   * and assigns it to `dataSource.data` for display in the table or grid.
   *
   * @returns void
   */
  private _callServiceList(): void {
    this.pokemonService.getPokemonList(this.#apiUrl).subscribe({
      next: (data) => {
        this.dataPokemon = data;
        const idCounter = this._getOffsetFromUrl();
        this.dataSource.data = this._mapPokemonData(data.results, idCounter);
      },
      error: (err) => console.error('Error obtaining pokemon list:', err),
    });
  }

  /**
   * Fetches the full list of all Pokémon (with a limit of 2000) from the API.
   * Once the data is fetched, it processes and maps the Pokémon data (using `_mapPokemonData`)
   * and assigns it to `allPokemons` for future filtering or searching.
   *
   * @returns void
   */
  private _getAllPokemons(): void {
    const allPokemonsUrl = `${this.#apiUrl}?limit=2000&offset=0`;
    this.pokemonService.getPokemonList(allPokemonsUrl).subscribe({
      next: (data) => {
        this.allPokemons = this._mapPokemonData(data.results, 0);
      },
      error: (err) => console.error('Error obtaining all pokemon list:', err),
    });
  }

  /**
   * Maps the raw Pokémon data into a structured format that includes additional properties
   * such as capitalized names, Pokémon IDs, and sprite URLs.
   * This method is called to process the data before displaying it in a table or grid.
   *
   * @param pokemons Array of Pokémon data fetched from the API.
   * @param idOffset The offset value used to calculate the Pokémon ID.
   * @returns A new array of mapped Pokémon data.
   */
  private _mapPokemonData(
    pokemons: PokemonBasicInfo[],
    idOffset: number
  ): PokemonBasicInfo[] {
    return pokemons.map((pokemon, index) => ({
      ...pokemon,
      name: _.capitalize(pokemon.name),
      id: idOffset + index + 1,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        idOffset + index + 1
      }.png`,
    }));
  }
  /**
   * Handles the page change event when the user navigates to a new page in the pagination.
   * It updates the `apiUrl` based on the next or previous page URL, and then calls `_callServiceList`
   * to fetch the new set of Pokémon for the current page.
   *
   * @param _event The page event that contains information about the previous and current page indices.
   * @returns void
   */
  getPage(_event: PageEvent): void {
    const previousPageIndex = _event.previousPageIndex ?? -1;
    this.#apiUrl =
      _event.pageIndex > previousPageIndex
        ? this.dataPokemon.next
        : this.dataPokemon.previous;
    this._callServiceList();
  }

  /**
   * Extracts the 'offset' value from the current URL, which is used to calculate the starting point
   * for fetching Pokémon data.
   *
   * @returns The offset value (as a number), or 0 if no offset is present.
   */
  private _getOffsetFromUrl(): number {
    const urlParams: URLSearchParams = new URL(this.#apiUrl).searchParams;
    return Number(urlParams.get('offset')) || 0;
  }

  /**
   * Applies a filter to the Pokémon list based on the search input.
   * If the input is not empty, it calls `_filterPokemon` to filter the data,
   * otherwise it fetches the complete list of Pokémon by calling `_callServiceList`.
   *
   * @param event The keyboard event that contains the input value.
   * @returns void
   */
  applyFilter(event: KeyboardEvent): void {
    const inputValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    inputValue ? this._filterPokemon(inputValue) : this._callServiceList();
  }

  /**
   * Filters the Pokémon list based on the search input value.
   * It compares the Pokémon names with the search term and updates `dataSource.data` with the filtered results.
   *
   * @param searchValue The search term entered by the user.
   * @returns void
   */
  private _filterPokemon(searchValue: string): void {
    this.dataSource.data = this.allPokemons.filter(
      (pokemon) => pokemon.name === searchValue
    );
  }

  /**
   * Navigates to the Pokémon detail page when a Pokémon name is clicked.
   * This method uses the Angular Router to navigate to the URL corresponding
   * to the Pokémon detail page using the provided name.
   *
   * @param name The name of the Pokémon to navigate to.
   * @returns void
   */
  goToDetail(name: string): void {
    this.router.navigate(['/pokemon', name]);
  }
}
