<template>
  <!-- Page -->
  <q-page class="flex flex-center">
    <!-- Authentication Frame -->
    <authentication-frame :message="$t('authentication.message.login')">
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
          <div class="row">
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
import { useCommonComposables } from 'src/scripts/composables/Common';
import AuthenticationFrame from 'src/components/authentication/AuthenticationFrame.vue';
import InputValue from 'components/common/InputValue.vue';
import ButtonLabel from 'components/common/ButtonLabel.vue';
import ButtonGoogle from 'components/authentication/ButtonGoogle.vue';

const common = useCommonComposables();

const email = ref('');
const password = ref('');

/**
 * Lifecycle method that is called before this component is mounted.
 */
onBeforeMount(() => {
  email.value = common.quasar.cookies.get('email') ?? '';
});

function login(): void {}

function loginGoogle(): void {}
</script>
