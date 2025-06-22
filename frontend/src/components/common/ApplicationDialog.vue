<template>
  <!-- Dialog -->
  <q-dialog
    ref="applicationDialog"
    :model-value="_modelValue"
    persistent
    @update:modelValue="(val) => (_modelValue = val)"
  >
    <!-- Dialog DIV -->
    <div class="frame" :style="`width: ${_width}px`">
      <!-- Title Row -->
      <div class="row frame-row" v-if="title">
        <!-- Title Column -->
        <div class="col dialog-title">{{ title }}</div>
      </div>
      <!-- Separator -->
      <q-separator
        v-if="title"
        :style="`backgroundColor: ${_separatorColor}; height: ${_separatorSize}`"
      />
      <!-- Message Row -->
      <div class="row frame-row" v-if="message">
        <!-- Message Column -->
        <div class="col">{{ message }}</div>
      </div>
      <!-- Dialog Content Row -->
      <div class="row frame-row">
        <!-- Dialog Content Column -->
        <div class="col">
          <!-- Dialog Content Slot -->
          <slot />
        </div>
      </div>
      <!-- Dialog Button Row -->
      <div class="row frame-row">
        <!-- Dialog Button Column -->
        <div class="col text-right q-gutter-x-sm">
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
  color: $light-text-highlighted;
}

.body--dark .dialog-title {
  color: $dark-text-highlighted;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { colors, QDialog } from 'quasar';
import type { TDialogButton } from 'src/scripts/composables/Dialog';
import ButtonLabel from 'components/common/ButtonLabel.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * A reactive reference to this dialog component instance.
 */
const applicationDialog = ref<QDialog | null>(null);

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: boolean;
  // Optional dialog buttons
  buttons?: TDialogButton[];
  // Optional dialog title
  title?: string;
  // Optional dialog message
  message?: string;
  // Optional dialog width in pixels
  width?: number;
  // Optional color for the separator
  separatorColor?: string;
  // Optional size for the separator (f.e. 2px)
  separatorSize?: string;
  // Optional close handler function
  closeHandler?: (value: string) => Promise<boolean>;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Triggered when the model value is updated.
  (event: 'update:modelValue', value: boolean): void;
  // Triggered when the component is closed.
  (event: 'close', value: string): void;
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
 * Computed variable that determines the color used for the separator element.
 * The color is dynamically resolved based on the current theme (`light` or `dark`)
 * and an optional `separatorColor` property from the provided component props.
 *
 * - If `separatorColor` is explicitly provided, it takes precedence.
 * - For dark mode, a highlighted dark border color is used.
 * - For light mode, a highlighted light border color is used.
 */
const _separatorColor = computed(() => {
  // Get color for light mode
  const lightBorderHighlighted = colors.getPaletteColor('light-border-highlighted');
  // Get color for dark mode
  const darkBorderHighlighted = colors.getPaletteColor('dark-border-highlighted');
  // Return the color specified in properties or the default color depending on the current dark
  // mode state
  return (props.separatorColor ?? common.quasar.dark.isActive)
    ? darkBorderHighlighted
    : lightBorderHighlighted;
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
 * Handles the click event of a button in a dialog and triggers appropriate actions,
 * such as calling a close handler and emitting a 'close' event.
 *
 * @param {string} value - The value associated with the button click event, passed to the close
 *                         handler and emitted event.
 * @return {Promise<void>} - A promise that resolves once the button click actions are completed.
 */
async function performButtonDialogClick(value: string): Promise<void> {
  // Check if a close handler is provided
  if (props.closeHandler) {
    // Call the close handler and retrieve the result
    const result = await props.closeHandler(value);
    // If the result is true, close the dialog
    if (result) {
      // Emit the close event
      emits('close', value);
      // Close the dialog
      applicationDialog.value?.hide();
    }
  }
  // No close handler, so close the dialog immediately
  else {
    // Emit the close event
    emits('close', value);
    // Close the dialog
    applicationDialog.value?.hide();
  }
}
</script>
