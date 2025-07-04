<template>
  <!-- Table Main DIV -->
  <div class="q-col-gutter-y-sm">
    <!-- Table Message Row -->
    <div class="row" v-if="message">
      <!-- Table Message Column -->
      <div class="col">{{ message }}</div>
    </div>
    <!-- Empty Table Message Row -->
    <div class="row" v-if="_modelValue.length === 0 && emptyTableMessage">
      <!-- Empty Table Message Column -->
      <div class="col text-disabled text-small">{{ emptyTableMessage }}</div>
    </div>
    <!-- Table Content Row -->
    <div class="row" v-if="_modelValue.length > 0">
      <!-- Table Content Column -->
      <div class="col">
        <!-- Table -->
        <q-table
          :rows="_modelValue"
          :columns="_columns"
          :style="`max-height: ${height}px`"
          :pagination="{ rowsPerPage: rowsPerPage ?? 0 }"
          :hide-pagination="!rowsPerPage"
          :rows-per-page-options="[]"
          :pagination-label="(f, e, t) => f + ' - ' + e + ' / ' + t"
          class="application-table scrollbar"
          dense
          flat
          hide-no-data
          wrap-cells
        >
          <!-- Template Selection Marker Column -->
          <template v-slot:body-cell-_selection="props" v-if="!readOnly">
            <!-- Table Cell -->
            <q-td :props="props">
              <!-- Selection Radio Button -->
              <q-radio v-model="selectedRowIndex" :val="props.rowIndex" size="xs" />
            </q-td>
          </template>
          <!-- Template Custom Columns -->
          <template v-for="col in columns" :key="col.name" v-slot:[getSlotName(col)]="props">
            <!-- Slot Custom Column -->
            <slot :name="getSlotName(col)" :props="props">
              <!-- Table Cell -->
              <q-td :props="props" :class="`vertical-${col.verticalAlign ?? 'middle'}`">
                <!-- Display Value -->
                <div
                  v-if="
                    !isHidden(col, props.row) &&
                    !isCheckbox(col, props.row) &&
                    !isIcon(col, props.row)
                  "
                >
                  {{ props.value }}
                </div>
                <!-- Value is displayed as a chechbox -->
                <div v-if="isCheckbox(col, props.row) && !isHidden(col, props.row)">
                  <!-- Read Only Icon -->
                  <q-icon
                    v-if="readOnly"
                    :name="`o_check_box${props.value ? '' : '_outline_blank'}`"
                    size="sm"
                  />
                  <!-- Checkbox -->
                  <q-checkbox
                    v-if="!readOnly"
                    v-model="props.row[col.name]"
                    class="application-table-checkbox"
                    size="xs"
                    color="lightHighlighted"
                    @update:model-value="
                      (val) => updateValue(props.rowIndex, props.row, col, val, false)
                    "
                  />
                </div>
                <!-- Text or number input popup editor -->
                <q-popup-edit
                  v-if="!readOnly && !isHidden(col, props.row) && isInputField(col, props.row)"
                  v-model="props.row[col.name]"
                  v-slot="scope"
                  :ref="refPopupEditor(col, props.rowIndex)"
                  anchor="center middle"
                  @show="selectInputField(props.rowIndex, col)"
                >
                  <!-- Input Field -->
                  <input-value
                    v-model="scope.value"
                    :ref="refInputValue(col, props.rowIndex)"
                    :label="col.label"
                    :type="
                      getInputType(col, props.row) === cm.ETableColumnType.InputNumber
                        ? 'number'
                        : 'text'
                    "
                    hide-bottom-space
                    @focusout="updateValue(props.rowIndex, props.row, col, scope.value, true)"
                    @keyup.enter="hidePopupEditor(props.rowIndex, col)"
                    @blur="hidePopupEditor(props.rowIndex, col)"
                  />
                </q-popup-edit>
                <!-- Selection popup editor -->
                <q-popup-edit
                  v-if="!readOnly && !isHidden(col, props.row) && isSelectValue(col, props.row)"
                  v-model="props.row[col.name]"
                  v-slot="scope"
                  :ref="refPopupEditor(col, props.rowIndex)"
                  anchor="center middle"
                  @show="showSelectOptions(props.rowIndex, col)"
                >
                  <!-- Select Value -->
                  <select-value
                    v-model="scope.value"
                    :ref="refSelectValue(col, props.rowIndex)"
                    :label="col.label"
                    :options="col.options ?? []"
                    @update:model-value="
                      updateValue(props.rowIndex, props.row, col, scope.value, true)
                    "
                  />
                </q-popup-edit>
              </q-td>
            </slot>
          </template>
        </q-table>
      </div>
    </div>
    <!-- Table Buttons Row -->
    <div class="row">
      <!-- Table Buttons Column -->
      <div class="col">
        <!-- Add Row Button -->
        <button-icon v-if="addRowHandler && !readOnly" icon="add" @click="onAddRow" />
        <!-- Remove Row Button -->
        <button-icon
          v-if="removable && !readOnly"
          :class="selectedRowIndex < 0 ? 'invisible' : ''"
          icon="remove"
          @click="onRemoveRow"
        />
        <!-- Move To Top Button -->
        <button-icon
          v-if="sortable && !readOnly"
          :class="selectedRowIndex < 2 ? 'invisible' : ''"
          icon="keyboard_double_arrow_up"
          @click="onMoveToTop"
        />
        <!-- Move Up -->
        <button-icon
          v-if="sortable && !readOnly"
          :class="selectedRowIndex < 1 ? 'invisible' : ''"
          icon="keyboard_arrow_up"
          @click="onMoveUp"
        />
        <!-- Move Down -->
        <button-icon
          v-if="sortable && !readOnly"
          :class="
            selectedRowIndex === -1 || selectedRowIndex > _modelValue.length - 2 ? 'invisible' : ''
          "
          icon="keyboard_arrow_down"
          @click="onMoveDown"
        />
        <!-- Move To Bottom -->
        <button-icon
          v-if="sortable && !readOnly"
          :class="
            selectedRowIndex === -1 || selectedRowIndex > _modelValue.length - 3 ? 'invisible' : ''
          "
          icon="keyboard_double_arrow_down"
          @click="onMoveToBottom"
        />
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import 'src/css/quasar.variables.scss'

