<template>
  <!-- Message Row -->
  <div class="row">
    <!-- Message Column -->
    <div class="col">
      {{ $t('cloudServiceProvider.dialog.tab.selection.messageAws') }}
    </div>
  </div>
  <!-- IAM Role ARN Row -->
  <div class="row q-col-gutter-x-sm">
    <!-- IAM Role ARN Column -->
    <div class="col-4">
      <!-- IAM Role ARN Input -->
      <input-value
        v-model="(_modelValue.data.credentials as csp.TCredentialsAWS).iamRoleARN"
        :label="$t('cloudServiceProvider.label.iamRoleARN')"
        :error-message="iamRoleARNError"
        mandatory
        auto-focus
      />
    </div>
    <!-- Region Column -->
    <div class="col-4">
      <!-- Region Input -->
      <select-value
        v-model="(_modelValue.data.credentials as csp.TCredentialsAWS).region"
        label="Region"
        :options="awsRegions()"
        mandatory
      >
        <!-- Option Template -->
        <template v-slot:optionLabel="props">
          <div>{{ props.opt.label }}</div>
          <div class="text-small text-disabled">({{ props.opt.value }})</div>
        </template>
      </select-value>
    </div>
  </div>
  <!-- Application Account Message Row -->
  <div class="row q-col-gutter-x-sm">
    <!-- Application Account Message Column -->
    <div class="col">
      <!-- Application Account Message -->
      {{ $t('cloudServiceProvider.dialog.tab.selection.messageAwsAccountInfo') }}
    </div>
  </div>
  <!-- Application Account Info Row -->
  <div class="row q-col-gutter-x-sm">
    <!-- Account ID Column -->
    <div class="col-4">
      <!-- Account ID -->
      <input-value
        :model-value="providerConfig.awsAccountId"
        :label="$t('cloudServiceProvider.label.account')"
        read-only
        show-copy-button
      />
    </div>
    <!-- Role ARN Column -->
    <div class="col-4">
      <!-- Role ARN -->
      <input-value
        :model-value="providerConfig.awsRole"
        :label="$t('cloudServiceProvider.label.iamRoleARN')"
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
import { useAWSRegions } from 'src/scripts/composables/Options';
import * as csp from 'src/scripts/documents/model/CloudServiceProvider';
import InputValue from 'components/common/InputValue.vue';
import SelectValue from 'components/common/SelectValue.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function returning an array of AWS regions.
 */
const awsRegions = useAWSRegions();

/**
 * A reactive variable that holds the error message related to an IAM Role ARN.
 */
const iamRoleARNError = ref('');

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
 * Validates the IAM Role ARN credentials by checking if they are non-empty.
 * If the credentials are missing, it sets an error message.
 *
 * @return {boolean} Returns true if the IAM Role ARN credentials are valid (non-empty), otherwise false.
 */
function validate(): boolean {
  // Reset error messages
  iamRoleARNError.value = '';
  // Get role value
  const iamRoleARN =
    (_modelValue.value.data.credentials as csp.TCredentialsAWS).iamRoleARN?.trim() ?? '';
  // Check role
  if (iamRoleARN.length === 0) {
    // Role is empty
    iamRoleARNError.value = common.i18n.t('message.mandatory');
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
