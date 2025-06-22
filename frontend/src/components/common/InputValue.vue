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

/**
 * Properties used in this component.
 */
const props = defineProps<{
  modelValue: string | number | null;
  autoComplete?: string;
  label?: string;
  type?: 'text' | 'textarea' | 'number' | 'password' | 'email';
  mandatory?: boolean;
  autoFocus?: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  (event: 'update:modelValue', value: string | number | null): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => emits('update:modelValue', value),
});
</script>
