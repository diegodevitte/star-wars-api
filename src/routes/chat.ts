import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';

const router = Router();

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Procesa un mensaje de chat sobre Star Wars
 *     description: Recibe consultas en lenguaje natural sobre Star Wars y responde basándose en datos de SWAPI
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatRequest'
 *           examples:
 *             personaje:
 *               summary: Pregunta sobre un personaje
 *               value:
 *                 message: "¿Quién es Luke Skywalker?"
 *                 sessionId: "optional-session-123"
 *             planeta:
 *               summary: Pregunta sobre un planeta
 *               value:
 *                 message: "Cuéntame sobre Tatooine"
 *             nave:
 *               summary: Pregunta sobre una nave
 *               value:
 *                 message: "Qué nave es el Millennium Falcon?"
 *             consulta_general:
 *               summary: Consulta general
 *               value:
 *                 message: "¿Qué sabes sobre Jedis?"
 *     responses:
 *       200:
 *         description: Respuesta del chat generada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *             examples:
 *               respuesta_personaje:
 *                 summary: Respuesta sobre un personaje
 *                 value:
 *                   reply: "**Luke Skywalker** es un personaje de Star Wars. Altura: 172cm, Peso: 77kg, Año de nacimiento: 19BBY, Género: male."
 *                   actions:
 *                     - tool: "swapi_search"
 *                       input: 
 *                         resource: "people"
 *                         query: "Luke Skywalker"
 *                       outputSummary: "Encontrado: Luke Skywalker"
 *                   sources:
 *                     - type: "people"
 *                       id: "1"
 *                       name: "Luke Skywalker"
 *                       url: "https://swapi.dev/api/people/1/"
 *               respuesta_multiples:
 *                 summary: Múltiples resultados
 *                 value:
 *                   reply: "Encontré varios personajes: Luke Skywalker, Leia Organa, Han Solo. ¿Cuál te interesa específicamente?"
 *                   sources:
 *                     - type: "people"
 *                       id: "1"
 *                       name: "Luke Skywalker"
 *                       url: "https://swapi.dev/api/people/1/"
 *                     - type: "people"
 *                       id: "2"
 *                       name: "Leia Organa"
 *                       url: "https://swapi.dev/api/people/2/"
 *       400:
 *         description: Solicitud incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *             example:
 *               reply: "Por favor, proporciona un mensaje válido."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *             example:
 *               reply: "Lo siento, ha ocurrido un error interno. Por favor, inténtalo de nuevo más tarde."
 *       502:
 *         description: Error del servicio SWAPI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *             example:
 *               reply: "Lo siento, ha ocurrido un error al buscar en la base de datos. Por favor, inténtalo de nuevo."
 */
router.post('/', chatController.chat);

/**
 * @swagger
 * /chat/health:
 *   get:
 *     summary: Estado del servicio de chat
 *     description: Verifica el estado del servicio de chat y la disponibilidad del LLM
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Estado del servicio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 service:
 *                   type: string
 *                   example: "chat"
 *                 llmProvider:
 *                   type: string
 *                   example: "openai"
 *                 llmAvailable:
 *                   type: boolean
 *                   example: true
 *                 fallbackEnabled:
 *                   type: boolean
 *                   example: true
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-02-15T10:30:00Z"
 *       500:
 *         description: Error en el health check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Chat service health check failed"
 */
router.get('/health', chatController.health);

export default router;