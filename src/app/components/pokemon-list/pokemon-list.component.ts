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

  private _callServiceList() {
    this.pokemonService.getPokemonList(this.#apiUrl).subscribe({
      next: (data) => {
        this.dataPokemon = data;
        const idCounter = this._getOffsetFromUrl();
        this.dataSource.data = this._mapPokemonData(data.results, idCounter);
      },
      error: (err) => console.error('Error obtaining pokemon list:', err),
    });
  }

  private _getAllPokemons() {
    const allPokemonsUrl = `${this.#apiUrl}?limit=2000&offset=0`;
    this.pokemonService.getPokemonList(allPokemonsUrl).subscribe({
      next: (data) => {
        this.allPokemons = this._mapPokemonData(data.results, 0);
      },
      error: (err) => console.error('Error obtaining all pokemon list:', err),
    });
  }

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

  getPage(_event: PageEvent) {
    const previousPageIndex = _event.previousPageIndex ?? -1;
    this.#apiUrl =
      _event.pageIndex > previousPageIndex
        ? this.dataPokemon.next
        : this.dataPokemon.previous;
    this._callServiceList();
  }

  private _getOffsetFromUrl(): number {
    const urlParams: URLSearchParams = new URL(this.#apiUrl).searchParams;
    return Number(urlParams.get('offset')) || 0;
  }

  applyFilter(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    inputValue ? this._filterPokemon(inputValue) : this._callServiceList();
  }

  private _filterPokemon(searchValue: string) {
    this.dataSource.data = this.allPokemons.filter(
      (pokemon) => pokemon.name === searchValue
    );
  }

  goToDetail(name: string) {
    this.router.navigate(['/pokemon', name]);
  }
}
