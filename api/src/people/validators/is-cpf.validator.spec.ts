import { IsCpfConstraint } from './is-cpf.validator';

describe('IsCpfConstraint', () => {
  let validator: IsCpfConstraint;

  beforeEach(() => {
    validator = new IsCpfConstraint();
  });

  describe('CPFs válidos', () => {
    it('deve aceitar um CPF válido sem formatação', () => {
      expect(validator.validate('52998224725', {} as any)).toBe(true);
    });

    it('deve aceitar um CPF válido com formatação', () => {
      expect(validator.validate('529.982.247-25', {} as any)).toBe(true);
    });

    it('deve aceitar outro CPF válido', () => {
      expect(validator.validate('07856142570', {} as any)).toBe(true);
    });
  });

  describe('CPFs inválidos', () => {
    it('deve rejeitar CPF com todos os dígitos iguais', () => {
      expect(validator.validate('11111111111', {} as any)).toBe(false);
    });

    it('deve rejeitar CPF com tamanho incorreto', () => {
      expect(validator.validate('1234567', {} as any)).toBe(false);
    });

    it('deve rejeitar CPF vazio', () => {
      expect(validator.validate('', {} as any)).toBe(false);
    });

    it('deve rejeitar CPF nulo', () => {
      expect(validator.validate(null as any, {} as any)).toBe(false);
    });

    it('deve rejeitar CPF com dígito verificador errado', () => {
      expect(validator.validate('52998224726', {} as any)).toBe(false);
    });

    it('deve retornar mensagem de erro padrão', () => {
      expect(validator.defaultMessage({} as any)).toContain('CPF');
    });
  });
});
