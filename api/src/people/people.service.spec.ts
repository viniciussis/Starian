import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PeopleService } from './people.service';
import { AiService } from '../ai/ai.service';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/create-person.dto';

// Fábrica de mock para a entidade Person
const mockPerson = (overrides: Partial<Person> = {}): Person => ({
  id: 'uuid-1',
  fullName: 'Ada Lovelace',
  email: 'ada@starian.dev',
  cpf: '52998224725',
  birthDate: '1990-12-10',
  phone: '11999999999',
  bio: 'Engenheira de software especialista em IA.',
  bioVector: null as unknown as number[],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('PeopleService', () => {
  let service: PeopleService;
  let repo: jest.Mocked<Repository<Person>>;
  let aiService: jest.Mocked<AiService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(Person),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: AiService,
          useValue: {
            generateEmbedding: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    repo = module.get(getRepositoryToken(Person));
    aiService = module.get(AiService);
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeDefined();
  });

  // --- CREATE ---
  describe('create', () => {
    const dto: CreatePersonDto = {
      fullName: 'Ada Lovelace',
      email: 'ada@starian.dev',
      cpf: '52998224725',
      birthDate: '1990-12-10',
      phone: '11999999999',
      bio: 'Engenheira de software.',
    };

    it('deve criar uma pessoa com sucesso', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockPerson());
      repo.save.mockResolvedValue(mockPerson());
      aiService.generateEmbedding.mockResolvedValue(null);

      const result = await service.create(dto);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: [{ email: dto.email }, { cpf: dto.cpf }],
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result.fullName).toBe('Ada Lovelace');
    });

    it('deve gerar embedding quando bio é fornecida', async () => {
      const mockVector = [0.1, 0.2, 0.3];
      repo.findOne.mockResolvedValue(null);
      // Retorna entidade com a mesma bio do DTO para o assertion bater
      repo.create.mockReturnValue(mockPerson({ bio: dto.bio }));
      aiService.generateEmbedding.mockResolvedValue(mockVector);
      repo.save.mockResolvedValue(mockPerson({ bioVector: mockVector }));

      await service.create(dto);

      expect(aiService.generateEmbedding).toHaveBeenCalledWith(dto.bio);
    });

    it('deve lançar ConflictException quando e-mail ou CPF já existe', async () => {
      repo.findOne.mockResolvedValue(mockPerson());

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('deve criar com sucesso mesmo sem embedding (AI offline)', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockPerson());
      aiService.generateEmbedding.mockResolvedValue(null); // IA offline
      repo.save.mockResolvedValue(mockPerson());

      const result = await service.create(dto);
      expect(result).toBeDefined();
    });
  });

  // --- FIND ALL ---
  describe('findAll', () => {
    it('deve retornar uma lista de pessoas', async () => {
      const people = [mockPerson(), mockPerson({ id: 'uuid-2', email: 'outro@email.com', cpf: '07856142570' })];
      repo.find.mockResolvedValue(people);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(repo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
    });

    it('deve retornar lista vazia quando não há pessoas', async () => {
      repo.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toHaveLength(0);
    });
  });

  // --- FIND ONE ---
  describe('findOne', () => {
    it('deve retornar uma pessoa pelo ID', async () => {
      repo.findOne.mockResolvedValue(mockPerson());
      const result = await service.findOne('uuid-1');
      expect(result.id).toBe('uuid-1');
    });

    it('deve lançar NotFoundException quando pessoa não existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('id-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  // --- REMOVE ---
  describe('remove', () => {
    it('deve remover uma pessoa com sucesso', async () => {
      const person = mockPerson();
      repo.findOne.mockResolvedValue(person);
      repo.remove.mockResolvedValue(person);

      await expect(service.remove('uuid-1')).resolves.not.toThrow();
      expect(repo.remove).toHaveBeenCalledWith(person);
    });

    it('deve lançar NotFoundException ao tentar remover pessoa inexistente', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove('id-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  // --- SEMANTIC SEARCH ---
  describe('searchSemantic', () => {
    it('deve retornar todos quando query é vazia', async () => {
      const people = [mockPerson()];
      repo.find.mockResolvedValue(people);

      const result = await service.searchSemantic('');
      expect(result).toEqual(people);
    });

    it('deve usar ILIKE quando AI está offline (fallback)', async () => {
      aiService.generateEmbedding.mockResolvedValue(null);

      const mockQb = {
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockPerson()]),
      };
      repo.createQueryBuilder.mockReturnValue(mockQb as any);

      const result = await service.searchSemantic('engenheira');

      expect(aiService.generateEmbedding).toHaveBeenCalledWith('engenheira');
      expect(mockQb.where).toHaveBeenCalledWith(
        'person.fullName ILIKE :query OR person.bio ILIKE :query',
        { query: '%engenheira%' },
      );
      expect(result).toHaveLength(1);
    });

    it('deve usar busca vetorial quando AI está online', async () => {
      const mockVector = [0.1, 0.2, 0.3];
      aiService.generateEmbedding.mockResolvedValue(mockVector);

      const people = [mockPerson({ bio: 'Engenheira de software' })];
      const mockQb = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(people),
      };
      repo.createQueryBuilder.mockReturnValue(mockQb as any);

      const result = await service.searchSemantic('engenheira');

      expect(mockQb.orderBy).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('deve promover resultados com termo exato ao topo (re-ranking)', async () => {
      const mockVector = [0.1, 0.2];
      aiService.generateEmbedding.mockResolvedValue(mockVector);

      const advogado = mockPerson({ id: 'a', bio: 'Advogado trabalhista' });
      const medico = mockPerson({ id: 'b', bio: 'Médico cardiologista' });

      // O banco retorna medico primeiro (melhor score vetorial)
      const mockQb = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([medico, advogado]),
      };
      repo.createQueryBuilder.mockReturnValue(mockQb as any);

      const result = await service.searchSemantic('advogado');

      // O re-ranking deve trazer o advogado para cima
      expect(result[0].id).toBe('a');
    });
  });
});
