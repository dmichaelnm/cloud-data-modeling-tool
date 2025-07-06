<template>
  <!-- Select -->
  <q-select
    ref="select"
    :model-value="_modelValue"
    :options="options"
    :label="label"
    :borderless="borderless"
    :outlined="!borderless"
    :autocomplete="autoComplete"
    :readonly="readOnly"
    :hide-dropdown-icon="readOnly"
    dense
    options-dense
    emit-value
    map-options
    stack-label
    @update:model-value="(val) => (_modelValue = val)"
  >
    <!-- Selected Icon Template -->
    <template v-slot:prepend v-if="_showIcon && _selectedOption">
      <!-- Selected Icon Slot -->
      <slot name="selectedIcon">
        <!-- Selected Icon -->
        <q-icon :name="_selectedOption?.icon" />
      </slot>
    </template>
    <!-- Selected Value Template -->
    <template v-slot:selected>
      <!-- Selected Value Slot -->
      <slot name="selectedLabel">
        <!-- Selected Option Label -->
        <div class="text-label text-field" v-if="_selectedOption">
          {{ _selectedOption?.label }}
        </div>
        <!-- No Selection Label -->
        <div class="text-disabled text-field text-italic" v-if="!_selectedOption">
          {{ $t('message.noSelection') }}
        </div>
      </slot>
    </template>
    <!-- Option Template -->
    <template v-slot:option="props">
      <!-- Option Slot -->
      <slot name="option" v-bind="props">
        <!-- Above Separator -->
        <q-separator v-if="props.opt.separator === 'above' || props.opt.separator === 'both'" />
        <!-- Option Item -->
        <q-item clickable v-close-popup dense v-bind="props.itemProps">
          <!-- Option Icon Section -->
          <q-item-section side v-if="_showIcon">
            <!-- Option Icon -->
            <q-icon :name="props.opt.icon" />
          </q-item-section>
          <!-- Option Label Section -->
          <q-item-section>
            <!-- Option Label -->
            <q-item-label class="text-normal text-field">{{ props.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- Below Separator -->
        <q-separator v-if="props.opt.separator === 'below' || props.opt.separator === 'both'" />
      </slot>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TSelectOption } from 'src/scripts/composables/Options';
import { QSelect } from 'quasar';

/**
 * A reactive reference to an instance of the QSelect component or null.
 */
const select = ref<InstanceType<typeof QSelect> | null>(null);

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: string | null;
  // Option items
  options: TSelectOption[];
  // Optional label
  label?: string;
  // Select component is borderless
  borderless?: boolean;
  // Auto complete Attribute
  autoComplete?: string;
  // Read-only flag
  readOnly?: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  (event: 'update:modelValue', value: string | null): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value: string | null) => emits('update:modelValue', value),
});

/**
 * A computed property that determines whether an icon should be shown
 * by evaluating if any of the provided options contain an `icon` property.
 */
const _showIcon = computed(() => props.options.some((opt) => opt.icon));

/**
 * A computed property that determines the currently selected option.
 * The selected option is derived by matching the value of `_modelValue`
 * against the `value` property of the available options in `props.options`.
 */
const _selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === _modelValue.value);
});

/**
 * Displays the popup menu associated with the current value of the select element.
 * Triggers the popup to ensure options are visible to the user.
 *
 * @return {void} Does not return a value.
 */
function showPopup(): void {
  select.value?.showPopup();
}

/**
 * Defines the exposed methods of this component.
 */
defineExpose({ showPopup });
</script>
