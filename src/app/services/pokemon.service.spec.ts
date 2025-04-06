import { TestBed } from '@angular/core/testing';

import { PokemonService } from './pokemon.service';
import { anything, instance, mock, reset, when } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { PokemonDetail, PokemonListResponse } from '../utils/pokemon.model';
import { of, throwError } from 'rxjs';

describe('PokemonService', () => {
  let service: PokemonService;
  const mockHttpClient: HttpClient = mock(HttpClient);

  beforeEach(() => {
    service = new PokemonService(instance(mockHttpClient));
  });

  afterEach(() => {
    reset(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getPokemonList', () => {
    const mockResponse: PokemonListResponse = {
      count: 1,
      previous: '',
      next: '',
      results: [],
    };
    when(mockHttpClient.get(anything())).thenReturn(of(mockResponse));
    service.getPokemonList('url').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  });

  it('should getPokemonDetails error', () => {
    when(mockHttpClient.get(anything())).thenReturn(
      throwError(() => new Error('error'))
    );
    service.getPokemonList('url').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Could not fetch Pokémon list.');
      },
    });
  });

  it('should getPokemonDetails', () => {
    const mockResponse = {
      name: 'test',
    } as PokemonDetail;
    when(mockHttpClient.get(anything())).thenReturn(of(mockResponse));
    service.getPokemonDetails('name').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  });

  it('should getPokemonDetails error', () => {
    when(mockHttpClient.get(anything())).thenReturn(
      throwError(() => new Error('error'))
    );
    service.getPokemonDetails('name').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Could not fetch Pokémon details.');
      },
    });
  });

  it('should getPokemonData', () => {
    const mockResponse: PokemonListResponse = {
      count: 1,
      previous: '',
      next: '',
      results: [],
    };
    when(mockHttpClient.get(anything())).thenReturn(of(mockResponse));
    service.getPokemonData('url').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  });

  it('should getPokemonData error', () => {
    when(mockHttpClient.get(anything())).thenReturn(
      throwError(() => new Error('error'))
    );
    service.getPokemonData('apiUrl').subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Could not fetch Pokémon data.');
      },
    });
  });
});
