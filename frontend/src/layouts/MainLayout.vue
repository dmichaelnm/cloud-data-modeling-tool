<template>
  <!-- Layout -->
  <q-layout view="hHh LpR fFf"></q-layout>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import { useCommonComposables } from 'src/scripts/composables/Common';

const common = useCommonComposables();

onBeforeMount(() => {
  const provider = getDocumentProvider();
  provider.onAccountStateChanged((account) => {
    if (account === null) {
      common.router.push('/auth/login').catch((reason: any) => {
        throw new Error(`Failed to redirect to login page: ${reason}`);
      });
    }
  });
});
</script>
