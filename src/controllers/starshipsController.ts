import { BaseController } from './baseController.js';
import { getStarships, getStarshipById } from '../lib/swapiClient.js';
import { SwapiListResponse, NormalizedStarship } from '../types.js';

export class StarshipsController extends BaseController {
  constructor() {
    super('starships');
  }

  protected async fetchAllEntities(page?: string, search?: string): Promise<SwapiListResponse<NormalizedStarship>> {
    return getStarships(page, search);
  }

  protected async fetchEntityById(id: string): Promise<NormalizedStarship> {
    return getStarshipById(id);
  }
}

export const starshipsController = new StarshipsController();