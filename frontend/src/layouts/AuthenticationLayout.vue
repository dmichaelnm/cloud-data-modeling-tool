<template>
  <!-- Layout -->
  <q-layout view="hHh LpR fFf">
    <!-- Message Dialog -->
    <message-dialog v-model="messageDialogOptions.visibility" />

    <!-- Page Container -->
    <q-page-container>
      <!-- Router View -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { messageDialogOptions } from 'src/scripts/composables/Dialog';
import MessageDialog from 'components/common/MessageDialog.vue';
</script>
