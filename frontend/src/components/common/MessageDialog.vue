<template>
  <!-- Application Dialog -->
  <application-dialog
    :model-value="_modelValue"
    :title="messageDialogOptions.title"
    :message="messageDialogOptions.message"
    :color="_separatorColor"
    :buttons="messageDialogOptions.buttons"
    @close="performDialogCloseEvent"
    @update:modelValue="(val) => (_modelValue = val)"
  >
    <!-- Detailed Message Expansion Item -->
    <q-expansion-item :label="$t('label.details')" dense v-if="messageDialogOptions.details">
      <!-- Detailed Message Scroll Area -->
      <q-scroll-area style="height: 100px">
        <!-- Detailed Message -->
        <div>{{ messageDialogOptions.details }}</div>
      </q-scroll-area>
    </q-expansion-item>
  </application-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { messageDialogOptions } from 'src/scripts/composables/Dialog';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { colors } from 'quasar';
import ApplicationDialog from 'components/common/ApplicationDialog.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * Properties used in this component.
 */
const props = defineProps<{
  modelValue: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

/**
 * A computed property that determines the color of the separator based on the type of message dialog
 * and the current theme (dark or light mode).
 */
const _separatorColor = computed(() => {
  switch (messageDialogOptions.value.type) {
    case 'info':
      return common.quasar.dark.isActive
        ? colors.getPaletteColor('light-border-normal')
        : colors.getPaletteColor('dark-border-normal');
    case 'warning':
      return colors.getPaletteColor('warning');
    case 'error':
      return colors.getPaletteColor('negative');
    case 'success':
      return colors.getPaletteColor('positive');
    case 'question':
      return common.quasar.dark.isActive
        ? colors.getPaletteColor('dark-border-highlighted')
        : colors.getPaletteColor('light-border-highlighted');
    default:
      return colors.getPaletteColor('light-border-normal');
  }
});

/**
 * Handles the dialog close event by invoking the specified close handler, passing the given value.
 *
 * @param {string} value - The value to pass to the close handler when the dialog is closed.
 * @return {Promise<void>} A promise that resolves when the close handler function has been executed.
 */
async function performDialogCloseEvent(value: string): Promise<void> {
  if (messageDialogOptions.value.closeHandler) {
    await messageDialogOptions.value.closeHandler(value);
  }
}
</script>
