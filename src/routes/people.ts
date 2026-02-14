import { Router } from 'express';
import { peopleController } from '../controllers/peopleController.js';

const router = Router();

/**
 * GET /people - List people with pagination and search
 */
router.get('/', peopleController.getAll);

/**
 * GET /people/:id - Get person by ID
 */
router.get('/:id', peopleController.getById);

export default router;