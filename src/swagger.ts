import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Star Wars Console API',
    version: '1.0.0',
    description: 'API para explorar datos de Star Wars utilizando SWAPI'
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server',
    }
  ],
  tags: [
    {
      name: 'People',
      description: 'Endpoints relacionados con personajes de Star Wars'
    },
    {
      name: 'Planets',
      description: 'Endpoints relacionados con planetas de Star Wars'
    },
    {
      name: 'Starships',
      description: 'Endpoints relacionados con naves espaciales de Star Wars'
    },
    {
      name: 'Vehicles',
      description: 'Endpoints relacionados con vehículos de Star Wars'
    }
  ],
  components: {
    schemas: {
      Person: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único del personaje'
          },
          name: {
            type: 'string',
            description: 'Nombre del personaje'
          },
          height: {
            type: 'string',
            description: 'Altura del personaje'
          },
          mass: {
            type: 'string',
            description: 'Peso del personaje'
          },
          hair_color: {
            type: 'string',
            description: 'Color de cabello'
          },
          skin_color: {
            type: 'string',
            description: 'Color de piel'
          },
          eye_color: {
            type: 'string',
            description: 'Color de ojos'
          },
          birth_year: {
            type: 'string',
            description: 'Año de nacimiento'
          },
          gender: {
            type: 'string',
            description: 'Género'
          }
        }
      },
      Planet: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único del planeta'
          },
          name: {
            type: 'string',
            description: 'Nombre del planeta'
          },
          rotation_period: {
            type: 'string',
            description: 'Período de rotación'
          },
          orbital_period: {
            type: 'string',
            description: 'Período orbital'
          },
          diameter: {
            type: 'string',
            description: 'Diámetro del planeta'
          },
          climate: {
            type: 'string',
            description: 'Clima del planeta'
          },
          gravity: {
            type: 'string',
            description: 'Gravedad del planeta'
          },
          terrain: {
            type: 'string',
            description: 'Terreno del planeta'
          },
          surface_water: {
            type: 'string',
            description: 'Agua superficial'
          },
          population: {
            type: 'string',
            description: 'Población del planeta'
          }
        }
      },
      Starship: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único de la nave'
          },
          name: {
            type: 'string',
            description: 'Nombre de la nave'
          },
          model: {
            type: 'string',
            description: 'Modelo de la nave'
          },
          manufacturer: {
            type: 'string',
            description: 'Fabricante'
          },
          cost_in_credits: {
            type: 'string',
            description: 'Costo en créditos'
          },
          length: {
            type: 'string',
            description: 'Longitud de la nave'
          },
          crew: {
            type: 'string',
            description: 'Tripulación'
          },
          passengers: {
            type: 'string',
            description: 'Pasajeros'
          },
          starship_class: {
            type: 'string',
            description: 'Clase de nave estelar'
          }
        }
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único del vehículo'
          },
          name: {
            type: 'string',
            description: 'Nombre del vehículo'
          },
          model: {
            type: 'string',
            description: 'Modelo del vehículo'
          },
          manufacturer: {
            type: 'string',
            description: 'Fabricante'
          },
          cost_in_credits: {
            type: 'string',
            description: 'Costo en créditos'
          },
          length: {
            type: 'string',
            description: 'Longitud del vehículo'
          },
          crew: {
            type: 'string',
            description: 'Tripulación'
          },
          passengers: {
            type: 'string',
            description: 'Pasajeros'
          },
          vehicle_class: {
            type: 'string',
            description: 'Clase de vehículo'
          }
        }
      },
      ListResponse: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'Total de elementos'
          },
          next: {
            type: 'string',
            nullable: true,
            description: 'URL de la siguiente página'
          },
          previous: {
            type: 'string',
            nullable: true,
            description: 'URL de la página anterior'
          },
          results: {
            type: 'array',
            items: {
              oneOf: [
                { $ref: '#/components/schemas/Person' },
                { $ref: '#/components/schemas/Planet' },
                { $ref: '#/components/schemas/Starship' },
                { $ref: '#/components/schemas/Vehicle' }
              ]
            },
            description: 'Array de resultados'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Mensaje de error'
          },
          error: {
            type: 'string',
            description: 'Detalle del error'
          }
        }
      }
    },
    parameters: {
      PageParam: {
        name: 'page',
        in: 'query',
        description: 'Número de página para paginación',
        required: false,
        schema: {
          type: 'string',
          pattern: '^[0-9]+$'
        }
      },
      SearchParam: {
        name: 'search',
        in: 'query',
        description: 'Término de búsqueda para filtrar resultados',
        required: false,
        schema: {
          type: 'string'
        }
      },
      IdParam: {
        name: 'id',
        in: 'path',
        description: 'ID único del elemento',
        required: true,
        schema: {
          type: 'string',
          pattern: '^[0-9]+$'
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Solicitud malformada',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      BadGateway: {
        description: 'Error del servidor SWAPI',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);