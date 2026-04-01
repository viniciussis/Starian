import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
    private readonly aiService: AiService,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const existingPerson = await this.peopleRepository.findOne({
      where: [{ email: createPersonDto.email }, { cpf: createPersonDto.cpf }],
    });

    if (existingPerson) {
      throw new ConflictException('Uma pessoa com este e-mail ou CPF já existe.');
    }

    const person = this.peopleRepository.create(createPersonDto);

    if (person.bio && person.bio.trim() !== '') {
      const vector = await this.aiService.generateEmbedding(person.bio);
      if (vector) person.bioVector = vector;
    }

    return await this.peopleRepository.save(person);
  }

  async findAll(): Promise<Person[]> {
    return await this.peopleRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.peopleRepository.findOne({ where: { id } });
    if (!person) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }
    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);
    this.peopleRepository.merge(person, updatePersonDto);
    
    if (updatePersonDto.bio !== undefined) {
      const vector = await this.aiService.generateEmbedding(person.bio);
      if (vector) person.bioVector = vector;
    }
    
    return await this.peopleRepository.save(person);
  }

  async remove(id: string): Promise<void> {
    const person = await this.findOne(id);
    await this.peopleRepository.remove(person);
  }

  // Novo método de Busca Semântica usando Matemática Vetorial
  async searchSemantic(query: string): Promise<Person[]> {
    if (!query || query.trim() === '') {
      return this.findAll();
    }

    const vectorParams = await this.aiService.generateEmbedding(query);
    
    // Fallback: Busca via texto convencional (ILIKE) se a IA estiver offline
    if (!vectorParams || vectorParams.length === 0) {
      return await this.peopleRepository
        .createQueryBuilder('person')
        .where('person.fullName ILIKE :query OR person.bio ILIKE :query', { query: `%${query}%` })
        .limit(10)
        .getMany();
    }

    const vectorString = `[${vectorParams.join(',')}]`;

    // Busca Híbrida: Busca todos vetorialmente ordenados, limitando inicialmente a 30
    const rawResults = await this.peopleRepository
      .createQueryBuilder('person')
      .where('person.bio_vector IS NOT NULL')
      .orderBy(`(person.bio_vector::text::vector) <=> '${vectorString}'`, 'ASC')
      .limit(30)
      .getMany();

    // Peso Manual da Aplicação: Coloca quem tem o termo exato no texto muito na frente do embedding puro
    const term = query.toLowerCase();
    rawResults.sort((a, b) => {
      const aMatches = a.bio?.toLowerCase().includes(term) || a.fullName.toLowerCase().includes(term);
      const bMatches = b.bio?.toLowerCase().includes(term) || b.fullName.toLowerCase().includes(term);
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });

    return rawResults.slice(0, 10);
  }
}
