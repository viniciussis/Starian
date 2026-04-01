import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'isCpf', async: false })
export class IsCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments) {
    if (!cpf) return false;

    const cleanCpf = cpf.replace(/[^\d]+/g, '');

    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    const digit1 = remainder >= 10 ? 0 : remainder;
    if (digit1 !== parseInt(cleanCpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    const digit2 = remainder >= 10 ? 0 : remainder;
    if (digit2 !== parseInt(cleanCpf.charAt(10))) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'O CPF fornecido é inválido. Verifique os dígitos.';
  }
}

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfConstraint,
    });
  };
}
