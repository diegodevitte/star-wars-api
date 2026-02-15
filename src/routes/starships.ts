import { Router } from 'express';
import { starshipsController } from '../controllers/starshipsController.js';

const router = Router();

/**
 * @swagger
 * /starships:
 *   get:
 *     summary: Lista todas las naves espaciales
 *     description: Obtiene una lista paginada de naves espaciales de Star Wars con opciones de búsqueda
 *     tags: [Starships]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Lista de naves espaciales obtenida exitosamente
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
 *                         $ref: '#/components/schemas/Starship'
 *             example:
 *               count: 37
 *               next: "http://localhost:4000/starships?page=2"
 *               previous: null
 *               results:
 *                 - id: "2"
 *                   name: "CR90 corvette"
 *                   model: "CR90 corvette"
 *                   manufacturer: "Corellian Engineering Corporation"
 *                   cost_in_credits: "3500000"
 *                   length: "150"
 *                   crew: "30-165"
 *                   passengers: "600"
 *                   starship_class: "corvette"
 *       502:
 *         $ref: '#/components/responses/BadGateway'
 */
router.get('/', starshipsController.getAll);

/**
 * @swagger
 * /starships/{id}:
 *   get:
 *     summary: Obtiene una nave espacial por ID
 *     description: Retorna los detalles de una nave espacial específica usando su ID
 *     tags: [Starships]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Nave espacial encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Starship'
 *             example:
 *               id: "2"
 *               name: "CR90 corvette"
 *               model: "CR90 corvette"
 *               manufacturer: "Corellian Engineering Corporation"
 *               cost_in_credits: "3500000"
 *               length: "150"
 *               crew: "30-165"
 *               passengers: "600"
 *               starship_class: "corvette"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       502:
 *         $ref: '#/components/responses/BadGateway'
 */
router.get('/:id', starshipsController.getById);

export default router;