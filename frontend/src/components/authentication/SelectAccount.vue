<template>
  <!-- Account Selection Dialog -->
  <account-selection-dialog
    v-model="dialogVisible"
    :scope="scope"
    :validation-handler="validationHandler"
    @account-selected="(val) => (_modelValue = val)"
  />
  <!-- Account Selection Field -->
  <q-field :label="label" :readonly="readOnly" outlined dense stack-label>
    <!-- Account Picture Template -->
    <template v-slot:prepend v-if="_modelValue">
      <!-- Account Profile Avatar -->
      <account-profile v-model="_modelValue" />
    </template>
    <!-- Account Name Template -->
    <template v-slot:control>
      {{ _modelValue ? _modelValue.data.user.name : '' }}
    </template>
    <!-- Search Account Template -->
    <template v-slot:append v-if="!readOnly">
      <q-btn round flat dense icon="person_search" @click="dialogVisible = true" />
    </template>
  </q-field>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IDocument } from 'src/scripts/documents/Document';
import { IAccountData } from 'src/scripts/documents/model/Account';
import AccountSelectionDialog from 'components/authentication/AccountSelectionDialog.vue';
import AccountProfile from 'components/authentication/AccountProfile.vue';

/**
 * A reactive variable that tracks the visibility state of the account selection dialog.
 */
const dialogVisible = ref(false);

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model Value
  modelValue: IDocument<IAccountData> | null;
  // Label of the account selection component
  label?: string;
  // Scope of the account selection component
  scope?: string;
  // Validation handler
  validationHandler?: (
    document: IDocument<IAccountData>,
    scope: string | undefined,
  ) => string | null;
  // Read-only Flag
  readOnly?: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  (event: 'update:modelValue', value: IDocument<IAccountData> | null): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});
</script>
