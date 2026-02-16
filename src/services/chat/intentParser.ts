import { IntentType, ParsedIntent } from '../../types.js';

export class IntentParser {
  private peopleKeywords = [
    'personaje', 'persona', 'people', 'character', 'who is', 'quién es', 'quien es',
    'luke', 'skywalker', 'leia', 'organa', 'vader', 'anakin', 'obi', 'kenobi', 
    'yoda', 'han', 'solo', 'chewbacca', 'chewie', 'jedi', 'sith'
  ];

  private planetKeywords = [
    'planeta', 'planet', 'mundo', 'world', 'lugar', 'place',
    'tatooine', 'alderaan', 'naboo', 'coruscant', 'hoth', 'endor'
  ];

  private starshipKeywords = [
    'nave', 'ship', 'starship', 'spaceship', 'crucero', 'destroyer',
    'millennium', 'falcon', 'death star', 'x-wing', 'tie fighter'
  ];

  private vehicleKeywords = [
    'vehículo', 'vehicle', 'transport', 'transporte', 'carro', 'speeder',
    'walker', 'at-at', 'at-st', 'landspeeder'
  ];

  parseIntent(message: string): ParsedIntent {
    const lowerMessage = message.toLowerCase();
    
    // Check for each intent type
    const peopleScore = this.calculateScore(lowerMessage, this.peopleKeywords);
    const planetScore = this.calculateScore(lowerMessage, this.planetKeywords);
    const starshipScore = this.calculateScore(lowerMessage, this.starshipKeywords);
    const vehicleScore = this.calculateScore(lowerMessage, this.vehicleKeywords);

    // Find the highest score
    const scores = [
      { intent: 'people' as IntentType, score: peopleScore },
      { intent: 'planets' as IntentType, score: planetScore },
      { intent: 'starships' as IntentType, score: starshipScore },
      { intent: 'vehicles' as IntentType, score: vehicleScore },
    ];

    const bestMatch = scores.reduce((max, current) => 
      current.score > max.score ? current : max
    );

    // If no keywords matched well OR confidence is too low, default to unknown
    if (bestMatch.score === 0 || bestMatch.score < 0.15) {
      return {
        intent: 'unknown',
        query: this.extractQuery(message),
        confidence: 0,
      };
    }

    return {
      intent: bestMatch.intent,
      query: this.extractQuery(message),
      confidence: bestMatch.score,
    };
  }

  private calculateScore(message: string, keywords: string[]): number {
    let matches = 0;
    const totalKeywords = keywords.length;

    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        matches++;
      }
    }

    return matches / totalKeywords;
  }

  private extractQuery(message: string): string {
    // Clean up common question words and extract the main query
    let cleanedMessage = message
      // Remove question marks at start and end
      .replace(/^¿+|^\?+|\?+$/g, '')
      // Remove common question patterns (with optional leading punctuation)
      .replace(/^(who is|quién es|quien es|what is|qué es|que es|tell me about|háblame de|hablame de|decime sobre|dime sobre|cuéntame sobre|cuentame sobre)\s*/i, '')
      // Remove any remaining question marks
      .replace(/\?+$/g, '')
      // Clean extra whitespace
      .trim();

    return cleanedMessage || message.trim();
  }
}