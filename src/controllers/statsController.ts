import { Request, Response } from 'express';
import { getPeople, getPlanets, getStarships, getVehicles } from '../lib/swapiClient.js';
import { StatsResponse } from '../types.js';

export class StatsController {
  public getStats = async (req: Request, res: Response) => {
    try {
      const [people, planets, starships, vehicles] = await Promise.all([
        getPeople(),
        getPlanets(),
        getStarships(),
        getVehicles()
      ]);

      const stats: StatsResponse = {
        peopleCount: people.count,
        planetsCount: planets.count,
        starshipsCount: starships.count,
        vehiclesCount: vehicles.count,
      };

      console.log('Stats fetched successfully:', stats);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(502).json({
        message: 'Failed to fetch statistics from SWAPI',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export const statsController = new StatsController();