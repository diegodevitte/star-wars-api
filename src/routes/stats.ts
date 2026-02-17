import { Router } from 'express';
import { statsController } from '../controllers/statsController.js';

const router = Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     tags: [Stats]
 *     summary: Get statistics for all Star Wars entities
 *     description: Returns counts for people, planets, starships, and vehicles
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 peopleCount:
 *                   type: integer
 *                   description: Total number of people
 *                 planetsCount:
 *                   type: integer
 *                   description: Total number of planets
 *                 starshipsCount:
 *                   type: integer
 *                   description: Total number of starships
 *                 vehiclesCount:
 *                   type: integer
 *                   description: Total number of vehicles
 *       502:
 *         description: Bad Gateway - Error fetching data from SWAPI
 */
router.get('/', statsController.getStats);

export default router;