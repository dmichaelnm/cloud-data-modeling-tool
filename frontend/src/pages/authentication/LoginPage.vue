<template>
  <!-- Page -->
  <q-page class="flex flex-center">
    <!-- Authentication Frame -->
    <authentication-frame :message="$t('authentication.message.login')" :message-height="130">
      <!-- Form -->
      <q-form @submit="login">
        <!-- Form DIV -->
        <div class="q-col-gutter-y-sm">
          <!-- Email / Password Row -->
          <div class="row q-col-gutter-x-sm">
            <!-- Email Column -->
            <div class="col">
              <!-- Email Input -->
              <input-value
                v-model="email"
                :label="$t('label.email')"
                :auto-focus="email === ''"
                :error-message="emailError"
                auto-complete="username"
                mandatory
              />
            </div>
            <!-- Password Column -->
            <div class="col">
              <!-- Password Input -->
              <input-value
                v-model="password"
                :label="$t('label.password')"
                :auto-focus="email !== ''"
                auto-complete="current-password"
                type="password"
                mandatory
              />
            </div>
          </div>
          <!-- Login Button Row -->
          <div class="row" style="margin-top: 12px">
            <!-- Login Button Column -->
            <div class="col text-center">
              <!-- Login Button -->
              <button-label
                :label="$t('authentication.button.login')"
                type="submit"
                style="width: 230px"
              />
            </div>
          </div>
          <!-- Login Google Row -->
          <div class="row">
            <!-- Login Google Column -->
            <div class="col text-center">
              <!-- Login Google Button -->
              <button-google
                :label="$t('authentication.button.loginGoogle')"
                @click="loginGoogle"
              />
            </div>
          </div>
          <!-- Additional Links Row -->
          <div class="row">
            <!-- Register Account Column -->
            <div class="col">
              <!-- Register Account Button -->
              <button-label
                :label="$t('authentication.button.register')"
                appearance="link"
                to="/auth/register"
              />
            </div>
            <!-- Reset Password Column -->
            <div class="col text-right">
              <!-- Reset Password Button -->
              <button-label
                :label="$t('authentication.button.resetPassword')"
                appearance="link"
                to="/auth/reset"
              />
            </div>
          </div>
        </div>
      </q-form>
    </authentication-frame>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import { useMessageDialog } from 'src/scripts/composables/Dialog';
import * as cm from 'src/scripts/composables/Common';
import AuthenticationFrame from 'src/components/authentication/AuthenticationFrame.vue';
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
 * A reactive variable that holds the value of the user's email address.
 */
const email = ref('');
/**
 * A reactive reference variable representing the error message associated with email validation.
 */
const emailError = ref('');
/**
 * A reactive variable that holds the value of the user's password.
 */
const password = ref('');

/**
 * Lifecycle method that is called before this component is mounted.
 */
onBeforeMount(() => {
  // Set email address from cookie
  email.value = common.quasar.cookies.get('email') ?? '';
});

/**
 * Handles the user login process by performing asynchronous operations such as
 * authentication and error/success handling.
 *
 * This method resets any existing error messages, performs the login operation
 * with the provided email and password, and processes the result based on whether
 * the login was successful or not.
 *
 * @return {Promise<void>} A promise that resolves when the login process is complete.
 */
async function login(): Promise<void> {
  // Reset error messages
  resetError();
  // Start the login task
  await runAsync<string>(
    // Perform login task
    async () => {
      // Get document provider
      const provider = getDocumentProvider();
      // Login in with email and password
      await provider.loginWithEmailAndPassword(email.value, password.value);
      // Return email address
      return email.value;
    },
    // Process error
    (error: unknown) => processError(error),
    // Process success
    async (result: string) => await processSuccess(result),
  );
}

/**
 * Initiates the login process using Google as the authentication provider.
 * Handles success and error scenarios through the `runAsync` method.
 *
 * @return {Promise<void>} A promise that resolves when the Google login process is completed.
 */
async function loginGoogle(): Promise<void> {
  // Reset error messages
  resetError();
  // Start the login task
  await runAsync<string>(
    // Perform login task
    async () => {
      // Get document provider
      const provider = getDocumentProvider();
      // Login in with Google
      return await provider.loginWithGoogle();
    },
    // Process error
    (error: unknown) => processError(error),
    // Process success
    (result: string) => processSuccess(result),
  );
}

/**
 * Processes a successful login by setting an email cookie and redirecting to the main page.
 *
 * @param {string} email - The email address to be stored in the cookie.
 * @return {Promise<void>} A promise that resolves when the operation is complete.
 */
async function processSuccess(email: string): Promise<void> {
  // Set email cookie
  common.quasar.cookies.set('email', email, { expires: 28 });
  // Redirect to the main page
  await common.router.push('/');
}

/**
 * Processes the given error to determine its type and handles it accordingly by updating error messages or
 * displaying dialogs.
 *
 * @param {unknown} error The error object or value to be processed.
 * @return {boolean} Returns true if the error was successfully processed and handled; otherwise, returns false.
 */
function processError(error: unknown): boolean {
  const code = determineErrorCode(error);
  if (code === 'auth/invalid-email') {
    emailError.value = common.i18n.t('authentication.error.invalidEmail');
    return true;
  }
  if (code === 'auth/invalid-credential') {
    emailError.value = common.i18n.t('authentication.error.invalidCredentials');
    return true;
  }
  if (code === 'auth/account-not-active') {
    emailError.value = common.i18n.t('authentication.error.accountLocked');
    return true;
  }
  if (code === 'auth/too-many-requests') {
    emailError.value = common.i18n.t('authentication.error.tooManyRequests');
    return true;
  }
  if (code === 'auth/no-account-document') {
    messageDialog(
      'error',
      common.i18n.t('authentication.dialog.login.unknown.title'),
      common.i18n.t('authentication.dialog.login.unknown.message'),
    );
    return true;
  }
  if (code === 'auth/popup-closed-by-user') {
    messageDialog(
      'warning',
      common.i18n.t('authentication.dialog.login.aborted.title'),
      common.i18n.t('authentication.dialog.login.aborted.message'),
    );
    return true;
  }
  return false;
}

/**
 * Resets the error message for an email field by clearing its value.
 *
 * @return {void} This method does not return a value.
 */
function resetError(): void {
  emailError.value = '';
}
</script>
