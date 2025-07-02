<template>
  <!-- Page -->
  <q-page class="flex flex-center">
    <!-- Authentication Frame -->
    <authentication-frame :message="$t('authentication.message.register')">
      <!-- Form -->
      <q-form @submit="register">
        <!-- Form DIV -->
        <div class="q-col-gutter-y-sm">
          <!-- First Name / Last Name Row -->
          <div class="row q-col-gutter-x-sm">
            <!-- First Name Column -->
            <div class="col">
              <!-- First Name Input -->
              <input-value
                v-model="firstname"
                :label="$t('label.firstname')"
                mandatory
                auto-focus
              />
            </div>
            <!-- Last Name Column -->
            <div class="col">
              <!-- Last Name Input -->
              <input-value v-model="lastname" :label="$t('label.lastname')" mandatory />
            </div>
          </div>
          <!-- Email Row -->
          <div class="row">
            <!-- Email Column -->
            <div class="col">
              <!-- Email Input -->
              <input-value
                v-model="email"
                :label="$t('label.email')"
                :error-message="emailError"
                auto-complete="username"
                mandatory
              />
            </div>
          </div>
          <!-- Password / Confirm Password Row -->
          <div class="row q-col-gutter-x-sm">
            <!-- Password Column -->
            <div class="col">
              <!-- Password Input -->
              <input-value
                v-model="password"
                :label="$t('label.password')"
                :error-message="passwordError"
                auto-complete="new-password"
                type="password"
                mandatory
              />
            </div>
            <!-- Confirm Password Column -->
            <div class="col">
              <!-- Confirm Password Input -->
              <input-value
                v-model="confirmPassword"
                :label="$t('label.passwordConfirm')"
                :error-message="confirmPasswordError"
                auto-complete="new-password"
                type="password"
                mandatory
              />
            </div>
          </div>
          <!-- Register Button Row -->
          <div class="row" style="margin-top: 12px">
            <!-- Register Button Column -->
            <div class="col text-center">
              <!-- Register Button -->
              <button-label
                :label="$t('authentication.button.register')"
                type="submit"
                style="width: 230px"
              />
            </div>
          </div>
          <!-- Register Google Row -->
          <div class="row">
            <!-- Register Google Column -->
            <div class="col text-center">
              <!-- Register Google Button -->
              <button-google
                :label="$t('authentication.button.registerGoogle')"
                @click="registerGoogle"
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
import { ref } from 'vue';
import { useMessageDialog } from 'src/scripts/composables/Dialog';
import * as cm from 'src/scripts/composables/Common';
import * as dp from 'src/scripts/documents/DocumentProvider';
import AuthenticationFrame from 'components/authentication/AuthenticationFrame.vue';
import InputValue from 'components/common/InputValue.vue';
import ButtonLabel from 'components/common/ButtonLabel.vue';
import ButtonGoogle from 'components/authentication/ButtonGoogle.vue';

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
 * A reactive variable that holds the value of the user's first name.
 */
const firstname = ref('');
/**
 * A reactive variable that holds the value of the user's last name.
 */
const lastname = ref('');
/**
 * A reactive variable that holds the value of the user's email address.
 */
const email = ref('');
/**
 * A reactive reference variable representing the error message associated with email validation.
 */
const emailError = ref('');
/**
 * A reactive variable that holds the value of the user's chosen password.
 */
const password = ref('');
/**
 * A reactive reference variable representing the error message associated with password validation.
 */
const passwordError = ref('');
/**
 * A reactive variable that holds the value of the user's password confirmation.
 */
const confirmPassword = ref('');
/**
 * A reactive reference variable representing the error message associated with password confirmation.
 */
const confirmPasswordError = ref('');

/**
 * Handles the user registration process, including validation of password confirmation,
 * registration with the document provider, and error handling.
 *
 * @return {Promise<void>} A promise that resolves when the registration process completes,
 * or rejects if an error occurs during the process.
 */
