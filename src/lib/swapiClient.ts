import { 
  SwapiListResponse, 
  SwapiPerson, 
  SwapiPlanet, 
  SwapiStarship, 
  SwapiVehicle,
  NormalizedPerson,
  NormalizedPlanet,
  NormalizedStarship,
  NormalizedVehicle,
  SwapiResource
} from '../types.js';

const SWAPI_BASE_URL = process.env.SWAPI_BASE_URL || 'https://swapi.dev/api';
const TIMEOUT_MS = 8000;
const MAX_RETRIES = 1;

export function parseId(url: string): string {
  const match = url.match(/\/(\d+)\/$/);
  return match?.[1] || '';
}

async function fetchWithTimeout(url: string, timeout: number = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

async function makeRequest<T>(url: string, retries: number = MAX_RETRIES): Promise<T> {
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url);
      console.log(`SWAPI request to ${url} - Attempt ${attempt + 1}: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`SWAPI request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as T;
      console.log(`SWAPI request to ${url} succeeded on attempt ${attempt + 1}`);
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === retries) {
        console.error(`SWAPI request to ${url} failed after ${attempt + 1} attempts:`, lastError);
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error(`SWAPI request failed after ${retries + 1} attempts: ${lastError.message}`);
}

/**
 * Normalize SWAPI item by adding ID field
 */
function normalizeItem<T extends { url: string }>(item: T): T & { id: string } {
  return {
    ...item,
    id: parseId(item.url),
  };
}

/**
 * Get list of resources from SWAPI
 */
export async function getList<T extends { url: string }>(
  resource: SwapiResource,
  page?: string,
  search?: string
): Promise<SwapiListResponse<T & { id: string }>> {
  const params = new URLSearchParams();
  
  if (page) {
    params.append('page', page);
  }
  
  if (search) {
    params.append('search', search);
  }

  const url = `${SWAPI_BASE_URL}/${resource}/?${params.toString()}`;
  const response = await makeRequest<SwapiListResponse<T>>(url);

  return {
    ...response,
    results: response.results.map(item => normalizeItem(item)),
  };
}

/**
 * Get single resource by ID from SWAPI
 */
export async function getById<T extends { url: string }>(
  resource: SwapiResource,
  id: string
): Promise<T & { id: string }> {
  const url = `${SWAPI_BASE_URL}/${resource}/${id}/`;
  const response = await makeRequest<T>(url);
  
  return normalizeItem(response);
}

/**
 * Get people list
 */
export async function getPeople(page?: string, search?: string): Promise<SwapiListResponse<NormalizedPerson>> {
  return getList<SwapiPerson>('people', page, search);
}

/**
 * Get person by ID
 */
export async function getPersonById(id: string): Promise<NormalizedPerson> {
  return getById<SwapiPerson>('people', id);
}

/**
 * Get planets list
 */
export async function getPlanets(page?: string, search?: string): Promise<SwapiListResponse<NormalizedPlanet>> {
  return getList<SwapiPlanet>('planets', page, search);
}

/**
 * Get planet by ID
 */
export async function getPlanetById(id: string): Promise<NormalizedPlanet> {
  return getById<SwapiPlanet>('planets', id);
}

/**
 * Get starships list
 */
export async function getStarships(page?: string, search?: string): Promise<SwapiListResponse<NormalizedStarship>> {
  return getList<SwapiStarship>('starships', page, search);
}

/**
 * Get starship by ID
 */
export async function getStarshipById(id: string): Promise<NormalizedStarship> {
  return getById<SwapiStarship>('starships', id);
}

/**
 * Get vehicles list
 */
export async function getVehicles(page?: string, search?: string): Promise<SwapiListResponse<NormalizedVehicle>> {
  return getList<SwapiVehicle>('vehicles', page, search);
}

/**
 * Get vehicle by ID
 */
export async function getVehicleById(id: string): Promise<NormalizedVehicle> {
  return getById<SwapiVehicle>('vehicles', id);
}