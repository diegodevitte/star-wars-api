import { Router } from 'express';
import { starshipsController } from '../controllers/starshipsController.js';

const router = Router();

/**
 * GET /starships - List starships with pagination and search
 */
router.get('/', starshipsController.getAll);

/**
 * GET /starships/:id - Get starship by ID
 */
router.get('/:id', starshipsController.getById);

export default router;