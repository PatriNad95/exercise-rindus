import { PokemonListComponent } from './pokemon-list.component';
import { PokemonService } from '../../services/pokemon.service';
import {
  anyString,
  deepEqual,
  instance,
  mock,
  reset,
  verify,
  when,
} from 'ts-mockito';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PokemonListResponse } from '../../utils/pokemon.model';
import { PageEvent } from '@angular/material/paginator';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  const mockPokemonService: PokemonService = mock(PokemonService);
  const mockRouter: Router = mock(Router);

  const mockResponse: PokemonListResponse = {
    results: [{ name: 'test', url: 'test' }],
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=10',
    previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=10',
    count: 100,
  };

  beforeEach(async () => {
    component = new PokemonListComponent(
      instance(mockPokemonService),
      instance(mockRouter)
    );
  });

  beforeEach(() => {
    reset(mockPokemonService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the app', () => {
    when(mockPokemonService.getPokemonList).thenReturn(() => of(mockResponse));
    component.ngOnInit();
    expect(component.dataPokemon.results.length).toBe(1);
    expect(component.dataPokemon.results[0].name).toBe('test');
  });

  it('should update apiUrl with previous on getPage', () => {
    when(mockPokemonService.getPokemonList).thenReturn(() => of(mockResponse));
    component.dataPokemon.previous = mockResponse.previous;
    const mockPageEvent = { pageIndex: 1, previousPageIndex: 2 } as PageEvent;
    component.getPage(mockPageEvent);

    expect(component.dataPokemon).toEqual(mockResponse);
  });

  it('should update apiUrl with next on getPage', () => {
    when(mockPokemonService.getPokemonList).thenReturn(() => of(mockResponse));
    component.dataPokemon.next = mockResponse.next;
    const mockPageEvent = { pageIndex: 1, previousPageIndex: 0 } as PageEvent;
    component.getPage(mockPageEvent);

    expect(component.dataPokemon).toEqual(mockResponse);
  });

  it('should filter the list when applyFilter is called', () => {
    component.allPokemons = [
      { name: 'pikachu', url: 'url1', id: 1, sprite: 'sprite1' },
      { name: 'bulbasaur', url: 'url2', id: 2, sprite: 'sprite2' },
    ];
    component.applyFilter({
      target: { value: 'pikachu' },
    } as unknown as KeyboardEvent);

    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('pikachu');
  });

  it('should show all list', () => {
    spyOn(component as any, '_callServiceList');
    component.applyFilter({
      target: { value: '' },
    } as unknown as KeyboardEvent);

    expect(component['_callServiceList']).toHaveBeenCalled();
  });

  it('should navigate to the correct detail page when goToDetail is called', () => {
    component.goToDetail('pikachu');

    verify(mockRouter.navigate(deepEqual(['/pokemon', 'pikachu']))).once();
  });
});
