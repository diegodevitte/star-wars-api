import { Router } from 'express';
import { planetsController } from '../controllers/planetsController.js';

const router = Router();

/**
 * GET /planets - List planets with pagination and search
 */
router.get('/', planetsController.getAll);

/**
 * GET /planets/:id - Get planet by ID
 */
router.get('/:id', planetsController.getById);

export default router;