.application-table
  background-color: transparent
  border: 1px solid $light-border-normal
  border-radius: 4px
  overflow-y: auto
  width: 100%


.body--dark .application-table
  border: 1px solid $dark-border-normal
</style>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { QPopupEdit } from 'quasar';
import * as cm from 'src/scripts/composables/Common';
import ButtonIcon from 'components/common/ButtonIcon.vue';
import InputValue from 'components/common/InputValue.vue';
import SelectValue from 'components/common/SelectValue.vue';

/**
 * A reactive object that holds references to popup editors.
 */
const popupEditorReferences = reactive(<Record<string, QPopupEdit>>{});
/**
 * A reactive object that holds references to input fields.
 */
const inputValueReferences = reactive(<Record<string, InstanceType<typeof InputValue>>>{});
/**
 * A reactive object that holds references to select components.
 */
const selectValueReferences = reactive(<Record<string, InstanceType<typeof SelectValue>>>{});
/**
 * A reactive variable that holds the index of the currently selected row.
 */
const selectedRowIndex = ref(-1);

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model Value
  modelValue: Record<string, any>[];
  // Column Definitions
  columns: cm.TTableColumn[];
  // Height of the table
  height: number;
  // Table Message
  message?: string;
  // Empty Table Message
  emptyTableMessage?: string;
  // Add Row handler-function
  addRowHandler?: (notify: () => void) => void;
  // Validation handler-function
  validationHandler?: (
    rowIndex: number,
    column: cm.TTableColumn,
    oldValue: any,
    newValue: any,
  ) => boolean;
  // Rows are selectable
  selectable?: boolean;
  // Rows are removable
  removable?: boolean;
  // Rows are sortable;
  sortable?: boolean;
  // Table is read-only
  readOnly?: boolean | undefined;
  // Rows per page (0: all rows)
  rowsPerPage?: number;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  (event: 'update:modelValue', value: Record<string, any>[]): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

/**
 * A computed property that generates a list of table columns with additional conditions applied.
 *
 * The `_columns` property constructs and returns an array of table column definitions (`cm.TTableColumn[]`)
 * based on the component's props and certain predefined rules:
 * - If the `selectable` prop is true, a selection marker column is added with a fixed width of 50px.
 * - Custom columns specified in the `columns` prop are appended to the array.
 * - If all columns contain a `headerStyle` attribute, an additional empty column without a `headerStyle` is added.
 */
