<template>
  <!-- Main DIV -->
  <div class="q-col-gutter-y-lg">
    <!-- Cloud Service Provider Row -->
    <div class="row q-col-gutter-x-sm">
      <!-- Cloud Service Provider Column -->
      <div class="col-4">
        <!-- Cloud Service Provider Selection -->
        <select-value
          v-model="selectedProvider"
          :options="providerOptions()"
          :label="$t('cloudServiceProvider.label.provider')"
          :read-only="operation !== EDocumentOperation.create"
          @update:model-value="onProviderSelected"
        />
      </div>
    </div>
    <!-- Provider Component Row -->
    <div class="row q-col-gutter-x-sm">
      <!-- Provider Component Column -->
      <div class="col">
        <!-- Provider Component DIV -->
        <div class="q-col-gutter-y-sm">
          <!-- Amazon Web Service -->
          <cloud-service-provider-aws
            ref="awsProvider"
            v-if="_modelValue.data.provider === csp.ECloudServiceProvider.AWS"
            v-model="_modelValue"
          />
          <!-- Google Cloud Platform -->
          <cloud-service-provider-gcp
            ref="gcpProvider"
            v-if="_modelValue.data.provider === csp.ECloudServiceProvider.GCP"
            v-model="_modelValue"
          />
          <!-- Snowflake Database -->
          <cloud-service-provider-snowflake
            v-if="_modelValue.data.provider === csp.ECloudServiceProvider.Snowflake"
          />
        </div>
      </div>
    </div>
    <!-- Test Connection Row -->
    <div class="row q-col-gutter-x-sm">
      <!-- Test Connection Column -->
      <div class="col">
        <!-- Test Connection Button -->
        <button-label
          :label="$t('cloudServiceProvider.button.testConnection')"
          @click="testConnection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useProviderOptions } from 'src/scripts/composables/Options';
import { useCommonComposables, useRunFunction } from 'src/scripts/composables/Common';
import { useMessageDialog } from 'src/scripts/composables/Dialog';
import { EDocumentOperation } from 'src/scripts/documents/Document';
import * as csp from 'src/scripts/documents/model/CloudServiceProvider';
import SelectValue from 'components/common/SelectValue.vue';
import CloudServiceProviderGcp from 'components/cloudService/CloudServiceProviderGcp.vue';
import CloudServiceProviderAws from 'components/cloudService/CloudServiceProviderAws.vue';
import CloudServiceProviderSnowflake from 'components/cloudService/CloudServiceProviderSnowflake.vue';
import ButtonLabel from 'components/common/ButtonLabel.vue';

/**
 * Represents the details of a request to a cloud service provider (CSP).
 *
 * This type is used to structure the necessary information required
 * to make a request to a specific cloud service provider. It includes
 * the provider type and the credentials necessary for authentication.
 */
type TRequest = {
  provider: csp.ECloudServiceProvider;
  credentials: csp.TCredentials;
};

/**
 * Represents the result of an operation, providing status and an optional message.
 */
type TResult = {
  status: 'success' | 'error';
  message?: string;
};

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function returning the provider options.
 */
const providerOptions = useProviderOptions();
/**
 * Function for calling a backend function.
 */
const runFunction = useRunFunction();
/**
 * Function to show a message dialog.
 */
const messageDialog = useMessageDialog();

/**
 * A reactive reference to an instance of the Google Cloud Platform (GCP) service provider
 * component or null. This is used to manage and dynamically reference the state of the GCP service
 * provider component in the application.
 */
const gcpProvider = ref<InstanceType<typeof CloudServiceProviderGcp> | null>(null);
/**
 * Represents the AWS cloud service provider instance or a null reference.
 * This variable is used to store a reactive reference to an instance of
 * the `CloudServiceProviderAws` class or `null` if no instance is available.
 */
const awsProvider = ref<InstanceType<typeof CloudServiceProviderAws> | null>(null);

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: csp.CloudServiceProviderEditorData;
  // Document operation
  operation: EDocumentOperation;
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
 * A reactive reference to the currently selected cloud service provider.
 */
const selectedProvider = ref(props.modelValue.data.provider ?? csp.ECloudServiceProvider.AWS);

/**
 * Handles the selection of a cloud service provider and updates the corresponding model value
 * with default credentials and provider information.
 *
 * @return {void} Does not return a value.
 */
function onProviderSelected(): void {
  switch (selectedProvider.value) {
    // Amazon Web Services
    case csp.ECloudServiceProvider.AWS:
      _modelValue.value.data.credentials = {
        iamRoleARN: '',
        region: 'eu-central-1',
      } as csp.TCredentialsAWS;
      _modelValue.value.data.provider = csp.ECloudServiceProvider.AWS;
      break;
    // Google Cloud Platform
    case csp.ECloudServiceProvider.GCP:
      _modelValue.value.data.credentials = {
        serviceAccount: '',
      } as csp.TCredentialsGCP;
      _modelValue.value.data.provider = csp.ECloudServiceProvider.GCP;
      break;
    // Snowflake Database
    case csp.ECloudServiceProvider.Snowflake:
      _modelValue.value.data.credentials = {
        account: '',
        username: '',
        password: '',
      } as csp.TCredentialsSnowflake;
      _modelValue.value.data.provider = csp.ECloudServiceProvider.Snowflake;
      break;
  }
}

/**
 * Validates the current model value based on the provider type.
 *
 * @return {boolean} Returns true if the provider validation is successful; otherwise, false.
 */
function validate(): boolean {
  if (_modelValue.value.data.provider === csp.ECloudServiceProvider.AWS) {
    return awsProvider.value?.validate() ?? false;
  }
  if (_modelValue.value.data.provider === csp.ECloudServiceProvider.GCP) {
    return gcpProvider.value?.validate() ?? false;
  }
  return false;
}

/**
 * Tests the connection by validating the credentials and invoking a backend function to verify the
 * connection status. Displays a success or error dialog based on the test result.
 *
 * @return {Promise<void>} Resolves when the connection test is completed and the appropriate dialog is displayed.
 */
async function testConnection(): Promise<void> {
  // Validate credentials component
  if (validate()) {
    // Call the backend function to test the connection
    await runFunction<TRequest, TResult>(
      'testConnection',
      {
        provider: _modelValue.value.data.provider,
        credentials: _modelValue.value.data.credentials,
      },
      undefined,
      (result) => {
        // Check result
        if (result.status === 'success') {
          // Show success dialog
          messageDialog(
            'success',
            common.i18n.t('cloudServiceProvider.dialog.test.success.title'),
            common.i18n.t('cloudServiceProvider.dialog.test.success.message'),
          );
        } else {
          // Show error dialog
          messageDialog(
            'error',
            common.i18n.t('cloudServiceProvider.dialog.test.error.title'),
            common.i18n.t('cloudServiceProvider.dialog.test.error.message'),
            result.message,
          );
        }
      },
    );
  }
}
</script>
