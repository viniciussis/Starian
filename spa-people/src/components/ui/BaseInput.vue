<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue?: string;
  label: string;
  id?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  maxLength?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const localId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`);
</script>

<template>
  <div class="flex flex-col space-y-1">
    <label :for="localId" class="text-sm font-medium text-slate-300">
      {{ label }}
    </label>
    <input
      :id="localId"
      :type="type || 'text'"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :maxlength="maxLength"
      class="w-full px-4 py-2 mt-1 bg-black/50 border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-(--primary-color) focus:border-transparent transition-all duration-200 text-white placeholder-slate-600"
      :class="error ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 hover:border-slate-700'"
    />
    <span v-if="error" class="text-xs text-red-500 mt-1 animate-pulse">{{ error }}</span>
  </div>
</template>
