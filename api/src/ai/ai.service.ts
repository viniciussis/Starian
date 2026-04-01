import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey || apiKey === 'your_gemini_key_here') {
      console.warn('⚠️ GEMINI_API_KEY não está configurada corretamente!');
    }

    this.ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!text || text.trim() === '') return null;

    try {
      const apiKey = this.configService.get<string>('GEMINI_API_KEY');
      if (
        !apiKey ||
        apiKey === 'your_gemini_key_here' ||
        apiKey === 'dummy_key'
      ) {
        return null;
      }

      const response = await this.ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
      });
      const values = response.embeddings?.[0]?.values;

      if (!values) {
        throw new InternalServerErrorException(
          'A API do Gemini retornou uma resposta sem vetores.',
        );
      }

      return values;
    } catch (error) {
      console.warn(
        '⚠️ Fallback de IA: Gemini indisponível, seguindo fluxo normal.',
      );
      return null;
    }
  }
}
