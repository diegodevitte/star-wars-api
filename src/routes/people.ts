import { Router } from 'express';
import { peopleController } from '../controllers/peopleController.js';

const router = Router();

/**
 * @swagger
 * /people:
 *   get:
 *     summary: Lista todos los personajes
 *     description: Obtiene una lista paginada de personajes de Star Wars con opciones de búsqueda
 *     tags: [People]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Lista de personajes obtenida exitosamente
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
 *                         $ref: '#/components/schemas/Person'
 *             example:
 *               count: 82
 *               next: "http://localhost:4000/people?page=2"
 *               previous: null
 *               results:
 *                 - id: "1"
 *                   name: "Luke Skywalker"
 *                   height: "172"
 *                   mass: "77"
 *                   hair_color: "blond"
 *                   skin_color: "fair"
 *                   eye_color: "blue"
 *                   birth_year: "19BBY"
 *                   gender: "male"
 *       502:
 *         $ref: '#/components/responses/BadGateway'
 */
router.get('/', peopleController.getAll);

/**
 * @swagger
 * /people/{id}:
 *   get:
 *     summary: Obtiene un personaje por ID
 *     description: Retorna los detalles de un personaje específico usando su ID
 *     tags: [People]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Personaje encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *             example:
 *               id: "1"
 *               name: "Luke Skywalker"
 *               height: "172"
 *               mass: "77"
 *               hair_color: "blond"
 *               skin_color: "fair"
 *               eye_color: "blue"
 *               birth_year: "19BBY"
 *               gender: "male"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       502:
 *         $ref: '#/components/responses/BadGateway'
 */
router.get('/:id', peopleController.getById);

export default router;