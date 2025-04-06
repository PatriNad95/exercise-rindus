import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { PokemonDetail, PokemonListResponse } from '../utils/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  getPokemonList(apiUrl: string): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching Pokémon:', error);
        return throwError(() => new Error('Could not fetch Pokémon list.'));
      })
    );
  }

  getPokemonDetails(name: string): Observable<PokemonDetail> {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
    return this.http.get<PokemonDetail>(`${apiUrl}/${name}`).pipe(
      catchError((error) => {
        console.error('Error fetching Pokémon:', error);
        return throwError(() => new Error('Could not fetch Pokémon details.'));
      })
    );
  }

  getPokemonData(apiUrl: string): Observable<any> {
    return this.http.get<any>(apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching Pokémon:', error);
        return throwError(() => new Error('Could not fetch Pokémon data.'));
      })
    );
  }
}
