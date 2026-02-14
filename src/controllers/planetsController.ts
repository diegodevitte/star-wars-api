import { BaseController } from './baseController.js';
import { getPlanets, getPlanetById } from '../lib/swapiClient.js';
import { SwapiListResponse, NormalizedPlanet } from '../types.js';

export class PlanetsController extends BaseController {
  constructor() {
    super('planets');
  }

  protected async fetchAllEntities(page?: string, search?: string): Promise<SwapiListResponse<NormalizedPlanet>> {
    return getPlanets(page, search);
  }

  protected async fetchEntityById(id: string): Promise<NormalizedPlanet> {
    return getPlanetById(id);
  }
}

export const planetsController = new PlanetsController();