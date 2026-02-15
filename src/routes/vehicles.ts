import { Router } from 'express';
import { vehiclesController } from '../controllers/vehiclesController.js';

const router = Router();

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Lista todos los vehículos
 *     description: Obtiene una lista paginada de vehículos de Star Wars con opciones de búsqueda
 *     tags: [Vehicles]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida exitosamente
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
 *                         $ref: '#/components/schemas/Vehicle'
 *             example:
 *               count: 39
 *               next: "http://localhost:4000/vehicles?page=2"
 *               previous: null
 *               results:
 *                 - id: "4"
 *                   name: "Sand Crawler"
 *                   model: "Digger Crawler"
 *                   manufacturer: "Corellia Mining Corporation"
 *                   cost_in_credits: "150000"
 *                   length: "36.8"
 *                   crew: "46"
 *                   passengers: "30"
 *                   vehicle_class: "wheeled"
 *       502:
 *         $ref: '#/components/responses/BadGateway'
 */
router.get('/', vehiclesController.getAll);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Obtiene un vehículo por ID
 *     description: Retorna los detalles de un vehículo específico usando su ID
 *     tags: [Vehicles]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Vehículo encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *             example:
 *               id: "4"
 *               name: "Sand Crawler"
 *               model: "Digger Crawler"
 *               manufacturer: "Corellia Mining Corporation"
 *               cost_in_credits: "150000"
 *               length: "36.8"
 *               crew: "46"
 *               passengers: "30"
 *               vehicle_class: "wheeled"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       502:
 *         $ref: '#/components/responses/BadGateway'
 */
router.get('/:id', vehiclesController.getById);

export default router;