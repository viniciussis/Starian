<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { usePeopleStore } from './stores/people.store';
import PersonList from './components/PersonList.vue';
import PersonForm from './components/PersonForm.vue';
import { Search, Sparkles } from 'lucide-vue-next';

const store = usePeopleStore();
const searchQuery = ref('');
const isFormOpen = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    store.semanticSearch(newVal);
  }, 400);
});

onMounted(() => {
  store.fetchPeople();
});
</script>

<template>
  <div class="min-h-screen bg-black p-6 md:p-12 relative overflow-hidden text-gray-200">
    <div class="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
      <img src="/Banner_Hero_1.jpg.webp"
        class="w-full h-full object-cover grayscale opacity-30 mask-image: linear-gradient(to bottom, black, transparent)"
        alt="Background" />
      <div class="absolute inset-0 bg-linear-to-t from-black via-transparent to-black"></div>
    </div>

    <div
      class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-(--primary-color) opacity-40 blur-[120px] pointer-events-none">
    </div>

    <div class="max-w-6xl mx-auto space-y-8 relative z-10">

      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <img src="/Starian_Logo_Principal.svg" alt="Starian Logo" class="h-10 mb-4 brightness-200 contrast-200" />
          <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI <span class="bg-(--primary-color) px-3 py-1 rounded text-white text-2xl">Force</span>
          </h1>
          <p class="text-slate-400 mt-2">Gestão inteligente de profissionais e busca vetorial.</p>
        </div>

        <button @click="isFormOpen = !isFormOpen"
          class="inline-flex cursor-pointer items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-slate-700"
          :class="isFormOpen ? 'bg-(--bg-card) text-white hover:bg-slate-800' : 'bg-(--primary-color) text-white hover:brightness-150 shadow-lg shadow-(--primary-color)/20'">
          {{ isFormOpen ? 'Voltar para Lista' : '+ Cadastrar Novo' }}
        </button>
      </header>

      <transition name="slide-fade" mode="out-in">
        <div v-if="isFormOpen">
          <PersonForm @success="isFormOpen = false" />
        </div>

        <div v-else class="space-y-6">

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
              <Sparkles class="w-5 h-5 animate-pulse" v-if="searchQuery" />
              <Search class="w-5 h-5 text-slate-500" v-else />
            </div>
            <input v-model="searchQuery" type="text"
              placeholder="Busque por conceito. Ex: 'desenvolvedor sênior em SP'..."
              class="w-full pl-12 pr-4 py-4 bg-[#090909]/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl shadow-(--primary-color)/10 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-(--primary-color) focus:bg-black transition-all duration-300" />
            <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span
                class="text-xs font-semibold px-2 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md">Powered
                by Gemini</span>
            </div>
          </div>

          <PersonList />

        </div>
      </transition>
    </div>
  </div>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
