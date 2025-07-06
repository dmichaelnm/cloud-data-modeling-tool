<template>
  <!-- Dialog -->
  <q-dialog
    ref="applicationDialog"
    :model-value="_modelValue"
    persistent
    @update:modelValue="(val) => (_modelValue = val)"
    @before-show="emits('initialize')"
  >
    <!-- Dialog DIV -->
    <div class="frame" :style="`width: ${_width}px; max-width: ${_width}px;`">
      <!-- Title Row -->
      <div class="row frame-row" v-if="title">
        <!-- Title Column -->
        <div class="col dialog-title" :style="`color: ${_color}`">{{ title }}</div>
      </div>
      <!-- Separator -->
      <q-separator v-if="title" :style="`backgroundColor: ${_color}; height: ${_separatorSize}`" />
      <!-- Message Row -->
      <div class="row frame-row" v-if="message">
        <!-- Message Row Slot -->
        <slot name="messageRow">
          <!-- Message Column -->
          <div class="col">{{ message }}</div>
        </slot>
      </div>
      <!-- Dialog Content Row -->
      <div class="row frame-row" :style="`height: ${height + 'px'}`">
        <!-- Dialog Content Column -->
        <div class="col">
          <!-- Form -->
          <q-form ref="dialogForm" @submit="onSubmit">
            <!-- Hidden button for submit -->
            <button type="submit" style="display: none" />
            <!-- Dialog Content Slot -->
            <slot />
          </q-form>
        </div>
      </div>
      <!-- Bottom Row -->
      <div class="row frame-row">
        <!-- Left Bottom Column -->
        <div class="col-6">
          <!-- Left Bottom Slot -->
          <slot name="bottomLeft" />
        </div>
        <!-- Dialog Button Column -->
        <div class="col-6 text-right q-gutter-x-sm">
          <!-- Dialog Buttons -->
          <button-label
            v-for="btn of _buttons"
            :key="btn.value"
            :label="btn.label"
            :appearance="btn.appearance"
            :color="btn.color"
            dense
            @click="performButtonDialogClick(btn.value)"
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

.dialog-title {
  font-weight: bold;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCommonComposables, useRunAsync } from 'src/scripts/composables/Common';
import { colors, QDialog, QForm } from 'quasar';
import { TDialogButton } from 'src/scripts/composables/Dialog';
import ButtonLabel from 'components/common/ButtonLabel.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function for executing asynchronous tasks.
 */
const runAsync = useRunAsync();

/**
 * A reactive reference to this dialog component instance.
 */
const applicationDialog = ref<QDialog | null>(null);
/**
 * A reactive reference to the form of this dialog.
 */
const dialogForm = ref<QForm | null>(null);

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: boolean;
  // Optional dialog buttons
  buttons?: TDialogButton[] | undefined;
  // Optional dialog title
  title?: string;
  // Optional dialog message
  message?: string;
  // Optional dialog width in pixels
  width?: number;
  // Optional dialog height in pixels
  height?: number;
  // Optional color for the title and the separator
  color?: string;
  // Optional size for the separator
  separatorSize?: string;
  // Optional submit handler function
  submitHandler?: () => Promise<boolean>;
  // Optional close handler function
  closeHandler?: (value: string) => boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Triggered when the model value is updated.
  (event: 'update:modelValue', value: boolean): void;
  // Triggered when the component is closed.
  (event: 'close', value: string): void;
  // Trigger before the dialog is shown.
  (event: 'initialize'): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

/**
 * Computed property `_buttons` that determines the set of buttons to be displayed in a dialog.
 *
 * This property returns a predefined set of default buttons if no custom buttons are provided
 * through the `props.buttons`. The default button configuration includes a "close" button with
 * a label translated from a common internationalization utility.
 *
 * If `props.buttons` is defined, it overrides the default buttons.
 */
const _buttons = computed(() => {
  const defaultButtons: TDialogButton[] = [
    { value: 'close', label: common.i18n.t('button.close'), appearance: 'link' },
  ];
  return props.buttons ?? defaultButtons;
});

/**
 * A computed property that determines the color to be used based on the current theme mode
 * (light mode or dark mode) or a color specified in the component's props.
 */
const _color = computed(() => {
  // Get color for light mode
  const light = colors.getPaletteColor('light-border-highlighted');
  // Get color for dark mode
  const dark = colors.getPaletteColor('dark-border-highlighted');
  // Return the color specified in properties or the default color depending on the current dark
  // mode state
  return props.color ?? (common.quasar.dark.isActive ? dark : light);
});

/**
 * A computed property that determines the size of the separator.
 * It retrieves the size from the `separatorSize` property in `props` if it is provided;
 * otherwise, it defaults to '1px'.
 */
const _separatorSize = computed(() => props.separatorSize ?? '1px');

/**
 * A computed property that determines the width value.
 * It either uses the `width` property from the `props` object or defaults to `600` if the
 * `width` is not provided or is undefined.
 */
const _width = computed(() => props.width ?? 600);

/**
 * Handles the click event for a button within a dialog, performing the necessary
 * validations and triggering close events or form submissions as required.
 *
 * @param {string} value - The value associated with the button that was clicked.
 * @return {Promise<void>} A promise that resolves when the dialog click handling is completed.
 */
async function performButtonDialogClick(value: string): Promise<void> {
  // Call the close handler
  const closeResult = props.closeHandler?.(value) ?? true;
  if (closeResult) {
    // Get dialog button
    const btn = _buttons.value.find((btn) => btn.value === value);
    // Check if the button submits a form
    if (btn?.submit) {
      // If there is a form specified, validate the form
      const result = (await dialogForm.value?.validate()) ?? true;
      // If validation fails, don't call the close handler
      if (result) {
        // Call submit handler
        await onSubmit();
      }
    } else {
      // Trigger close event
      emits('close', value);
      // Close the dialog immediately
      applicationDialog.value?.hide();
    }
  }
}

/**
 * Handles the onSubmit event, executing the provided submit handler asynchronously.
 * If the handler resolves to true, the application dialog will be closed.
 *
 * @return {Promise<void>} A promise that resolves when the submit process is complete.
 */
async function onSubmit(): Promise<void> {
  // Call the submit handler function
  const result =
    (await runAsync<boolean>(async () => {
      return (await props.submitHandler?.()) ?? true;
    })) ?? false;
  // Check the result, if true, close the dialog.
  if (result) {
    applicationDialog.value?.hide();
  }
}
</script>
