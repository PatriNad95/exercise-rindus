import { TestBed } from '@angular/core/testing';

import { PokemonDetailComponent } from './pokemon-detail.component';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  anything,
  instance,
  mock,
  strictEqual,
  verify,
  when,
} from 'ts-mockito';
import { PokemonDetail } from '../../utils/pokemon.model';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  const mockPokemonService: PokemonService = mock(PokemonService);
  const mockRouter: Router = mock(Router);
  let mockActivatedRoute: ActivatedRoute = mock(ActivatedRoute);

  const mockPokemonDetail: PokemonDetail = {
    name: 'pikachu',
    abilities: [
      {
        ability: { name: 'static', url: 'http://mock-api/ability/1' },
        is_hidden: false,
        slot: 1,
      },
    ],
    types: [
      {
        slot: 1,
        type: { name: 'electric', url: 'http://mock-api/type/13' },
      },
    ],
    location_area_encounters: 'http://mock-api/location/1',
  } as any;

  beforeEach(async () => {
    component = new PokemonDetailComponent(
      instance(mockActivatedRoute),
      instance(mockPokemonService),
      instance(mockRouter)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPokemonDetails on init', () => {
    when(mockPokemonService.getPokemonDetails('pikachu')).thenReturn(
      of(mockPokemonDetail)
    );
    when(mockActivatedRoute.snapshot).thenReturn({
      params: { name: 'pikachu' },
    } as any);
    component.ngOnInit();
    verify(mockPokemonService.getPokemonDetails('pikachu')).once();
    expect(component.pokemon.name).toBe('Pikachu');
  });

  it('should fetch abilities and populate array', () => {
    const abilityMockResponse = {
      name: 'static',
      effect_entries: [
        {
          effect: 'May paralyze on contact',
          language: { name: 'en' },
        },
      ],
    };
    when(mockPokemonService.getPokemonData).thenReturn(() =>
      of(abilityMockResponse)
    );
    component.pokemon = mockPokemonDetail;
    component.getAbilities();
    expect(component.abilities.length).toBe(1);
    expect(component.abilities[0].name).toBe('Static');
  });

  it('should fetch types and populate array', () => {
    const typeMockResponse = { name: 'electric' };
    when(mockPokemonService.getPokemonData).thenReturn(() =>
      of(typeMockResponse)
    );
    component.pokemon = mockPokemonDetail;
    component.getTypes();

    expect(component.types[0]).toBe('Electric');
  });

  it('should fetch locations and populate array', () => {
    const locationMockResponse = [
      {
        location_area: { name: 'power-plant' },
      },
    ];

    when(mockPokemonService.getPokemonData).thenReturn(() =>
      of(locationMockResponse)
    );
    component.pokemon = mockPokemonDetail;

    component.getLocation();

    expect(component.locations).toContain('Power plant');
  });

  it('should navigate back to list', () => {
    component.goBackList();
    verify(mockRouter.navigate(anything(), anything())).once();
  });
});
