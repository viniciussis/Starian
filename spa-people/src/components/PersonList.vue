<script setup lang="ts">
import { computed } from 'vue';
import { usePeopleStore } from '../stores/people.store';

const store = usePeopleStore();

const peopleList = computed(() => store.people);
</script>

<template>
  <div
    class="bg-(--bg-card) rounded-2xl shadow-xl shadow-(--primary-color)/10 border border-slate-800 p-6 overflow-hidden">
    <div v-if="store.isLoading" class="flex justify-center py-12">
      <div class="animate-pulse flex space-x-4 w-full max-w-2xl">
        <div class="flex-1 space-y-4 py-1">
          <div class="h-4 bg-slate-800 rounded w-3/4"></div>
          <div class="space-y-3">
            <div class="h-4 bg-slate-800 rounded"></div>
            <div class="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="peopleList.length === 0" class="text-center py-12">
      <p class="text-slate-500 font-medium">Nenhum profissional encontrado na base de dados.</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-800 text-sm tracking-wide text-slate-400 font-semibold uppercase">
            <th class="py-3 pl-2">Profissional</th>
            <th class="py-3">Contato</th>
            <th class="py-3">Nascimento</th>
            <th class="py-3">Resumo (IA)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/50">
          <tr v-for="person in peopleList" :key="person.id"
            class="hover:bg-(--bg-card-hover) transition-colors duration-150 group">
            <td class="py-4 pl-2 font-medium text-white">
              {{ person.fullName }}
              <div class="text-xs text-slate-500 font-normal mt-0.5">CPF: {{ person.cpf }}</div>
            </td>
            <td class="py-4 text-sm text-slate-300">
              <div>{{ person.email }}</div>
              <div class="text-xs text-slate-500 mt-0.5">{{ person.phone }}</div>
            </td>
            <td class="py-4 text-sm text-slate-400">
              {{ person.birthDate }}
            </td>
            <td class="py-4 text-sm text-slate-400 max-w-xs truncate" :title="person.bio || 'Sem biografia'">
              {{ person.bio || '---' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
