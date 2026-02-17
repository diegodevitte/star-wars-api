import { LLMGenerateOptions, LLMProvider } from '../../types.js';

export interface LLMClient {
  generate(options: LLMGenerateOptions): Promise<string | null>;
  isAvailable(): boolean;
}

export class LLMClientFactory {
  static create(provider: LLMProvider, apiKey?: string): LLMClient {
    switch (provider) {
      case 'openai':
        return new OpenAIClient(apiKey);
      case 'anthropic':
        return new AnthropicClient(apiKey);
      case 'none':
      default:
        return new NoneLLMClient();
    }
  }
}

export class NoneLLMClient implements LLMClient {
  async generate(options: LLMGenerateOptions): Promise<string | null> {
    return null;
  }

  isAvailable(): boolean {
    return false;
  }
}

export class OpenAIClient implements LLMClient {
  private apiKey?: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async generate(options: LLMGenerateOptions): Promise<string | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: options.prompt,
            },
          ],
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json() as any;
      return data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.error('OpenAI client error:', error);
      return null;
    }
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey);
  }
}

export class AnthropicClient implements LLMClient {
  private apiKey?: string;
  private baseURL = 'https://api.anthropic.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async generate(options: LLMGenerateOptions): Promise<string | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.LLM_MODEL || 'claude-3-sonnet-20240229',
          max_tokens: options.maxTokens || 500,
          messages: [
            {
              role: 'user',
              content: options.prompt,
            },
          ],
          temperature: options.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        console.error('Anthropic API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json() as any;
      return data.content?.[0]?.text || null;
    } catch (error) {
      console.error('Anthropic client error:', error);
      return null;
    }
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey);
  }
}