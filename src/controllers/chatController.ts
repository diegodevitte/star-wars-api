import { Request, Response } from 'express';
import { ChatRequest, ChatResponse } from '../types.js';
import { chatService } from '../services/chat/chatService.js';

export class ChatController {
  /**
   * Process chat message
   */
  public chat = async (req: Request<{}, ChatResponse, ChatRequest>, res: Response<ChatResponse>) => {
    try {
      const { message, sessionId } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        res.status(400).json({
          reply: 'Por favor, proporciona un mensaje válido.',
        });
        return;
      }

      if (message.length > 1000) {
        res.status(400).json({
          reply: 'El mensaje es demasiado largo. Por favor, mantén tu consulta bajo 1000 caracteres.',
        });
        return;
      }

      console.log(`Processing chat message: "${message}" ${sessionId ? `(session: ${sessionId})` : ''}`);

      const response = await chatService.processMessage({ message, sessionId });
      
      console.log(`Chat response generated: ${response.reply.substring(0, 100)}...`);
      
      res.json(response);
    } catch (error) {
      console.error('Chat controller error:', error);
      res.status(500).json({
        reply: 'Lo siento, ha ocurrido un error interno. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };

  /**
   * Health check for chat service
   */
  public health = async (req: Request, res: Response) => {
    try {
      const llmProvider = process.env.LLM_PROVIDER || 'none';
      const llmAvailable = Boolean(process.env.LLM_API_KEY) && llmProvider !== 'none';
      
      res.json({
        status: 'ok',
        service: 'chat',
        llmProvider,
        llmAvailable,
        fallbackEnabled: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Chat health check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Chat service health check failed',
      });
    }
  };
}

export const chatController = new ChatController();