const _columns = computed(() => {
  // Create the column array
  const columns: cm.TTableColumn[] = [];
  // Add a selection marker column if necessary
  if (props.selectable) {
    columns.push({ name: '_selection', label: '', headerStyle: 'width: 50px', field: '' });
  }
  // Add custom columns
  columns.push(...props.columns);
  // Check if all columns have a headerStyle attribute
  if (!columns.some((column) => column.headerStyle === undefined)) {
    // Add an empty column without a headerStyle attribute
    columns.push({ name: '_empty', label: '', field: '' });
  }
  // Return columns
  return columns;
});

/**
 * Retrieves the icon associated with a table column and a specific row.
 *
 * @param {cm.TTableColumn} column - The column definition, which may include an icon or icon function.
 * @param {Record<string, any>} row - The data record corresponding to a specific row in the table.
 * @return {string | undefined} The icon name as a string if defined, or undefined if no icon is associated.
 */
function getIcon(column: cm.TTableColumn, row: Record<string, any>): string | undefined {
  // Default icon string
  let icon = undefined;
  // Check for a specific icon type
  if (column.icon) {
    // Check for an icon function
    if (typeof column.icon === 'function') {
      // Evaluate icon function
      icon = column.icon(row);
    } else {
      // Static icon name
      icon = column.icon;
    }
  }
  // Return the icon
  return icon;
}

/**
 * Determines the input type for a table column based on the column configuration and row data.
 *
 * @param {cm.TTableColumn} column - The column configuration containing input type details.
 * @param {Record<string, any>} row - The row data to evaluate the input type against.
 * @return {cm.ETableColumnType} The determined input type for the given column and row data.
 */
function getInputType(column: cm.TTableColumn, row: Record<string, any>): cm.ETableColumnType {
  // Default input type
  let inputType = cm.ETableColumnType.None;
  // Check for a specific input type
  if (column.inputType) {
    // Check for a function
    if (typeof column.inputType === 'function') {
      // Evaluate input type function
      inputType = column.inputType(row);
    } else {
      // Input type is static
      inputType = column.inputType;
    }
  }
  // Return the input type
  return inputType;
}

/**
 * Determines if the column in a specific row is an input field.
 *
 * @param {cm.TTableColumn} column - The column definition to check.
 * @param {Record<string, any>} row - The data row associated with the column.
 * @return {boolean} - Returns true if the column is an input field, otherwise false.
 */
function isInputField(column: cm.TTableColumn, row: Record<string, any>): boolean {
  const inputType = getInputType(column, row);
  return (
    inputType === cm.ETableColumnType.InputText || inputType === cm.ETableColumnType.InputNumber
  );
}

/**
 * Determines if the input type of a column for a given row is of type Select.
 *
 * @param {cm.TTableColumn} column - The column definition object that describes the properties of the table column.
 * @param {Record<string, any>} row - The data record corresponding to the row being checked.
 * @return {boolean} Returns true if the input type of the column for the row is of type Select, otherwise false.
 */
function isSelectValue(column: cm.TTableColumn, row: Record<string, any>): boolean {
  return getInputType(column, row) === cm.ETableColumnType.Select;
}

/**
 * Determines whether the specified column and row combination represents a checkbox type.
 *
 * @param {cm.TTableColumn} column - The column definition used to evaluate the input type.
 * @param {Record<string, any>} row - The row data associated with the column.
 * @return {boolean} Returns true if the input type is a checkbox; otherwise, false.
 */
function isCheckbox(column: cm.TTableColumn, row: Record<string, any>): boolean {
  return getInputType(column, row) === cm.ETableColumnType.Checkbox;
}

/**
 * Determines whether an icon exists for the given column and row data.
 *
 * @param {cm.TTableColumn} column - The column definition that specifies the properties associated with the column.
 * @param {Record<string, any>} row - The row data represented as a key-value mapping.
 * @return {boolean} Returns true if an icon is present for the specified column and row, otherwise false.
 */
function isIcon(column: cm.TTableColumn, row: Record<string, any>): boolean {
  return getIcon(column, row) !== undefined;
}

/**
 * Determines if a column should be hidden based on its `hide` property.
 *
 * @param {cm.TTableColumn} column - The column configuration object, which may include a `hide` property.
 * @param {Record<string, any>} row - A record representing the data for the current row.
 * @return {boolean} Returns true if the column should be hidden, otherwise false.
 */
