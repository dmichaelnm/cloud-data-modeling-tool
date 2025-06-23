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
                auto-complete="new-password"
                type="password"
                mandatory
              />
            </div>
          </div>
          <!-- Register Button Row -->
          <div class="row">
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
import { useCommonComposables, useRunAsync } from 'src/scripts/composables/Common';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import AuthenticationFrame from 'components/authentication/AuthenticationFrame.vue';
import InputValue from 'components/common/InputValue.vue';
import ButtonLabel from 'components/common/ButtonLabel.vue';
import ButtonGoogle from 'components/authentication/ButtonGoogle.vue';

const common = useCommonComposables();
const runAsync = useRunAsync();

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

function register(): void {
  runAsync(async () => {
    const documentProvider = getDocumentProvider();
    await documentProvider.registerAccountWithEmailAndPassword(
      `${firstname.value} ${lastname.value}`,
      email.value,
      password.value,
      common.i18n.locale.value,
      common.quasar.dark.isActive ? 'dark' : 'light',
    );
  });
}

function registerGoogle(): void {
  runAsync(async () => {
    const documentProvider = getDocumentProvider();
    await documentProvider.registerAccountWithGoogle(
      common.i18n.locale.value,
      common.quasar.dark.isActive ? 'dark' : 'light',
    );
  });
}
</script>
