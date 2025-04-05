import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  Abilities,
  LocationAreasResponse,
  PokemonDetail,
} from '../../utils/pokemon.model';
import _ from 'lodash';

@Component({
  selector: 'app-pokemon-detail',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
})
export class PokemonDetailComponent implements OnInit {
  pokemon: PokemonDetail = {} as PokemonDetail;
  abilities: Abilities[] = [];
  types: string[] = [];
  locations: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const name: string | null = this.route.snapshot.paramMap.get('name');
    this.pokemonService.getPokemonDetails(name!).subscribe({
      next: (data) => {
        this.pokemon = { ...data, name: _.capitalize(data.name) };
        console.log(this.pokemon);
      },
      error: (err) => console.error('Error obtaining pokemon detail:', err),
    });
  }

  /**
   * Resets the `abilities`, `types`, and `locations` arrays to clear the previous data.
   * This method is used before each call to `getAbilities()`, `getTypes()`, and `getLocation()`
   * to ensure that data from different requests does not get mixed.
   */
  private resetData() {
    this.abilities = [];
    this.types = [];
    this.locations = [];
  }

  /**
   * Fetches the abilities of the Pokémon from the API and stores them in the `abilities` array.
   * Before fetching, it resets the existing data by calling `resetData()`.
   * For each ability, it retrieves detailed data from the API and extracts its effect in English.
   *
   * @returns void
   */
  getAbilities(): void {
    this.resetData();
    this.pokemon.abilities.forEach((ability) => {
      this.pokemonService.getPokemonData(ability.ability.url).subscribe({
        next: (data) => {
          const effect = data.effect_entries.filter(
            (effects: any) => effects.language.name === 'en'
          )[0].effect;
          this.abilities.push({
            name: _.capitalize(data.name),
            effect,
          });
        },
        error: (err) =>
          console.error('Error obtaining pokemon abilities:', err),
      });
    });
  }

  /**
   * Fetches the types of the Pokémon from the API and stores them in the `types` array.
   * Before fetching, it resets the existing data by calling `resetData()`.
   *
   * @returns void
   */
  getTypes(): void {
    this.resetData();
    this.pokemon.types.forEach((type) => {
      this.pokemonService.getPokemonData(type.type.url).subscribe({
        next: (data) => {
          this.types.push(_.capitalize(data.name));
        },
        error: (err) =>
          console.error('Error obtaining pokemon abilities:', err),
      });
    });
  }

  /**
   * Fetches the location areas where the Pokémon can be found from the API and stores them in the `locations` array.
   * Before fetching, it resets the existing data by calling `resetData()`.
   *
   * @returns void
   */
  getLocation() {
    this.resetData();
    this.pokemonService
      .getPokemonData(this.pokemon.location_area_encounters)
      .subscribe({
        next: (data) => {
          data.forEach((location: LocationAreasResponse) => {
            this.locations.push(
              _.capitalize(location.location_area.name).replaceAll('-', ' ')
            );
          });
        },
        error: (err) =>
          console.error('Error obtaining pokemon abilities:', err),
      });
  }

  /**
   * Navigates the user to the previous page using Angular's `Router`.
   * This method leverages relative navigation to go back one step in the route history.
   *
   * @returns void
   */
  goBackList(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
