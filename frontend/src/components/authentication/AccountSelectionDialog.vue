<template>
  <!-- Application Dialog -->
  <application-dialog
    :model-value="_modelValue"
    :title="$t('authentication.dialog.selection.title')"
    :message="$t('authentication.dialog.selection.message')"
    :buttons="[
      { value: 'ok', label: $t('button.ok'), appearance: 'push', submit: true },
      { value: 'cancel', label: $t('button.cancel'), appearance: 'link' },
    ]"
    :submit-handler="performSearch"
    @initialize="initDialog"
    @update:model-value="(val) => (_modelValue = val)"
  >
    <!-- Email Address DIV -->
    <div>
      <!-- Email Address Input -->
      <input-value
        v-model="email"
        :label="$t('label.email')"
        :error-message="emailError"
        mandatory
        auto-focus
      >
        <!-- Append Template -->
        <template v-slot:append>
          <!-- Apply Self Button -->
          <q-btn flat round dense @click="applySelf">
            <!-- Account Profile Picture -->
            <account-profile v-model="common.session.accountDocument" />
          </q-btn>
        </template>
      </input-value>
    </div>
  </application-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCommonComposables, useRunAsync } from 'src/scripts/composables/Common';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import { IAccountData } from 'src/scripts/documents/model/Account';
import { EDocumentType, IDocument } from 'src/scripts/documents/Document';
import { DocumentError } from 'src/scripts/documents/DocumentError';
import ApplicationDialog from 'components/common/ApplicationDialog.vue';
import InputValue from 'components/common/InputValue.vue';
import AccountProfile from 'components/authentication/AccountProfile.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function for executing asynchronous tasks.
 */
const runAsync = useRunAsync();

/**
 * A reactive variable that holds the value of the user's email address.
 */
const email = ref('');
/**
 * A reactive reference variable representing the error message associated with email validation.
 */
const emailError = ref('');

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: boolean;
  // Validation handler
  validationHandler?:
    | ((document: IDocument<IAccountData>, scope: string | undefined) => string | null)
    | undefined;
  // Optional scope parameter to identify different callers
  scope?: string | undefined;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Model update event
  (event: 'update:modelValue', value: boolean): void;
  // Account selection event
  (event: 'accountSelected', document: IDocument<IAccountData>): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

/**
 * Initializes the dialog by resetting the email input field value.
 *
 * @return {void} This method does not return a value.
 */
function initDialog(): void {
  email.value = '';
}

/**
 * Updates the email input field's value with the user's email address
 * retrieved from the session's accountDocument. If the email address
 * is unavailable, the field is set to an empty string.
 *
 * @return {void} This method does not return a value.
 */
function applySelf(): void {
  email.value = common.session.accountDocument?.data.user.email ?? '';
}

/**
 * Performs a search for account documents based on the provided email address.
 * Validates the result and emits an event if a suitable account document is found.
 * Handles error states and updates the email error message as necessary.
 *
 * @return {Promise<boolean>} A promise that resolves to true if the search and validation are successful,
 *                            or false if the validation fails or no document is found.
 */
async function performSearch(): Promise<boolean> {
  // Reset email error
  emailError.value = '';
  // Start the searching process
  return (
    (await runAsync<boolean>(async () => {
      // Get document provider
      const provider = getDocumentProvider();
      // Find account documents with the given email address
      const documents = await provider.findDocuments<IAccountData>(
        EDocumentType.Account,
        undefined,
        {
          attribute: 'user.email',
          operation: '==',
          value: email.value,
        },
      );
      // Check the result
      if (documents.length === 0) {
        // No document found, entered email address is invalid
        emailError.value = common.i18n.t('authentication.error.unknownEmail');
        return false;
      } else if (documents.length === 1 && documents[0]) {
        // Exact one document found, validate document
        const result = props.validationHandler?.(documents[0], props.scope) ?? null;
        if (result != null) {
          // Validation failed
          emailError.value = result;
          return false;
        }
        // Emit event
        emits('accountSelected', documents[0]);
        return true;
      } else {
        // More than one document found, this is unexpected behavior
        throw new DocumentError(
          'unexpected',
          'Multiple account documents found for the given email address.',
        );
      }
    })) ?? false
  );
}
</script>
