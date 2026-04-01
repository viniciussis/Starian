<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { usePeopleStore, type Person } from '../stores/people.store';
import { useMasks } from '../composables/useMasks';
import BaseInput from './ui/BaseInput.vue';
import BaseButton from './ui/BaseButton.vue';

const store = usePeopleStore();
const { formatCpf, formatPhone } = useMasks();

const formData = reactive<Partial<Person>>({
  fullName: '',
  email: '',
  cpf: '',
  birthDate: '',
  phone: '',
  bio: '',
});

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const errorMsg = ref('');
const successMsg = ref('');
const errors = reactive<Record<string, string>>({});

const clearError = (field: string) => {
  if (errors[field]) delete errors[field];
};

watch(() => formData.cpf, (val) => { if (val) formData.cpf = formatCpf(val); });
watch(() => formData.phone, (val) => { if (val) formData.phone = formatPhone(val); });

const validate = () => {
  let isValid = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  if (!formData.fullName) { errors.fullName = 'Nome é obrigatório'; isValid = false; }
  if (!formData.email?.includes('@')) { errors.email = 'E-mail inválido'; isValid = false; }
  
  const cpfClean = formData.cpf?.replace(/\D/g, '') || '';
  if (cpfClean.length !== 11) { errors.cpf = 'CPF incompleto'; isValid = false; }
  
  const phoneClean = formData.phone?.replace(/\D/g, '') || '';
  if (phoneClean.length < 10) { errors.phone = 'Telefone inválido (mín. 10 dígitos)'; isValid = false; }
  
  if (!formData.birthDate) {
    errors.birthDate = 'Data é obrigatória';
    isValid = false;
  } else {
    const selectedDate = new Date(formData.birthDate);
    const today = new Date();
    if (selectedDate > today) {
      errors.birthDate = 'Data não pode ser futura';
      isValid = false;
    }
  }

  return isValid;
};

const submitForm = async () => {
  errorMsg.value = '';
  if (!validate()) return;
  
  try {
    const payload = {
      ...formData,
      cpf: formData.cpf?.replace(/\D/g, ''),
      phone: formData.phone?.replace(/\D/g, ''),
    };

    await store.createPerson(payload);

    successMsg.value = 'Profissional registrado com sucesso no ecossistema AI!';
    
    // Clear all
    Object.keys(formData).forEach(key => (formData as any)[key] = '');
    setTimeout(() => {
      successMsg.value = '';
      emit('success');
    }, 2000);
  } catch (e: any) {
    errorMsg.value = e.message || 'Erro ao criar profissional.';
  }
};
</script>

<template>
  <div class="bg-(--bg-card) rounded-2xl shadow-xl shadow-(--primary-color)/10 border border-slate-800 p-6">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-white">Novo Cadastro</h2>
      <p class="text-sm text-slate-400">A biografia será catalogada pela Inteligência Artificial.</p>
    </div>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div v-if="errorMsg"
        class="bg-red-950/30 text-red-400 p-3 rounded-xl text-sm mb-4 border border-red-900/50 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        {{ errorMsg }}
      </div>

      <div v-if="successMsg"
        class="bg-emerald-950/30 text-emerald-400 p-3 rounded-xl text-sm mb-4 border border-emerald-900/50 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        {{ successMsg }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput v-model="formData.fullName" label="Nome Completo" placeholder="Ex: Ada Lovelace" :error="errors.fullName" @update:modelValue="clearError('fullName')" />
        <BaseInput v-model="formData.email" type="email" label="E-mail" placeholder="ada@exemplo.com" :error="errors.email" @update:modelValue="clearError('email')" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BaseInput v-model="formData.cpf" label="CPF" placeholder="000.000.000-00" :error="errors.cpf"
          :maxLength="14" @update:modelValue="clearError('cpf')" />
        <BaseInput v-model="formData.phone" label="Telefone" placeholder="(11) 90000-0000" :error="errors.phone"
          :maxLength="15" @update:modelValue="clearError('phone')" />
        <BaseInput v-model="formData.birthDate" type="date" label="Data de Nascimento" :error="errors.birthDate"
          @update:modelValue="clearError('birthDate')" />
      </div>

      <div class="mt-4">
        <label class="text-sm font-medium text-slate-300">Resumo Profissional / Bio</label>
        <textarea v-model="formData.bio"
          placeholder="Descreva as habilidades. A IA usará essa bio para ranquear procuras conceituais." rows="3"
          class="w-full px-4 py-2 mt-1 bg-black/40 border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-(--primary-color) focus:border-transparent transition-all duration-200 border-slate-800 text-white placeholder-slate-600"></textarea>
      </div>

      <div class="pt-4 flex justify-end">
        <BaseButton type="submit" variant="primary" :isLoading="store.isLoading">
          Registrar Perfil IA
        </BaseButton>
      </div>
    </form>
  </div>
</template>
