<template>
  <!-- Application Table -->
  <application-table
    v-model="_modelValue"
    :columns="[
      {
        name: 'key',
        label: 'Key',
        align: 'left',
        headerStyle: 'width: 200px',
        inputType: (row) => (row.locked ? cm.ETableColumnType.None : cm.ETableColumnType.InputText),
        field: (row) => row.key,
      },
      {
        name: 'type',
        label: 'Type',
        align: 'left',
        headerStyle: 'width: 200px',
        inputType: (row) => (row.locked ? cm.ETableColumnType.None : cm.ETableColumnType.Select),
        options: customAttributeTypes(),
        field: (row) => $t(`options.customAttributeType.${row.type}`),
      },
      {
        name: 'value',
        label: 'Value',
        align: 'left',
        inputType: (row) =>
          row.locked ? cm.ETableColumnType.None : getInputType(row as TCustomAttribute),
        field: (row) => row.value,
      },
    ]"
    :message="_message"
    :empty-table-message="$t('main.dialog.tab.customAttributes.emptyTableMessage')"
    :height="200"
    :add-row-handler="onAddRow"
    :validation-handler="validate"
    selectable
    removable
  ></application-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCustomAttributeTypeOptions } from 'src/scripts/composables/Options';
import { toBoolean, toNumber } from 'src/scripts/Utilities';
import { ECustomAttributeType, TCustomAttribute } from 'src/scripts/documents/Document';
import * as cm from 'src/scripts/composables/Common';
import ApplicationTable from 'components/common/ApplicationTable.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = cm.useCommonComposables();
/**
 * Function returning an array of custom attribute types.
 */
const customAttributeTypes = useCustomAttributeTypeOptions();

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: TCustomAttribute[];
  // Optional specific message
  message?: string;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  (event: 'update:modelValue', value: TCustomAttribute[]): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

/**
 * A computed property that resolves and retrieves the appropriate localized message string.
 * If `props.message` is defined, it localizes the value of `props.message`.
 * Otherwise, it defaults to localizing a predefined string under 'main.dialog.tab.customAttributes.message'.
 */
const _message = computed(() =>
  props.message
    ? common.i18n.t(props.message)
    : common.i18n.t('main.dialog.tab.customAttributes.message'),
);

/**
 * Handles the addition of a new row to the model by generating a unique key and appending
 * a new attribute object to the model value. The function ensures the uniqueness of the key
 * by checking existing attribute keys in the model.
 *
 * @param {Function} notify - A callback function that will be invoked after a new row is added.
 * @return {void} This method does not return a value.
 */
function onAddRow(notify: () => void): void {
  let nextFreeIndex = 0;
  while (_modelValue.value.some((attr) => attr.key === `attributeKey_${nextFreeIndex}`)) {
    nextFreeIndex++;
  }
  _modelValue.value.push({
    key: `attributeKey_${nextFreeIndex}`,
    type: ECustomAttributeType.String,
    value: '',
    locked: false,
  });
  notify();
}

/**
 * Determines the input type for a given row based on its custom attribute type.
 *
 * @param {TCustomAttribute} row - The row object that contains the custom attribute type.
 * @return {cm.ETableColumnType} The corresponding input type for the provided custom attribute.
 */
function getInputType(row: TCustomAttribute): cm.ETableColumnType {
  return row.type === ECustomAttributeType.Boolean
    ? cm.ETableColumnType.Checkbox
    : row.type === ECustomAttributeType.Number
      ? cm.ETableColumnType.InputNumber
      : cm.ETableColumnType.InputText;
}

/**
 * Validates and processes the input based on the column type and updates the value accordingly.
 *
 * @param {number} rowIndex - The index of the row being processed.
 * @param {cm.TTableColumn} column - The column definition containing the details of the field being validated.
 * @param {any} oldValue - The previous value of the field before the update.
 * @param {any} newValue - The new value to validate and update.
 * @return {any} The validated or adjusted value for the specified column and row.
 */
function validate(rowIndex: number, column: cm.TTableColumn, oldValue: any, newValue: any): any {
  if (column.name === 'key') {
    // Remove all special characters from the name
    newValue = (newValue as string).replace(/[^a-zA-Z0-9_]/g, '');
    // Make the first character as lower case
    newValue =
      (newValue as string).substring(0, 1).toLowerCase() + (newValue as string).substring(1);
    // Check if the new key isn't already used, if so, replace it with the old value
    if (_modelValue.value.some((att, idx) => rowIndex !== idx && newValue === att.key)) {
      newValue = oldValue;
    }
    // Return new value
    return newValue;
  } else if (column.name === 'type') {
    if (_modelValue.value[rowIndex]) {
      // Get the type
      const type = newValue as ECustomAttributeType;
      // Check the string type
      if (type === ECustomAttributeType.String) {
        _modelValue.value[rowIndex].value = _modelValue.value[rowIndex].value?.toString() ?? '';
      }
      // Check number type
      else if (type === ECustomAttributeType.Number) {
        const value = toNumber(_modelValue.value[rowIndex].value);
        if (value === null) {
          _modelValue.value[rowIndex].value = 0;
        } else {
          _modelValue.value[rowIndex].value = value;
        }
      }
      // Check boolean type
      else if (type === ECustomAttributeType.Boolean) {
        _modelValue.value[rowIndex].value = toBoolean(_modelValue.value[rowIndex].value);
      }
      // Return new value
      return newValue;
    }
  } else if (column.name === 'value') {
    if (_modelValue.value[rowIndex]) {
      // Get the type
      const type = _modelValue.value[rowIndex].type;
      // Check number type
      if (type === ECustomAttributeType.Number) {
        const value = toNumber(newValue);
        newValue = value !== null ? value : oldValue;
      }
      // Return the new value
      return newValue;
    }
  }
  return oldValue;
}
</script>
