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
              <button-label :label="$t('authentication.button.login')" type="submit" />
            </div>
          </div>
          <!-- Additional Links Row -->
          <div class="row">
            <!-- Register Account Column -->
            <div class="col">
              <!-- Register Account Button -->
              <button-label :label="$t('authentication.button.register')" appearance="link" />
            </div>
            <!-- Reset Password Column -->
            <div class="col text-right">
              <!-- Reset Password Button -->
              <button-label :label="$t('authentication.button.resetPassword')" appearance="link" />
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

const common = useCommonComposables();

const email = ref('');
const password = ref('');

onBeforeMount(() => {
  email.value = common.quasar.cookies.get('email') ?? '';
});

function login(): void {
  console.debug('login');
}
</script>
