export interface SwapiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiPlanet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiStarship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiVehicle {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export type NormalizedPerson = SwapiPerson & { id: string };
export type NormalizedPlanet = SwapiPlanet & { id: string };
export type NormalizedStarship = SwapiStarship & { id: string };
export type NormalizedVehicle = SwapiVehicle & { id: string };

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface StatsResponse {
  peopleCount: number;
  planetsCount: number;
  starshipsCount: number;
  vehiclesCount: number;
}

export interface ListQueryParams {
  page?: string;
  search?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export type SwapiResource = 'people' | 'planets' | 'starships' | 'vehicles';

// Chat related types
export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatAction {
  tool: string;
  input: any;
  outputSummary?: any;
}

export interface ChatSource {
  type: string;
  url?: string;
  id?: string;
  name?: string;
}

export interface ChatResponse {
  reply: string;
  actions?: ChatAction[];
  sources?: ChatSource[];
}

export type LLMProvider = 'openai' | 'anthropic' | 'none';

export type IntentType = 'people' | 'planets' | 'starships' | 'vehicles' | 'unknown';

export interface LLMGenerateOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ParsedIntent {
  intent: IntentType;
  query: string;
  confidence: number;
}