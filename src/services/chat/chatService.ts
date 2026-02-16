import { 
  ChatRequest, 
  ChatResponse, 
  ChatAction, 
  ChatSource, 
  LLMProvider,
  IntentType 
} from '../../types.js';
import { LLMClient, LLMClientFactory } from '../../lib/llm/llmClient.js';
import { IntentParser } from './intentParser.js';
import { 
  getPeople, 
  getPlanets, 
  getStarships, 
  getVehicles 
} from '../../lib/swapiClient.js';

export class ChatService {
  private llmClient: LLMClient;
  private intentParser: IntentParser;

  constructor() {
    const provider = (process.env.LLM_PROVIDER as LLMProvider) || 'none';
    const apiKey = process.env.LLM_API_KEY;
    
    this.llmClient = LLMClientFactory.create(provider, apiKey);
    this.intentParser = new IntentParser();
  }

  async processMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const { message } = request;
      
      // First try to use LLM if available
      if (this.llmClient.isAvailable()) {
        const llmResponse = await this.tryLLMResponse(message);
        if (llmResponse) {
          return llmResponse;
        }
      }

      // Fallback to deterministic parser
      return this.fallbackResponse(message);
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        reply: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
      };
    }
  }

  private async tryLLMResponse(message: string): Promise<ChatResponse | null> {
    try {
      const prompt = `Eres un asistente experto en Star Wars que responde preguntas usando datos de SWAPI (Star Wars API).
      
Usuario pregunta: "${message}"

Instrucciones:
1. Identifica si la pregunta es sobre personajes, planetas, naves espaciales o vehículos
2. Proporciona una respuesta útil y concisa
3. Si no entiendes la pregunta, pide aclaración

Responde de forma natural y amigable en español.`;

      const llmReply = await this.llmClient.generate({ prompt });
      
      if (llmReply) {
        return {
          reply: llmReply,
          actions: [
            {
              tool: 'llm',
              input: { message },
              outputSummary: 'Respuesta generada por LLM'
            }
          ]
        };
      }
      
      return null;
    } catch (error) {
      console.error('LLM response error:', error);
      return null;
    }
  }

  private async fallbackResponse(message: string): Promise<ChatResponse> {
    const intent = this.intentParser.parseIntent(message);
    
    if (intent.intent === 'unknown') {
      // Try searching in all categories
      return this.searchAllCategories(intent.query);
    }

    return this.searchByIntent(intent.intent, intent.query);
  }

  private async searchAllCategories(query: string): Promise<ChatResponse> {
    const actions: ChatAction[] = [];
    const sources: ChatSource[] = [];

    try {
      // Try people first
      const peopleResult = await getPeople('1', query);
      if (peopleResult.results.length > 0) {
        const person = peopleResult.results[0];
        actions.push({
          tool: 'swapi_search',
          input: { resource: 'people', query },
          outputSummary: `Encontrado: ${person.name}`
        });
        sources.push({
          type: 'people',
          id: person.id,
          name: person.name,
          url: person.url
        });
        
        return {
          reply: this.formatPersonResponse(person),
          actions,
          sources
        };
      }

      // Try planets
      const planetsResult = await getPlanets('1', query);
      if (planetsResult.results.length > 0) {
        const planet = planetsResult.results[0];
        actions.push({
          tool: 'swapi_search',
          input: { resource: 'planets', query },
          outputSummary: `Encontrado: ${planet.name}`
        });
        sources.push({
          type: 'planets',
          id: planet.id,
          name: planet.name,
          url: planet.url
        });
        
        return {
          reply: this.formatPlanetResponse(planet),
          actions,
          sources
        };
      }

      // Try starships
      const starshipsResult = await getStarships('1', query);
      if (starshipsResult.results.length > 0) {
        const starship = starshipsResult.results[0];
        actions.push({
          tool: 'swapi_search',
          input: { resource: 'starships', query },
          outputSummary: `Encontrado: ${starship.name}`
        });
        sources.push({
          type: 'starships',
          id: starship.id,
          name: starship.name,
          url: starship.url
        });
        
        return {
          reply: this.formatStarshipResponse(starship),
          actions,
          sources
        };
      }

      // Try vehicles
      const vehiclesResult = await getVehicles('1', query);
      if (vehiclesResult.results.length > 0) {
        const vehicle = vehiclesResult.results[0];
        actions.push({
          tool: 'swapi_search',
          input: { resource: 'vehicles', query },
          outputSummary: `Encontrado: ${vehicle.name}`
        });
        sources.push({
          type: 'vehicles',
          id: vehicle.id,
          name: vehicle.name,
          url: vehicle.url
        });
        
        return {
          reply: this.formatVehicleResponse(vehicle),
          actions,
          sources
        };
      }

      return {
        reply: `No encontré información sobre "${query}" en la base de datos de Star Wars. ¿Podrías ser más específico sobre qué personaje, planeta, nave o vehículo estás buscando?`,
      };

    } catch (error) {
      console.error('Search all categories error:', error);
      return {
        reply: 'Lo siento, ha ocurrido un error al buscar en la base de datos. Por favor, inténtalo de nuevo.',
      };
    }
  }

  private async searchByIntent(intent: IntentType, query: string): Promise<ChatResponse> {
    const actions: ChatAction[] = [];
    const sources: ChatSource[] = [];

    try {
      let result;

      switch (intent) {
        case 'people':
          result = await getPeople('1', query);
          if (result.results.length === 0) {
            return { reply: `No encontré ningún personaje que coincida con "${query}". ¿Podrías verificar el nombre?` };
          }
          if (result.results.length === 1) {
            const person = result.results[0];
            actions.push({
              tool: 'swapi_search',
              input: { resource: 'people', query },
              outputSummary: `Encontrado: ${person.name}`
            });
            sources.push({
              type: 'people',
              id: person.id,
              name: person.name,
              url: person.url
            });
            return {
              reply: this.formatPersonResponse(person),
              actions,
              sources
            };
          } else {
            const names = result.results.slice(0, 3).map(p => p.name).join(', ');
            return {
              reply: `Encontré varios personajes: ${names}. ¿Cuál te interesa específicamente?`,
              sources: result.results.slice(0, 3).map(p => ({
                type: 'people',
                id: p.id,
                name: p.name,
                url: p.url
              }))
            };
          }

        case 'planets':
          result = await getPlanets('1', query);
          if (result.results.length === 0) {
            return { reply: `No encontré ningún planeta que coincida con "${query}".` };
          }
          if (result.results.length === 1) {
            const planet = result.results[0];
            actions.push({
              tool: 'swapi_search',
              input: { resource: 'planets', query },
              outputSummary: `Encontrado: ${planet.name}`
            });
            sources.push({
              type: 'planets',
              id: planet.id,
              name: planet.name,
              url: planet.url
            });
            return {
              reply: this.formatPlanetResponse(planet),
              actions,
              sources
            };
          } else {
            const names = result.results.slice(0, 3).map(p => p.name).join(', ');
            return {
              reply: `Encontré varios planetas: ${names}. ¿Cuál te interesa?`,
              sources: result.results.slice(0, 3).map(p => ({
                type: 'planets',
                id: p.id,
                name: p.name,
                url: p.url
              }))
            };
          }

        case 'starships':
          result = await getStarships('1', query);
          if (result.results.length === 0) {
            return { reply: `No encontré ninguna nave que coincida con "${query}".` };
          }
          if (result.results.length === 1) {
            const starship = result.results[0];
            actions.push({
              tool: 'swapi_search',
              input: { resource: 'starships', query },
              outputSummary: `Encontrado: ${starship.name}`
            });
            sources.push({
              type: 'starships',
              id: starship.id,
              name: starship.name,
              url: starship.url
            });
            return {
              reply: this.formatStarshipResponse(starship),
              actions,
              sources
            };
          } else {
            const names = result.results.slice(0, 3).map(s => s.name).join(', ');
            return {
              reply: `Encontré varias naves: ${names}. ¿Cuál te interesa?`,
              sources: result.results.slice(0, 3).map(s => ({
                type: 'starships',
                id: s.id,
                name: s.name,
                url: s.url
              }))
            };
          }

        case 'vehicles':
          result = await getVehicles('1', query);
          if (result.results.length === 0) {
            return { reply: `No encontré ningún vehículo que coincida con "${query}".` };
          }
          if (result.results.length === 1) {
            const vehicle = result.results[0];
            actions.push({
              tool: 'swapi_search',
              input: { resource: 'vehicles', query },
              outputSummary: `Encontrado: ${vehicle.name}`
            });
            sources.push({
              type: 'vehicles',
              id: vehicle.id,
              name: vehicle.name,
              url: vehicle.url
            });
            return {
              reply: this.formatVehicleResponse(vehicle),
              actions,
              sources
            };
          } else {
            const names = result.results.slice(0, 3).map(v => v.name).join(', ');
            return {
              reply: `Encontré varios vehículos: ${names}. ¿Cuál te interesa?`,
              sources: result.results.slice(0, 3).map(v => ({
                type: 'vehicles',
                id: v.id,
                name: v.name,
                url: v.url
              }))
            };
          }

        default:
          return { reply: 'No entendí tu consulta. ¿Podrías preguntar sobre algún personaje, planeta, nave o vehículo específico?' };
      }
    } catch (error) {
      console.error('Search by intent error:', error);
      return {
        reply: 'Lo siento, ha ocurrido un error al buscar en la base de datos. Por favor, inténtalo de nuevo.',
      };
    }
  }

  private formatPersonResponse(person: any): string {
    const details = [
      person.height !== 'unknown' ? `Altura: ${person.height}cm` : null,
      person.mass !== 'unknown' ? `Peso: ${person.mass}kg` : null,
      person.birth_year !== 'unknown' ? `Año de nacimiento: ${person.birth_year}` : null,
      person.gender !== 'unknown' ? `Género: ${person.gender}` : null
    ].filter(Boolean);

    return `**${person.name}** es un personaje de Star Wars. ${details.length > 0 ? details.join(', ') + '.' : ''}`;
  }

  private formatPlanetResponse(planet: any): string {
    const details = [
      planet.climate !== 'unknown' ? `Clima: ${planet.climate}` : null,
      planet.terrain !== 'unknown' ? `Terreno: ${planet.terrain}` : null,
      planet.population !== 'unknown' ? `Población: ${planet.population}` : null
    ].filter(Boolean);

    return `**${planet.name}** es un planeta de Star Wars. ${details.length > 0 ? details.join(', ') + '.' : ''}`;
  }

  private formatStarshipResponse(starship: any): string {
    const details = [
      starship.model !== 'unknown' ? `Modelo: ${starship.model}` : null,
      starship.manufacturer !== 'unknown' ? `Fabricante: ${starship.manufacturer}` : null,
      starship.starship_class !== 'unknown' ? `Clase: ${starship.starship_class}` : null,
      starship.length !== 'unknown' ? `Longitud: ${starship.length}m` : null
    ].filter(Boolean);

    return `**${starship.name}** es una nave espacial de Star Wars. ${details.length > 0 ? details.join(', ') + '.' : ''}`;
  }

  private formatVehicleResponse(vehicle: any): string {
    const details = [
      vehicle.model !== 'unknown' ? `Modelo: ${vehicle.model}` : null,
      vehicle.manufacturer !== 'unknown' ? `Fabricante: ${vehicle.manufacturer}` : null,
      vehicle.vehicle_class !== 'unknown' ? `Clase: ${vehicle.vehicle_class}` : null,
      vehicle.length !== 'unknown' ? `Longitud: ${vehicle.length}m` : null
    ].filter(Boolean);

    return `**${vehicle.name}** es un vehículo de Star Wars. ${details.length > 0 ? details.join(', ') + '.' : ''}`;
  }
}

export const chatService = new ChatService();