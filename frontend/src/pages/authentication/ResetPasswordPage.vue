<template>
  <!-- Page -->
  <q-page class="flex flex-center">
    <!-- Authentication Frame -->
    <authentication-frame :message="$t('authentication.message.reset')">
      <!-- Form -->
      <q-form @submit="reset">
        <!-- Form DIV -->
        <div class="q-col-gutter-y-sm">
          <!-- Email Row -->
          <div class="row">
            <!-- Email Column -->
            <div class="col">
              <!-- Email Input -->
              <input-value
                v-model="email"
                :label="$t('label.email')"
                :error-message="emailError"
                type="password"
                mandatory
                auto-focus
              />
            </div>
          </div>
          <!-- Reset Button Row -->
          <div class="row">
            <!-- Reset Button Column -->
            <div class="col text-center">
              <!-- Reset Button -->
              <button-label
                :label="$t('authentication.button.resetPassword')"
                style="width: 230px"
                type="submit"
              />
            </div>
          </div>
          <!-- Back Link Row -->
          <div class="row">
            <!-- Back Link Column -->
            <div class="col text-center">
              <!-- Back Link -->
              <button-label :label="$t('button.back')" appearance="link" to="/auth/login" />
            </div>
          </div>
        </div>
      </q-form>
    </authentication-frame>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useMessageDialog } from 'src/scripts/composables/Dialog';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import * as cm from 'src/scripts/composables/Common';
import AuthenticationFrame from 'components/authentication/AuthenticationFrame.vue';
import InputValue from 'components/common/InputValue.vue';
import ButtonLabel from 'components/common/ButtonLabel.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = cm.useCommonComposables();
/**
 * Function for executing asynchronous tasks.
 */
const runAsync = cm.useRunAsync();
/**
 * Function to determine error codes from error instances of an unknown type.
 */
const determineErrorCode = cm.useDetermineErrorCode();
/**
 * Function to show a message dialog.
 */
const messageDialog = useMessageDialog();

/**
 * A reactive variable that holds the value of the user's email address.
 */
const email = ref('');
/**
 * A reactive reference variable representing the error message associated with email validation.
 */
const emailError = ref('');

/**
 * Lifecycle method that is called before this component is mounted.
 */
onBeforeMount(() => {
  email.value = common.quasar.cookies.get('email') ?? '';
});

/**
 * Initiates a password reset process by sending a request to the document provider and handling the result.
 *
 * @return {void} This method does not return any value.
 */
function reset(): void {
  // Reset errors
  resetError();
  // Start the reset password request task
  runAsync(
    // Perform the reset password request task
    async () => {
      // Get document provider
      const provider = getDocumentProvider();
      // Send password reset request
      await provider.resetPassword(email.value);
    },
    // Process error
    (error: unknown) => processError(error),
    // Process result
    () => {
      // Set email cookie
      common.quasar.cookies.set('email', email.value, { expires: 28 });
      // Show success dialog
      messageDialog(
        'success',
        common.i18n.t('authentication.dialog.reset.success.title'),
        common.i18n.t('authentication.dialog.reset.success.message'),
        undefined,
        async () => {
          await common.router.push('/auth/login');
        },
      );
    },
  );
}

/**
 * Processes an error and determines if it corresponds to a specific condition.
 *
 * @param {unknown} error - The error object or value to process.
 * @return {boolean} Returns true if the error matches the 'auth/invalid-email' condition, otherwise false.
 */
function processError(error: unknown): boolean {
  const code = determineErrorCode(error);
  if (code === 'auth/invalid-email') {
    emailError.value = common.i18n.t('authentication.error.invalidEmail');
    return true;
  }
  return false;
}

/**
 * Resets the error state associated with an email input by clearing its value.
 *
 * @return {void} This function does not return any value.
 */
function resetError(): void {
  emailError.value = '';
}
</script>
