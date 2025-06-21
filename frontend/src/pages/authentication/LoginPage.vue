<template>
  <!-- Page -->
  <q-page class="flex flex-center">
    <!-- Authentication Frame -->
    <authentication-frame :message="$t('authentication.message.login')"></authentication-frame>
  </q-page>
</template>

<script setup lang="ts">
import AuthenticationFrame from 'src/components/authentication/AuthenticationFrame.vue';
</script>
