<template>
  <!-- Message Row -->
  <div class="row">
    <!-- Message Column -->
    <div class="col">
      {{ $t('cloudServiceProvider.dialog.tab.selection.messageGcp') }}
    </div>
  </div>
  <!-- Service Account Row -->
  <div class="row q-col-gutter-x-sm">
    <!-- Service Account Column -->
    <div class="col-4">
      <!-- Service Account Input -->
      <input-value
        v-model="(_modelValue.data.credentials as csp.TCredentialsGCP).serviceAccount"
        :label="$t('cloudServiceProvider.label.serviceAccount')"
        :error-message="serviceAccountError"
        mandatory
        auto-focus
      />
    </div>
  </div>
  <!-- Application Account Message Row -->
  <div class="row q-col-gutter-x-sm">
    <!-- Application Account Message Column -->
    <div class="col">
      <!-- Application Account Message -->
      {{ $t('cloudServiceProvider.dialog.tab.selection.messageGcpAccountInfo') }}
    </div>
  </div>
  <!-- Application Account Info Row -->
  <div class="row q-col-gutter-x-sm">
    <!-- Service Account Column -->
    <div class="col-4">
      <!-- Service Account -->
      <input-value
        :model-value="providerConfig.gcpServiceAccount"
        :label="$t('cloudServiceProvider.label.serviceAccount')"
        read-only
        show-copy-button
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { providerConfig } from 'src/scripts/config/ProviderConfig';
import { useCommonComposables } from 'src/scripts/composables/Common';
import * as csp from 'src/scripts/documents/model/CloudServiceProvider';
import InputValue from 'components/common/InputValue.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * A reactive variable that holds the error message related to a service account.
 */
const serviceAccountError = ref('');

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: csp.CloudServiceProviderEditorData;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Model value update
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
 * Validates the service account credentials by checking if they are non-empty.
 * If the credentials are missing, it sets an error message.
 *
 * @return {boolean} Returns true if the service account credentials are valid (non-empty), otherwise false.
 */
function validate(): boolean {
  // Reset error message
  serviceAccountError.value = '';
  // Get service account value
  const serviceAccount = (
    _modelValue.value.data.credentials as csp.TCredentialsGCP
  ).serviceAccount?.trim();
  // Check service account
  if (serviceAccount?.length > 0) {
    // Is okay
    return true;
  }
  // Service account is empty
  serviceAccountError.value = common.i18n.t('message.mandatory');
  return false;
}

/**
 * Defines the exposed methods of this component.
 */
defineExpose({ validate: validate });
</script>
