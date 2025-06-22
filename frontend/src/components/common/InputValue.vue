<template>
  <!-- Input -->
  <q-input
    :model-value="_modelValue"
    :autocomplete="autoComplete"
    :label="label"
    :rules="[(value) => !!value || !mandatory || $t('message.mandatory')]"
    :type="type"
    :autofocus="autoFocus"
    lazy-rules="ondemand"
    input-class="text-label text-field"
    spellcheck="false"
    no-error-icon
    dense
    outlined
    stack-label
    @update:modelValue="(val) => (_modelValue = val)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string | number | null;
  autoComplete?: string;
  label?: string;
  type?: 'text' | 'textarea' | 'number' | 'password' | 'email';
  mandatory?: boolean;
  autoFocus?: boolean;
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', value: string | number | null): void;
}>();

const _modelValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => emits('update:modelValue', value),
});
</script>
