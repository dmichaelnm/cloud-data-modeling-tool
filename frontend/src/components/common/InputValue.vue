<template>
  <!-- Input -->
  <q-input
    :model-value="_modelValue"
    :autocomplete="autoComplete"
    :label="label"
    :rules="[(value) => !!value || !mandatory || $t('message.mandatory')]"
    :type="type"
    :autofocus="autoFocus"
    :error="!!errorMessage && errorMessage !== ''"
    :error-message="errorMessage"
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
  // Model Value
  modelValue: string | number | null;
  // "autocomplete" Attribute
  autoComplete?: string;
  // Label displayed in the input field
  label?: string;
  // The type of the input field
  type?: 'text' | 'textarea' | 'number' | 'password' | 'email';
  // Flag indicating this input field requires a non-empty value
  mandatory?: boolean;
  // Flag indicating this input field gains the focus after the page is rendered
  autoFocus?: boolean;
  // Error message to be displayed below the input field
  errorMessage?: string;
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