async function register(): Promise<void> {
  // Reset all former error messages
  resetError();
  // Check the password confirmation
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = common.i18n.t('authentication.error.passwordConfirmationFailed');
    return;
  }
  // Starts the registration process
  await runAsync<dp.TAccountRegisterResult>(
    // Perform the registration process
    async () => {
      // Get document provider
      const documentProvider = dp.getDocumentProvider();
      // Register the account
      return await documentProvider.registerAccountWithEmailAndPassword(
        `${firstname.value} ${lastname.value}`,
        email.value,
        password.value,
        common.i18n.locale.value,
        common.quasar.dark.isActive ? 'dark' : 'light',
      );
    },
    // Process errors
    (error: unknown) => processError(error),
    // Process result
    (result: dp.TAccountRegisterResult) => processSuccess(result),
  );
}

/**
 * Initiates the user registration process using Google credentials.
 * This function resets previous errors, starts the registration flow, and handles the success or failure of the operation.
 *
 * @return {Promise<void>} A promise that resolves when the registration process is completed.
 */
async function registerGoogle(): Promise<void> {
  // Reset error messages
  resetError();
  // Start the registration process
  await runAsync<dp.TAccountRegisterResult>(
    // Perform the registration process
    async () => {
      // Get document provider
      const documentProvider = dp.getDocumentProvider();
      // Register the account
      return await documentProvider.registerAccountWithGoogle(
        common.i18n.locale.value,
        common.quasar.dark.isActive ? 'dark' : 'light',
      );
    },
    // Process error
    (error: unknown) => processError(error),
    // Process result
    (result: dp.TAccountRegisterResult) => processSuccess(result),
  );
}

/**
 * Handles the processing of successful account registration or login action.
 * Updates the email cookie and displays an appropriate message dialog based on the account creation status.
 *
 * @param {unknown} result - The result of the account registration or login process. This is expected to be an object
 *                           conforming to the structure of `dp.TAccountRegisterResult`.
 * @return {void} No return value.
 */
function processSuccess(result: dp.TAccountRegisterResult): void {
  if (result) {
    // Update the email cookie with the current email address
    common.quasar.cookies.set('email', result.account.document.data.user.email, {
      expires: 28,
    });
    if (result.created) {
      // Show success dialog
      messageDialog(
        'success',
        common.i18n.t('authentication.dialog.register.success.title'),
        common.i18n.t('authentication.dialog.register.success.message'),
        undefined,
        async () => {
          // Redirect to the login page
          await common.router.push('/auth/login');
        },
      );
    } else {
      // Show success dialog
      messageDialog(
        'warning',
        common.i18n.t('authentication.dialog.register.exists.title'),
        common.i18n.t('authentication.dialog.register.exists.message'),
        undefined,
        async () => {
          // Redirect to the login page
          await common.router.push('/auth/login');
        },
      );
    }
  }
}

/**
 * Processes an error object, identifies the error type, and assigns a corresponding error
 * message to the appropriate field. Returns a boolean indicating whether the error was
 * successfully processed.
 *
 * @param {unknown} error - The error object to be processed, which may contain information
 *                          about the specific error type.
 * @return {boolean} Returns true if the error was recognized and processed, otherwise false.
 */
function processError(error: unknown): boolean {
  const code = determineErrorCode(error);
  if (code === 'auth/invalid-email') {
    emailError.value = common.i18n.t('authentication.error.invalidEmail');
    return true;
  }
  if (code === 'auth/password-does-not-meet-requirements') {
    passwordError.value = common.i18n.t('authentication.error.invalidPassword');
    return true;
  }
  if (code === 'auth/email-already-in-use') {
    emailError.value = common.i18n.t('authentication.error.emailAlreadyInUse');
    return true;
  }
  if (code === 'auth/popup-closed-by-user') {
    messageDialog(
      'warning',
      common.i18n.t('authentication.dialog.register.aborted.title'),
      common.i18n.t('authentication.dialog.register.aborted.message'),
    );
    return true;
  }
  return false;
}

/**
 * Resets the error messages for email, password, and confirm password fields
 * by clearing their respective values.
 *
 * @return {void} This method does not return a value.
 */
function resetError(): void {
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
}
</script>
