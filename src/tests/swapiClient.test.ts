import { 
  parseId, 
  getPeople, 
  getPersonById, 
  getPlanets,
  getPlanetById,
  getStarships,
  getStarshipById,
  getVehicles,
  getVehicleById
} from '../lib/swapiClient.js';

const mockFetch = jest.fn();

describe('swapiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    global.fetch = mockFetch as any;
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('parseId', () => {
    it('should extract ID from SWAPI URL', () => {
      const url = 'https://swapi.dev/api/people/1/';
      const id = parseId(url);
      
      expect(id).toBe('1');
    });

    it('should extract ID from different resource types', () => {
      expect(parseId('https://swapi.dev/api/planets/3/')).toBe('3');
      expect(parseId('https://swapi.dev/api/starships/10/')).toBe('10');
      expect(parseId('https://swapi.dev/api/vehicles/14/')).toBe('14');
    });

    it('should return empty string for invalid URLs', () => {
      const id = parseId('https://invalid.url');
      
      expect(id).toBe('');
    });

    it('should handle URLs without trailing slash', () => {
      const id = parseId('https://swapi.dev/api/people/5');
      
      expect(id).toBe('');
    });
  });

  describe('getPeople', () => {
    it('should fetch people list successfully', async () => {
      const mockResponse = {
        count: 82,
        next: 'https://swapi.dev/api/people/?page=2',
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            homeworld: 'https://swapi.dev/api/planets/1/',
            films: [],
            species: [],
            vehicles: [],
            starships: [],
            created: '2014-12-09T13:50:51.644000Z',
            edited: '2014-12-20T21:17:56.891000Z',
            url: 'https://swapi.dev/api/people/1/'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await getPeople();

      expect(result.count).toBe(82);
      expect(result.results).toHaveLength(1);
      expect(result.results[0]?.name).toBe('Luke Skywalker');
      expect(result.results[0]?.id).toBe('1');
    });

    it('should fetch people with page parameter', async () => {
      const mockResponse = {
        count: 82,
        next: 'https://swapi.dev/api/people/?page=3',
        previous: 'https://swapi.dev/api/people/?page=1',
        results: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
        statusText: 'OK'
      });

      await getPeople('2');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });

    it('should fetch people with search parameter', async () => {
      const mockResponse = {
        count: 1,
        next: null,
        previous: null,
        results: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
        statusText: 'OK'
      });

      await getPeople(undefined, 'Luke');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=Luke'),
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(getPeople()).rejects.toThrow();
    });

    it('should retry on timeout', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Request timeout'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            count: 0,
            next: null,
            previous: null,
            results: []
          }),
          status: 200,
          statusText: 'OK'
        });

      await getPeople();

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getPersonById', () => {
    it('should fetch person by ID successfully', async () => {
      const mockPerson = {
        name: 'Darth Vader',
        height: '202',
        mass: '136',
        hair_color: 'none',
        skin_color: 'white',
        eye_color: 'yellow',
        birth_year: '41.9BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '2014-12-10T15:18:20.704000Z',
        edited: '2014-12-20T21:17:50.313000Z',
        url: 'https://swapi.dev/api/people/4/'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerson,
        status: 200,
        statusText: 'OK'
      });

      const result = await getPersonById('4');

      expect(result.name).toBe('Darth Vader');
      expect(result.id).toBe('4');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/people/4/'),
        expect.any(Object)
      );
    });

    it('should throw error for non-existent person', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(getPersonById('999')).rejects.toThrow();
    });
  });

  describe('getPlanets', () => {
    it('should fetch planets list successfully', async () => {
      const mockResponse = {
        count: 60,
        next: null,
        previous: null,
        results: [
          {
            name: 'Tatooine',
            rotation_period: '23',
            orbital_period: '304',
            diameter: '10465',
            climate: 'arid',
            gravity: '1 standard',
            terrain: 'desert',
            surface_water: '1',
            population: '200000',
            residents: [],
            films: [],
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/planets/1/'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await getPlanets();

      expect(result.results[0]?.name).toBe('Tatooine');
      expect(result.results[0]?.id).toBe('1');
    });
  });

  describe('getPlanetById', () => {
    it('should fetch planet by ID successfully', async () => {
      const mockPlanet = {
        name: 'Alderaan',
        rotation_period: '24',
        orbital_period: '364',
        diameter: '12500',
        climate: 'temperate',
        gravity: '1 standard',
        terrain: 'grasslands, mountains',
        surface_water: '40',
        population: '2000000000',
        residents: [],
        films: [],
        created: '2014-12-10T11:35:48.479000Z',
        edited: '2014-12-20T20:58:18.420000Z',
        url: 'https://swapi.dev/api/planets/2/'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlanet,
        status: 200,
        statusText: 'OK'
      });

      const result = await getPlanetById('2');

      expect(result.name).toBe('Alderaan');
      expect(result.id).toBe('2');
    });
  });

  describe('getStarships', () => {
    it('should fetch starships list successfully', async () => {
      const mockResponse = {
        count: 36,
        next: null,
        previous: null,
        results: [
          {
            name: 'Death Star',
            model: 'DS-1 Orbital Battle Station',
            manufacturer: 'Imperial Department of Military Research',
            cost_in_credits: '1000000000000',
            length: '120000',
            max_atmosphering_speed: 'n/a',
            crew: '342953',
            passengers: '843342',
            cargo_capacity: '1000000000000',
            consumables: '3 years',
            hyperdrive_rating: '4.0',
            MGLT: '10',
            starship_class: 'Deep Space Mobile Battlestation',
            pilots: [],
            films: [],
            created: '2014-12-10T16:36:50.509000Z',
            edited: '2014-12-20T21:26:24.783000Z',
            url: 'https://swapi.dev/api/starships/9/'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await getStarships();

      expect(result.results[0]?.name).toBe('Death Star');
      expect(result.results[0]?.id).toBe('9');
    });
  });

  describe('getStarshipById', () => {
    it('should fetch starship by ID successfully', async () => {
      const mockStarship = {
        name: 'Millennium Falcon',
        model: 'YT-1300 light freighter',
        manufacturer: 'Corellian Engineering Corporation',
        cost_in_credits: '100000',
        length: '34.37',
        max_atmosphering_speed: '1050',
        crew: '4',
        passengers: '6',
        cargo_capacity: '100000',
        consumables: '2 months',
        hyperdrive_rating: '0.5',
        MGLT: '75',
        starship_class: 'Light freighter',
        pilots: [],
        films: [],
        created: '2014-12-10T16:59:45.094000Z',
        edited: '2014-12-20T21:23:49.880000Z',
        url: 'https://swapi.dev/api/starships/10/'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStarship,
        status: 200,
        statusText: 'OK'
      });

      const result = await getStarshipById('10');

      expect(result.name).toBe('Millennium Falcon');
      expect(result.id).toBe('10');
    });
  });

  describe('getVehicles', () => {
    it('should fetch vehicles list successfully', async () => {
      const mockResponse = {
        count: 39,
        next: null,
        previous: null,
        results: [
          {
            name: 'Sand Crawler',
            model: 'Digger Crawler',
            manufacturer: 'Corellia Mining Corporation',
            cost_in_credits: '150000',
            length: '36.8',
            max_atmosphering_speed: '30',
            crew: '46',
            passengers: '30',
            cargo_capacity: '50000',
            consumables: '2 months',
            vehicle_class: 'wheeled',
            pilots: [],
            films: [],
            created: '2014-12-10T15:36:25.724000Z',
            edited: '2014-12-20T21:30:21.661000Z',
            url: 'https://swapi.dev/api/vehicles/4/'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
        statusText: 'OK'
      });

      const result = await getVehicles();

      expect(result.results[0]?.name).toBe('Sand Crawler');
      expect(result.results[0]?.id).toBe('4');
    });
  });

  describe('getVehicleById', () => {
    it('should fetch vehicle by ID successfully', async () => {
      const mockVehicle = {
        name: 'AT-AT',
        model: 'All Terrain Armored Transport',
        manufacturer: 'Kuat Drive Yards, Imperial Department of Military Research',
        cost_in_credits: 'unknown',
        length: '20',
        max_atmosphering_speed: '60',
        crew: '5',
        passengers: '40',
        cargo_capacity: '1000',
        consumables: 'unknown',
        vehicle_class: 'assault walker',
        pilots: [],
        films: [],
        created: '2014-12-15T12:38:25.937000Z',
        edited: '2014-12-20T21:30:21.677000Z',
        url: 'https://swapi.dev/api/vehicles/18/'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
        status: 200,
        statusText: 'OK'
      });

      const result = await getVehicleById('18');

      expect(result.name).toBe('AT-AT');
      expect(result.id).toBe('18');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(getPeople()).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      const abortError = new Error('Request timeout');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValue(abortError);

      await expect(getPeople()).rejects.toThrow();
    });

    it('should handle non-JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        status: 200,
        statusText: 'OK'
      });

      await expect(getPeople()).rejects.toThrow();
    });
  });
});
