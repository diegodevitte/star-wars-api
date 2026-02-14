import { BaseController } from './baseController.js';
import { getPeople, getPersonById } from '../lib/swapiClient.js';
import { SwapiListResponse, NormalizedPerson } from '../types.js';

export class PeopleController extends BaseController {
  constructor() {
    super('people');
  }

  protected async fetchAllEntities(page?: string, search?: string): Promise<SwapiListResponse<NormalizedPerson>> {
    return getPeople(page, search);
  }

  protected async fetchEntityById(id: string): Promise<NormalizedPerson> {
    return getPersonById(id);
  }
}

export const peopleController = new PeopleController();