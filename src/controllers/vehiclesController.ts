import { BaseController } from './baseController.js';
import { getVehicles, getVehicleById } from '../lib/swapiClient.js';
import { SwapiListResponse, NormalizedVehicle } from '../types.js';

export class VehiclesController extends BaseController {
  constructor() {
    super('vehicles');
  }

  protected async fetchAllEntities(page?: string, search?: string): Promise<SwapiListResponse<NormalizedVehicle>> {
    return getVehicles(page, search);
  }

  protected async fetchEntityById(id: string): Promise<NormalizedVehicle> {
    return getVehicleById(id);
  }
}

export const vehiclesController = new VehiclesController();