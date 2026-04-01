import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    configService = module.get(ConfigService);
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeDefined();
  });

  describe('generateEmbedding', () => {
    it('deve retornar null para texto vazio', async () => {
      const result = await service.generateEmbedding('');
      expect(result).toBeNull();
    });

    it('deve retornar null para texto apenas com espaços', async () => {
      const result = await service.generateEmbedding('   ');
      expect(result).toBeNull();
    });

    it('deve retornar null quando GEMINI_API_KEY não está configurada', async () => {
      configService.get.mockReturnValue(undefined);
      const result = await service.generateEmbedding('Desenvolvedor Senior');
      expect(result).toBeNull();
    });

    it('deve retornar null quando GEMINI_API_KEY é o valor padrão', async () => {
      configService.get.mockReturnValue('your_gemini_key_here');
      const result = await service.generateEmbedding('Desenvolvedor Senior');
      expect(result).toBeNull();
    });
  });
});
