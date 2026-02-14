import { Request, Response } from 'express';
import { ListQueryParams, SwapiListResponse } from '../types.js';

export abstract class BaseController {
  protected entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  /**
   * Get all entities with pagination and search
   */
  public getAll = async (req: Request<{}, {}, {}, ListQueryParams>, res: Response) => {
    try {
      const { page, search } = req.query;
      
      const response = await this.fetchAllEntities(page, search);
      console.log(`Fetched ${response.results.length} ${this.entityName} from SWAPI (page: ${page || '1'}, search: ${search || 'none'})`);
      
      res.json(response);
    } catch (error) {
      console.error(`Error fetching ${this.entityName}:`, error);
      res.status(502).json({
        message: `Failed to fetch ${this.entityName} from SWAPI`,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * Get entity by ID
   */
  public getById = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      
      if (!/^\d+$/.test(id)) {
        res.status(400).json({
          message: 'Invalid ID format',
        });
        return;
      }
      
      const entity = await this.fetchEntityById(id);
      
      res.json(entity);
    } catch (error) {
      console.error(`Error fetching ${this.entityName} ${req.params.id}:`, error);
      
      if (error instanceof Error && error.message.includes('404')) {
        res.status(404).json({
          message: `${this.entityName.charAt(0).toUpperCase() + this.entityName.slice(1)} not found`,
        });
        return;
      }
      
      res.status(502).json({
        message: `Failed to fetch ${this.entityName} from SWAPI`,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Abstract methods to be implemented by child controllers
  protected abstract fetchAllEntities(page?: string, search?: string): Promise<SwapiListResponse<any>>;
  protected abstract fetchEntityById(id: string): Promise<any>;
}