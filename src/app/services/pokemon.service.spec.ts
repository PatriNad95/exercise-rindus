import { TestBed } from '@angular/core/testing';

import { PokemonService } from './pokemon.service';
import { instance, mock, reset } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';

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
});