function isHidden(column: cm.TTableColumn, row: Record<string, any>): boolean {
  // Check if the hide attribute is specified
  if (column.hide) {
    // Check for function
    if (typeof column.hide === 'function') {
      // Evaluate hide function and return result
      return column.hide(row);
    } else {
      // Return static value
      return column.hide;
    }
  }
  // Column is not hidden
  return false;
}

/**
 * Generates a slot name for a table column.
 *
 * @param {cm.TTableColumn} column - The column object containing the name attribute.
 * @return {`body-cell-${string}`} The generated slot name in the format `body-cell-{column.name}`.
 */
function getSlotName(column: cm.TTableColumn): `body-cell-${string}` {
  return `body-cell-${column.name}`;
}

/**
 * Stores a reference for a popup editor associated with a specific table column and row index.
 *
 * @param {cm.TTableColumn} column - The column configuration object representing the table column.
 * @param {number} rowIndex - The index of the row in the table.
 * @return {Function} A function that takes a popup editor instance and associates it with the corresponding
 *         column and row index.
 */
function refPopupEditor(column: cm.TTableColumn, rowIndex: number): (el: any) => any {
  return (el: QPopupEdit) => {
    popupEditorReferences[`pe_${column.name}_${rowIndex}`] = el;
  };
}

/**
 * Stores a reference to an input value element corresponding to a specific column and row.
 *
 * @param {cm.TTableColumn} column - The column for which the input value reference is managed.
 * @param {number} rowIndex - The index of the row corresponding to the input value reference.
 * @return {function(any): any} A function that assigns the reference of the input value element.
 */
function refInputValue(column: cm.TTableColumn, rowIndex: number): (el: any) => any {
  return (el: InstanceType<typeof InputValue>) => {
    inputValueReferences[`iv_${column.name}_${rowIndex}`] = el;
  };
}

/**
 * Stores a reference to a `SelectValue` instance for a given table column and row index.
 *
 * @param {cm.TTableColumn} column - The column object that represents the table column.
 * @param {number} rowIndex - The index of the row to associate with the `SelectValue` instance.
 * @return {(el: any) => any} A function that takes a `SelectValue` instance and stores it in the reference collection.
 */
function refSelectValue(column: cm.TTableColumn, rowIndex: number): (el: any) => any {
  return (el: InstanceType<typeof SelectValue>) => {
    selectValueReferences[`sv_${column.name}_${rowIndex}`] = el;
  };
}

/**
 * Hides the popup editor for a specific cell identified by its row index and column.
 *
 * @param {number} rowIndex - The index of the row where the popup editor is located.
 * @param {cm.TTableColumn} column - The column object associated with the popup editor to hide.
 * @return {void} This method does not return a value.
 */
function hidePopupEditor(rowIndex: number, column: cm.TTableColumn): void {
  // Get popup editor reference
  const reference = popupEditorReferences[`pe_${column.name}_${rowIndex}`];
  // Check reference
  if (reference) {
    // Hide popup editor
    reference.hide();
  }
}

/**
 * Selects the input field based on the row index and column information.
 *
 * @param {number} rowIndex - The index of the row containing the input field.
 * @param {cm.TTableColumn} column - The column object containing metadata about the column.
 * @return {void} This method does not return a value.
 */
function selectInputField(rowIndex: number, column: cm.TTableColumn): void {
  // Get the input value reference
  const reference = inputValueReferences[`iv_${column.name}_${rowIndex}`];
  // Check reference
  if (reference) {
    // Call the select function
    reference.select();
  }
}

/**
 * Displays the select options popup for a specific table cell based on the provided row index and column.
 *
 * @param {number} rowIndex - The index of the row for which the select options should be displayed.
 * @param {cm.TTableColumn} column - The column object containing metadata about the table column.
 * @return {void} This function does not return a value.
 */
function showSelectOptions(rowIndex: number, column: cm.TTableColumn): void {
  // Get the select value reference
  const reference = selectValueReferences[`sv_${column.name}_${rowIndex}`];
  // Check reference
  if (reference) {
    // Call the showPopup function
    reference.showPopup();
  }
}

/**
 * Handles the addition of a new row by invoking the provided row handler and updating the selected row index.
 *
 * @return {void} This method does not return any value.
 */
