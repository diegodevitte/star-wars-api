import { Router } from 'express';
import { vehiclesController } from '../controllers/vehiclesController.js';

const router = Router();

/**
 * GET /vehicles - List vehicles with pagination and search
 */
router.get('/', vehiclesController.getAll);

/**
 * GET /vehicles/:id - Get vehicle by ID
 */
router.get('/:id', vehiclesController.getById);

export default router;