import { ref } from 'vue';

export function useMasks() {
  const formatCpf = (value: string) => {
    const raw = value.replace(/\D/g, '').substring(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return raw.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    if (raw.length <= 9) return raw.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    return raw.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, '').substring(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 6) return raw.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    if (raw.length <= 10) return raw.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return raw.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return {
    formatCpf,
    formatPhone
  };
}
