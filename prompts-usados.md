// Pedir a copilot que implemente el Agent AI respetando infraestructura actual del backend
Necesito que implementes un módulo nuevo de “chat” dentro de este backend TypeScript llamado STAR-WARS-API, respetando la arquitectura actual del repo:

Estructura existente (ya está):

- src/controllers/
  - baseController.ts
  - peopleController.ts
  - planetsController.ts
  - starshipsController.ts
  - vehiclesController.ts
  - index.ts (exporta controllers)
- src/routes/
  - people.ts
  - planets.ts
  - starships.ts
  - vehicles.ts
  - index.ts (monta routes)
- src/lib/
  - swapiClient.ts (cliente para consumir SWAPI)
- src/index.ts (entrypoint)
- src/swagger.ts (swagger)
- src/types.ts (tipos compartidos)

OBJETIVO
Agregar un chat básico listo para usar como agente conversacional que:

1. reciba consultas en lenguaje natural sobre Star Wars,
2. responda basándose en datos de SWAPI (usando el swapiClient existente),
3. deje el código preparado para enchufar un LLM por API key vía variables de entorno (OpenAI / Anthropic / etc), PERO con un fallback sin LLM para que funcione igual.

IMPORTANTE

- No cambies lo existente salvo lo mínimo indispensable para registrar la nueva ruta/controlador.
- Mantén el mismo estilo de separación controller/route/lib.
- Agrega tipado fuerte y manejo de errores consistente con el proyecto.
- No agregues dependencias pesadas (preferir utilidades pequeñas). Si necesitás validar env, podés hacerlo con lógica simple o una lib liviana, pero priorizá no agregar deps.

REQUISITOS DE API (Chat)

1. Crear endpoint:
   - POST /chat
   - Body: { message: string, sessionId?: string }
   - Response: {
     reply: string,
     actions?: Array<{ tool: string, input: any, outputSummary?: any }>,
     sources?: Array<{ type: string, url?: string, id?: string, name?: string }>
     }
2. El endpoint debe:
   - Detectar intención (people/planets/starships/vehicles/films/species si existe soporte; si no, limitar a lo que ya está: people/planets/starships/vehicles).
   - Consultar SWAPI para responder (ideal: search por texto).
   - Devolver una respuesta “humana” + opcionalmente actions/sources para trazabilidad.

LLM PREPARADO POR ENV (sin acoplar a un proveedor específico)

- Definir env vars (leerlas de process.env):
  - LLM_PROVIDER: "openai" | "anthropic" | "none" (default: "none")
  - LLM_API_KEY: string | undefined
  - LLM_MODEL: string | undefined
- Crear un adapter común: LlmClient con método generate(options) => string
- Implementaciones:
  - NoneLlmClient: no llama a nada, retorna null/undefined para forzar fallback
  - OpenAIClient / AnthropicClient: dejarlos preparados (estructura + request skeleton) pero sin hardcode; si falta API key, deben degradar a fallback sin romper.
  - NO implementar lógica compleja de tool-calling real si complica; con que exista la interfaz y el wiring por env es suficiente.

FALLBACK SIN LLM (debe funcionar hoy)

- Implementar un parser sencillo basado en keywords:
  - Si message contiene “personaje”, “people”, “who is”, “quién es”, usar people search con el resto del texto
  - Si contiene “planeta”, “planet”, usar planets search
  - Si contiene “nave”, “starship”, usar starships search
  - Si contiene “vehículo”, “vehicle”, usar vehicles search
  - Si no detecta entidad, intentar buscar en people primero y si no hay resultados, planets, starships, vehicles.
- Para responder:
  - Si hay 1 resultado: dar un resumen corto con campos relevantes (name + 3-5 atributos claves)
  - Si hay varios: listar top 3 con nombre y un atributo distintivo, y pedir aclaración (“¿te referís a X o Y?”)

INTEGRACIÓN CON SWAPI

- Reutilizar src/lib/swapiClient.ts
- Si el swapiClient no expone búsqueda genérica, crear en src/lib/ un wrapper “swapiTools.ts” o extender el cliente de forma mínima para:
  - searchPeople(query)
  - searchPlanets(query)
  - searchStarships(query)
  - searchVehicles(query)
    (usar el endpoint SWAPI /<resource>/?search=)
- Manejar errores de red/timeout con mensajes claros.

ARCHIVOS A CREAR/MODIFICAR
Crear:

- src/controllers/chatController.ts
- src/routes/chat.ts
- src/services/chat/
  - chatService.ts (orquestación)
  - intentParser.ts (fallback parser)
- src/lib/llm/
  - llmClient.ts (interface + types)
  - noneClient.ts
  - openaiClient.ts (skeleton)
  - anthropicClient.ts (skeleton)
- src/types.ts (si necesitás agregar tipos de request/response del chat)
  Modificar (mínimo):
- src/controllers/index.ts (exportar ChatController si aplica)
- src/routes/index.ts (montar /chat)
- src/swagger.ts (documentar POST /chat)

SWAGGER

- Documentar el endpoint POST /chat con ejemplo de request/response y errores.
- Mantener el patrón de swagger ya usado.

CRITERIOS DE ACEPTACIÓN

- POST /chat responde con 200 y reply para consultas típicas:
  - “¿Quién es Luke Skywalker?”
  - “Decime sobre Tatooine”
  - “Qué nave es el Millennium Falcon?”
  - “Vehículos de Endor” (si no se puede resolver, responder con aclaración)
- Si SWAPI no responde, devolver 502/503 con mensaje consistente.
- Si LLM_PROVIDER != "none" pero falta LLM_API_KEY, NO debe romper: fallback funciona igual.
- Código tipado, sin any innecesario, y con estructura consistente con controllers/routes/lib.
- No rompe rutas existentes.

Ahora: implementa TODO lo anterior, generando el código necesario en esos archivos y actualizando los index.ts correspondientes.
