import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('people')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: string;

  @Column()
  phone: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Exclude()
  @Column({ type: 'jsonb', nullable: true, name: 'bio_vector', select: false })
  bioVector: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
