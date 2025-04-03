export interface PokemonListResponse {
  count: number;
  previous: string;
  next: string;
  results: PokemonBasicInfo[];
}

export interface PokemonBasicInfo extends CommonData {
  id?: number;
  sprite?: string;
}

export interface PokemonDetail {
  name: string;
  abilities: {
    ability: CommonData;
    is_hidden: boolean;
    slot: number;
  }[];
  base_experience: number;
  types: {
    slot: number;
    type: CommonData;
  }[];
  location_area_encounters: string;
  sprites: {
    front_default: string;
  };
}
interface CommonData {
  name: string;
  url: string;
}

export interface Abilities {
  name: string;
  effect: string;
}

export interface LocationAreasResponse {
  location_area: CommonData;
}
