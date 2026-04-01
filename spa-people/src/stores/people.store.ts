import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../services/api';

export interface Person {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
  bio: string | null;
  createdAt?: string;
}

export const usePeopleStore = defineStore('people', () => {
  const people = ref<Person[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Busca inicial pura
  async function fetchPeople() {
    isLoading.value = true;
    error.value = null;
    try {
      // O axios interceptor já desempacota para o array final
      const data = await api.get('/people');
      people.value = data as unknown as Person[];
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  // Busca semântica usando inteligência artificial
  async function semanticSearch(query: string) {
    if (!query) return fetchPeople();
    
    isLoading.value = true;
    error.value = null;
    try {
      const data = await api.get('/people/semantic-search', { params: { q: query } });
      people.value = data as unknown as Person[];
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  // Criação
  async function createPerson(payload: Partial<Person>) {
    isLoading.value = true;
    error.value = null;
    try {
      const newPerson = await api.post('/people', payload) as unknown as Person;
      people.value.unshift(newPerson); // Optimistic UI local (põe no topo sem recarregar a lista toda do backend)
      return newPerson;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    people,
    isLoading,
    error,
    fetchPeople,
    semanticSearch,
    createPerson
  };
});
