import { IntentParser } from '../services/chat/intentParser.js';

describe('IntentParser', () => {
  let parser: IntentParser;

  beforeEach(() => {
    parser = new IntentParser();
  });

  describe('parseIntent - People Intent', () => {
    it('should detect people intent with "personaje" keyword', () => {
      const result = parser.parseIntent('¿Quién es el personaje Luke Skywalker?');
      
      expect(result.intent).toBe('people');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.query).toContain('Luke Skywalker');
    });

    it('should detect people intent with multiple character keywords', () => {
      const result = parser.parseIntent('Tell me about the character Darth Vader the sith who is a person');
      
      expect(result.intent).toBe('people');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect people intent with sufficient keywords', () => {
      const result = parser.parseIntent('Tell me about the jedi character Luke Skywalker who is a person');
      
      expect(result.intent).toBe('people');
      expect(result.confidence).toBeGreaterThan(0.15);
    });

    it('should detect people intent with "who is" pattern and character name', () => {
      const result = parser.parseIntent('Who is Obi-Wan Kenobi the jedi?');
      
      expect(result.intent).toBe('people');
      expect(result.query).toBe('Obi-Wan Kenobi the jedi');
    });
  });

  describe('parseIntent - Planets Intent', () => {
    it('should detect planet intent with "planeta" keyword', () => {
      const result = parser.parseIntent('¿Qué planeta es Tatooine?');
      
      expect(result.intent).toBe('planets');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect planet intent with multiple planet keywords', () => {
      const result = parser.parseIntent('Tell me about the planet Coruscant');
      
      expect(result.intent).toBe('planets');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect planet intent with "mundo" keyword', () => {
      const result = parser.parseIntent('¿Cuál es el mundo planet más importante?');
      
      expect(result.intent).toBe('planets');
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe('parseIntent - Starships Intent', () => {
    it('should detect starship intent with "nave" keyword', () => {
      const result = parser.parseIntent('¿Qué nave es el Millennium Falcon?');
      
      expect(result.intent).toBe('starships');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect starship intent with starship keywords', () => {
      const result = parser.parseIntent('Tell me about the Death Star starship');
      
      expect(result.intent).toBe('starships');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect starship intent with "x-wing" keyword', () => {
      const result = parser.parseIntent('How fast is an x-wing ship?');
      
      expect(result.intent).toBe('starships');
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe('parseIntent - Vehicles Intent', () => {
    it('should detect vehicle intent with "vehículo" keyword', () => {
      const result = parser.parseIntent('¿Qué vehículo es el AT-AT?');
      
      expect(result.intent).toBe('vehicles');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect vehicle intent with vehicle keywords', () => {
      const result = parser.parseIntent('Tell me about the speeder vehicle transport');
      
      expect(result.intent).toBe('vehicles');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect vehicle intent with "walker" keyword', () => {
      const result = parser.parseIntent('How does a walker vehicle work?');
      
      expect(result.intent).toBe('vehicles');
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe('parseIntent - Unknown Intent', () => {
    it('should return unknown for unrelated queries', () => {
      const result = parser.parseIntent('¿Cuál es el clima hoy?');
      
      expect(result.intent).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('should return unknown for empty queries', () => {
      const result = parser.parseIntent('');
      
      expect(result.intent).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('should return unknown for very low confidence matches', () => {
      const result = parser.parseIntent('What is the meaning of life?');
      
      expect(result.intent).toBe('unknown');
    });
  });

  describe('Query Extraction', () => {
    it('should remove "who is" prefix', () => {
      const result = parser.parseIntent('Who is Luke Skywalker?');
      
      expect(result.query).toBe('Luke Skywalker');
    });

    it('should remove "quién es" prefix', () => {
      const result = parser.parseIntent('¿Quién es Darth Vader?');
      
      expect(result.query).toBe('Darth Vader');
    });

    it('should remove "tell me about" prefix', () => {
      const result = parser.parseIntent('Tell me about Tatooine');
      
      expect(result.query).toBe('Tatooine');
    });

    it('should remove "háblame de" prefix', () => {
      const result = parser.parseIntent('Háblame de Naboo');
      
      expect(result.query).toBe('Naboo');
    });

    it('should remove trailing question marks', () => {
      const result = parser.parseIntent('Luke Skywalker??');
      
      expect(result.query).toBe('Luke Skywalker');
    });

    it('should remove leading question marks', () => {
      const result = parser.parseIntent('¿¿Yoda');
      
      expect(result.query).toBe('Yoda');
    });

    it('should handle multiple prefixes and clean properly', () => {
      const result = parser.parseIntent('¿What is the Death Star?');
      
      expect(result.query).toBe('the Death Star');
    });

    it('should preserve original message if no patterns match', () => {
      const result = parser.parseIntent('Millennium Falcon speed');
      
      expect(result.query).toBe('Millennium Falcon speed');
    });
  });

  describe('Confidence Scoring', () => {
    it('should have higher confidence with more matching keywords', () => {
      const result1 = parser.parseIntent('jedi Luke Skywalker character');
      const result2 = parser.parseIntent('Luke');
      
      expect(result1.confidence).toBeGreaterThan(result2.confidence);
    });

    it('should return confidence between 0 and 1', () => {
      const result = parser.parseIntent('Tell me about Yoda the jedi master');
      
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle case-insensitive matching', () => {
      const result1 = parser.parseIntent('LUKE SKYWALKER JEDI');
      const result2 = parser.parseIntent('luke skywalker jedi');
      
      expect(result1.confidence).toBe(result2.confidence);
      expect(result1.intent).toBe(result2.intent);
    });
  });

  describe('Edge Cases', () => {
    it('should handle messages with only whitespace', () => {
      const result = parser.parseIntent('   ');
      
      expect(result.intent).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('should handle very long messages', () => {
      const longMessage = 'Tell me about Luke Skywalker who is a jedi and the son of Darth Vader and trained by Obi-Wan Kenobi';
      const result = parser.parseIntent(longMessage);
      
      expect(result.intent).toBe('people');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should prioritize the intent with most keyword matches', () => {
      const result = parser.parseIntent('Tell me about the jedi Luke Skywalker character from the planet Tatooine');
      
      expect(result.intent).toBe('people');
    });

    it('should handle mixed language queries', () => {
      const result = parser.parseIntent('Who is el personaje Darth Vader?');
      
      expect(result.intent).toBe('people');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should handle special characters', () => {
      const result = parser.parseIntent('¿¿¿Quién es el personaje Luke Skywalker???');
      
      expect(result.intent).toBe('people');
      expect(result.query).not.toContain('?');
      expect(result.query).not.toContain('¿');
    });
  });
});
