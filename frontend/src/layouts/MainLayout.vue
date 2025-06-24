<template>
  <!-- Layout -->
  <q-layout view="hHh LpR fFf">
    <!-- Message Dialog -->
    <message-dialog v-model="messageDialogOptions.visibility" />
  </q-layout>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { messageDialogOptions } from 'src/scripts/composables/Dialog';
import MessageDialog from 'components/common/MessageDialog.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * Lifecycle method that is called before this component is mounted.
 */
onBeforeMount(() => {
  const provider = getDocumentProvider();
  provider.onAccountStateChanged((account) => {
    if (account === null) {
      common.router.push('/auth/login').catch((reason: any) => {
        throw new Error(`Failed to redirect to login page: ${reason}`);
      });
    } else {
      console.debug(account);
    }
  });
});
</script>
