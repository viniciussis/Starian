import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { Person } from './person.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    AiModule,
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
