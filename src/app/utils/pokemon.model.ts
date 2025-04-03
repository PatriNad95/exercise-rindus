export interface PokemonListResponse {
  count: number;
  previous: string;
  next: string;
  results: PokemonBasicInfo[];
}

export interface PokemonBasicInfo {
  name: string;
  url: string;
  id?: number;
  sprite?: string;
}
