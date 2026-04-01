<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled || isLoading"
    @click="emit('click', $event)"
    class="relative cursor-pointer inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium rounded-xl shadow-md transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed group"
    :class="{
      'bg-(--primary-color) text-white hover:brightness-150 focus:ring-(--primary-color) shadow-xl shadow-(--primary-color)/30 border border-slate-700': variant === 'primary' || !variant,
      'bg-transparent text-(--secondary-color) border border-slate-600 hover:bg-slate-800 focus:ring-slate-500': variant === 'secondary',
      'bg-red-900 border border-red-700 text-white hover:bg-red-800 focus:ring-red-400': variant === 'danger',
    }"
  >
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-inherit">
      <svg class="w-5 h-5 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <span :class="{ 'opacity-0': isLoading }" class="flex items-center gap-2">
      <slot></slot>
    </span>
  </button>
</template>
