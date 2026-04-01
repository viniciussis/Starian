import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional, Length } from 'class-validator';
import { IsCpf } from '../validators/is-cpf.validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  fullName: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsCpf()
  cpf: string;

  @IsDateString({}, { message: 'A data de nascimento deve estar em formato ISO' })
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 15, { message: 'O telefone deve estar no formato correto' })
  phone: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
