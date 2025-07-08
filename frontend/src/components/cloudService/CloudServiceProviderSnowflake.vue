<template>
  <!-- Message Row -->
  <div class="row">
    <!-- Message Column -->
    <div class="col">
      {{ $t('cloudServiceProvider.dialog.tab.selection.messageSnowflake') }}
    </div>
  </div>
  <!-- Account / Username Row -->
  <div class="row q-col-gutter-x-sm">
    <!-- Account Column -->
    <div class="col-4">
      <!-- Account Input -->
      <input-value
        v-model="(_modelValue.data.credentials as csp.TCredentialsSnowflake).account"
        :label="$t('cloudServiceProvider.label.account')"
        :error-message="accountError"
        :read-only="readOnly"
        mandatory
      />
    </div>
    <!-- Username Column -->
    <div class="col-4">
      <!-- Username Input -->
      <input-value
        v-model="(_modelValue.data.credentials as csp.TCredentialsSnowflake).username"
        :label="$t('cloudServiceProvider.label.username')"
        :error-message="usernameError"
        :read-only="readOnly"
        mandatory
        upper-case
      />
    </div>
  </div>
  <!-- Application Account Message Row -->
  <div class="row q-col-gutter-x-sm" v-if="!readOnly">
    <!-- Application Account Message Column -->
    <div class="col">
      <!-- Application Account Message -->
      {{ $t('cloudServiceProvider.dialog.tab.selection.messageSnowflakeAccountInfo') }}
    </div>
  </div>
  <!-- Application Account Info Row -->
  <div class="row q-col-gutter-x-sm" v-if="!readOnly">
    <!-- Public Key Column -->
    <div class="col-4">
      <!-- Public Key -->
      <input-value
        :model-value="publicKey"
        :rows="8"
        hide-bottom-space
        read-only
        show-copy-button
        type="textarea"
        class="text-monospace"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonComposables, useRunFunction } from 'src/scripts/composables/Common';
import { computed, onBeforeMount, ref } from 'vue';
import * as csp from 'src/scripts/documents/model/CloudServiceProvider';
import InputValue from 'components/common/InputValue.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function for calling a backend function.
 */
const runFunction = useRunFunction();

/**
 * Represents the public key used for cryptographic operations, authorization,
 * or identification purposes.
 */
const publicKey = ref<string | null>(null);
/**
 * A reactive variable to store the account error message.
 */
const accountError = ref('');
/**
 * A reactive variable to store the username error message.
 */
const usernameError = ref('');

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: csp.CloudServiceProviderEditorData;
  // Read-only flag
  readOnly?: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Update model value
  (event: 'update:modelValue', value: csp.CloudServiceProviderEditorData): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

/**
 * Lifecycle method that is called before this component is mounted.
 */
onBeforeMount(async () => {
  if (!props.readOnly) {
    await loadProjectPublicKey();
  }
});

/**
 * Asynchronously loads the public key for the currently active project
 * and assigns it to the `publicKey.value`.
 *
 * @return {Promise<void>} A promise that resolves when the public key is successfully loaded and assigned.
 */
async function loadProjectPublicKey(): Promise<void> {
  // Get the public key from the backend
  publicKey.value = (await runFunction<{ projectId: string }, string>('getProjectPublicKey', {
    projectId: common.session.activeProject as string,
  })) as string;
  // Remove Prefix
  publicKey.value = publicKey.value.replace('-----BEGIN PUBLIC KEY-----\n', '');
  // Remove Suffix
  publicKey.value = publicKey.value.replace('-----END PUBLIC KEY-----\n', '');
  // Remove all line breaks
  publicKey.value = publicKey.value.replace(/\n/g, '');
}

/**
 * Validates the account and username by checking if they are non-empty.
 *
 * @return {boolean} Returns true if the service account credentials are valid (non-empty), otherwise false.
 */
function validate(): boolean {
  // Reset error messages
  accountError.value = '';
  usernameError.value = '';
  // Get account value
  const account = (_modelValue.value.data.credentials as csp.TCredentialsSnowflake).account?.trim();
  // Check account
  if (account?.length === 0) {
    // Account is empty
    accountError.value = common.i18n.t('message.mandatory');
    return false;
  }
  // Get username value
  const username = (
    _modelValue.value.data.credentials as csp.TCredentialsSnowflake
  ).username?.trim();
  // Check username
  if (username?.length === 0) {
    // Username is empty
    usernameError.value = common.i18n.t('message.mandatory');
    return false;
  }
  // Is okay
  return true;
}

/**
 * Defines the exposed methods of this component.
 */
defineExpose({ validate: validate });
</script>