function onAddRow(): void {
  if (props.addRowHandler) {
    props.addRowHandler(() => {
      selectedRowIndex.value = _modelValue.value.length - 1;
    });
  }
}

/**
 * Removes the currently selected row from the model and updates the selected row index.
 * If the selected row index is out of bounds after removal, it adjusts the index to the last row.
 *
 * @return {void} This method does not return any value.
 */
function onRemoveRow(): void {
  if (selectedRowIndex.value >= 0) {
    _modelValue.value.splice(selectedRowIndex.value, 1);
    if (selectedRowIndex.value >= _modelValue.value.length) {
      selectedRowIndex.value = _modelValue.value.length - 1;
    }
  }
}

/**
 * Moves the currently selected row to the top of the list.
 * The rows above the selected row are shifted down by one position.
 *
 * @return {void} This function does not return a value.
 */
function onMoveToTop(): void {
  // Remember the row to be moved
  const row = _modelValue.value[selectedRowIndex.value];
  // Move all rows above one position down
  for (let i = selectedRowIndex.value; i > 0; i--) {
    _modelValue.value[i] = _modelValue.value[i - 1] as Record<string, any>;
  }
  // Set the top row
  _modelValue.value[0] = row as Record<string, any>;
  // Set the newly selected row Index
  selectedRowIndex.value = 0;
}

/**
 * Moves the currently selected row one position up in the model's data structure.
 * Updates the row order and adjusts the selected row index accordingly.
 *
 * @return {void} No return value.
 */
function onMoveUp(): void {
  // Get the selected row index
  const index = selectedRowIndex.value;
  // Remember the row to be moved
  const row = _modelValue.value[index];
  // Move the above row to the current position
  _modelValue.value[index] = _modelValue.value[index - 1] as Record<string, any>;
  // Set the above position to the remembered row
  _modelValue.value[index - 1] = row as Record<string, any>;
  // Set the newly selected row Index
  selectedRowIndex.value = index - 1;
}

/**
 * Moves the currently selected row down by one position in the data model.
 * Updates the data model and adjusts the selected row index accordingly.
 *
 * @return {void} Does not return a value.
 */
function onMoveDown(): void {
  // Get the selected row index
  const index = selectedRowIndex.value;
  // Remember the row to be moved
  const row = _modelValue.value[index];
  // Move the below row to the current position
  _modelValue.value[index] = _modelValue.value[index + 1] as Record<string, any>;
  // Set the below position to the remembered row
  _modelValue.value[index + 1] = row as Record<string, any>;
  // Set the newly selected row Index
  selectedRowIndex.value = index + 1;
}

/**
 * Moves the currently selected row to the bottom of the data set while shifting other rows upwards.
 *
 * @return {void} This method does not return a value.
 */
function onMoveToBottom(): void {
  // Remember the row to be moved
  const row = _modelValue.value[selectedRowIndex.value];
  // Move all rows below one position up
  for (let i = selectedRowIndex.value; i < _modelValue.value.length - 1; i++) {
    _modelValue.value[i] = _modelValue.value[i + 1] as Record<string, any>;
  }
  // Set the bottom row
  _modelValue.value[_modelValue.value.length - 1] = row as Record<string, any>;
  // Set the newly selected row Index
  selectedRowIndex.value = _modelValue.value.length - 1;
}

/**
 * Updates the value of a specific cell in a row and handles the popup editor visibility.
 *
 * @param {number} rowIndex - The index of the row to update.
 * @param {Record<any, any>} row - The row object that contains the data.
 * @param {cm.TTableColumn} column - The column object representing the specific column to update.
 * @param {any} value - The new value to set in the specified cell.
 * @param {boolean} hidePopup - A flag indicating whether to hide the popup editor after the update.
 * @return {void} This method does not return any value.
 */
function updateValue(
  rowIndex: number,
  row: Record<any, any>,
  column: cm.TTableColumn,
  value: any,
  hidePopup: boolean,
): void {
  // Get the old value
  const oldValue = row[column.name];
  // Get the new value
  row[column.name] = props.validationHandler
    ? props.validationHandler(rowIndex, column, oldValue, value)
    : value;
  // Hide the popup editor if necessary
  if (hidePopup) {
    hidePopupEditor(rowIndex, column);
  }
}
</script>
