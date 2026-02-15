import { Router } from 'express';
import { planetsController } from '../controllers/planetsController.js';

const router = Router();

/**
 * @swagger
 * /planets:
 *   get:
 *     summary: Lista todos los planetas
 *     description: Obtiene una lista paginada de planetas de Star Wars con opciones de búsqueda
 *     tags: [Planets]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Lista de planetas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ListResponse'
 *                 - type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Planet'
 *             example:
 *               count: 60
 *               next: "http://localhost:4000/planets?page=2"
 *               previous: null
 *               results:
 *                 - id: "1"
 *                   name: "Tatooine"
 *                   rotation_period: "23"
 *                   orbital_period: "304"
 *                   diameter: "10465"
 *                   climate: "arid"
 *                   gravity: "1 standard"
 *                   terrain: "desert"
 *                   surface_water: "1"
 *                   population: "200000"
 *       502:
 *         $ref: '#/components/responses/BadGateway'
 */
router.get('/', planetsController.getAll);

/**
 * @swagger
 * /planets/{id}:
 *   get:
 *     summary: Obtiene un planeta por ID
 *     description: Retorna los detalles de un planeta específico usando su ID
 *     tags: [Planets]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Planeta encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Planet'
 *             example:
 *               id: "1"
 *               name: "Tatooine"
 *               rotation_period: "23"
 *               orbital_period: "304"
 *               diameter: "10465"
 *               climate: "arid"
 *               gravity: "1 standard"
 *               terrain: "desert"
 *               surface_water: "1"
 *               population: "200000"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       502:
 *         $ref: '#/components/responses/BadGateway'
 */
router.get('/:id', planetsController.getById);

export default router;