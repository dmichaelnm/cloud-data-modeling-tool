<template>
  <!-- Input -->
  <q-input
    ref="input"
    :model-value="_modelValue"
    :autocomplete="autoComplete"
    :label="label"
    :rules="[(value) => !!value || !mandatory || $t('message.mandatory')]"
    :type="type"
    :autofocus="autoFocus"
    :error="!!errorMessage && errorMessage !== ''"
    :error-message="errorMessage"
    :hide-bottom-space="hideBottomSpace"
    :readonly="readOnly"
    :input-class="`text-label text-field ${_class}`"
    :rows="rows"
    lazy-rules="ondemand"
    spellcheck="false"
    no-error-icon
    dense
    outlined
    stack-label
    @update:modelValue="(val) => (_modelValue = val)"
  >
    <!-- Append Template -->
    <template v-slot:append>
      <!-- Append Template Slot -->
      <slot name="append">
        <!-- Show Copy Button -->
        <q-btn round flat dense icon="content_copy" v-if="showCopyButton" @click="copyToClipboard">
          <!-- Tooltip -->
          <q-tooltip>{{ $t('message.copyToClipboard') }}</q-tooltip>
        </q-btn>
      </slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QInput } from 'quasar';

/**
 * A reactive reference variable that holds an instance of QInput or null.
 */
const input = ref<InstanceType<typeof QInput> | null>(null);

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
  // Hide the bottom space
  hideBottomSpace?: boolean;
  // Read-only flag
  readOnly?: boolean | undefined;
  // Copy button flag
  showCopyButton?: boolean;
  // Class attribute
  class?: string;
  // Row count for the textarea type
  rows?: number;
  // Content is only in uppercase
  upperCase?: boolean;
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
  set: (value: string | number | null) =>
    emits(
      'update:modelValue',
      props.upperCase && typeof value === 'string' ? value?.toUpperCase() : value,
    ),
});

/**
 * A computed property that dynamically calculates and returns the `class` value
 * based on the `class` property provided in `props`.
 * This variable is commonly used to bind or observe changes to the `class` property.
 */
const _class = computed(() => props.class);

/**
 * Selects the text content of an input field if it exists.
 *
 * @return {void} Does not return a value.
 */
function select(): void {
  input.value?.select();
}

/**
 * Copies the current value of `_modelValue` to the clipboard using the Clipboard API.
 *
 * @return {Promise<void>} A promise that resolves when the text has been successfully copied to the clipboard.
 */
async function copyToClipboard(): Promise<void> {
  await navigator.clipboard.writeText(_modelValue.value as string);
}

/**
 * Defines the exposed methods of this component.
 */
defineExpose({ select });
</script>
