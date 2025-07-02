<template>
  <!-- Account Selection Dialog -->
  <account-selection-dialog
    v-model="accountSelectionDialogVisible"
    :validation-handler="validate"
    @account-selected="onAccountSelected"
  />
  <!-- Application Table -->
  <application-table
    v-model="_modelValue.data.members"
    :height="height"
    :read-only="readOnly"
    :columns="[
      {
        name: 'avatar',
        label: '',
        align: 'center',
        headerStyle: 'width: 50px',
        field: '',
      },
      {
        name: 'name',
        label: $t('project.dialog.tab.members.name'),
        align: 'left',
        headerStyle: 'width: 300px',
        field: (row) => row.name,
      },
      {
        name: 'role',
        label: $t('project.dialog.tab.members.role'),
        align: 'left',
        headerStyle: 'width: 200px',
        inputType: ETableColumnType.Select,
        options: roleOptions(),
        field: (row) => $t(`options.projectRole.${row.role}`),
      },
      {
        name: 'active',
        label: $t('project.dialog.tab.members.active'),
        align: 'center',
        headerStyle: 'width: 100px',
        inputType: ETableColumnType.Checkbox,
        field: (row) => row.active,
      },
      {
        name: 'description',
        label: $t('project.dialog.tab.members.description'),
        align: 'left',
        inputType: ETableColumnType.InputText,
        field: (row) => row.description,
      },
    ]"
    :message="$t('project.dialog.tab.members.messageMemberTable')"
    :empty-table-message="$t('project.dialog.tab.members.emptyTable')"
    :add-row-handler="addRow"
    selectable
    removable
  >
    <!-- Template for member avatar -->
    <template v-slot:body-cell-avatar="{ props }">
      <!-- Table Cell -->
      <q-td :props="props">
        <!-- Account profile -->
        <account-profile
          :account-picture="props.row.picture"
          :account-name="props.row.name"
          size="sm"
        />
      </q-td>
    </template>
  </application-table>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ProjectEditorData, EProjectRole } from 'src/scripts/documents/model/Project';
import { IDocument } from 'src/scripts/documents/Document';
import { IAccountData } from 'src/scripts/documents/model/Account';
import { ETableColumnType, useCommonComposables } from 'src/scripts/composables/Common';
import { useRoleOptions } from 'src/scripts/composables/Options';
import ApplicationTable from 'components/common/ApplicationTable.vue';
import AccountProfile from 'components/authentication/AccountProfile.vue';
import AccountSelectionDialog from 'components/authentication/AccountSelectionDialog.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function returning an array of project member roles as select options.
 */
const roleOptions = useRoleOptions();

/**
 * A reactive variable that determines the visibility state of the account selection dialog.
 * When set to `true`, the dialog is visible. When set to `false`, the dialog is hidden.
 */
const accountSelectionDialogVisible = ref(false);
/**
 * A reactive variable that holds a reference to a function.
 * This function is expected to be triggered as a notification mechanism
 * whenever a new row is added to a specific data structure or component.
 */
const addRowNotify = ref<() => void>();

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: ProjectEditorData;
  // Height
  height: number;
  // Read-only flag
  readOnly?: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  (event: 'update:modelValue', value: ProjectEditorData | null | undefined): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

/**
 * Adds a new row by setting the notification callback and making the account selection dialog visible.
 *
 * @param {Function} notify - A callback function that will be invoked as a part of the row addition process.
 * @return {void} This method does not return a value.
 */
function addRow(notify: () => void): void {
  addRowNotify.value = notify;
  accountSelectionDialogVisible.value = true;
}

/**
 * Validates if a given document represents an account that can be added to a project.
 * Ensures the account is not the project owner, project manager, or an existing project member.
 *
 * @param {IDocument<IAccountData>} document - The account document to validate.
 * @return {string | null} Returns a validation error message as a string if the account
 *         is invalid, otherwise returns null indicating the account is valid.
 */
function validate(document: IDocument<IAccountData>): string | null {
  // Check if the account is the project owner
  if (document.id === _modelValue.value.projectOwner.id) {
    // Project owner account is not permitted
    return common.i18n.t('project.error.isProjectOwner');
  }
  // Check if the account is the project manager
  if (document.id === _modelValue.value.projectManager.id) {
    // Project manager account is not permitted
    return common.i18n.t('project.error.isProjectManager');
  }
  // Check if the account is already a project member
  if (_modelValue.value.data.members.some((member) => member.id === document.id)) {
    // Project member is already added and therefore not permitted
    return common.i18n.t('project.error.memberAlreadyAdded');
  }
  return null;
}

/**
 * Handles the event when an account is selected. Adds the selected account as a project member
 * and triggers a notification if applicable.
 *
 * @param {IDocument<IAccountData>} document - The document containing account details, including its ID and user data.
 * @return {void} This method does not return a value.
 */
function onAccountSelected(document: IDocument<IAccountData>): void {
  // Add project member
  _modelValue.value.data.members.push({
    role: EProjectRole.Visitor,
    id: document.id,
    name: document.data.user.name,
    picture: document.data.user.picture,
    description: null,
    active: true,
  });
  // Call the notifier function
  if (addRowNotify.value) {
    addRowNotify.value();
    addRowNotify.value = undefined;
  }
}
</script>
