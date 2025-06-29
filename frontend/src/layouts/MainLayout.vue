<template>
  <!-- Layout -->
  <q-layout view="hHh LpR fFf">
    <!-- Message Dialog -->
    <message-dialog v-model="messageDialogOptions.visibility" />
    <!-- Header -->
    <q-header>
      <!-- Header Toolbar -->
      <header-toolbar />
    </q-header>
    <!-- Footer -->
    <q-footer>
      <!-- Footer Line -->
      <footer-line />
    </q-footer>
  </q-layout>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import { useCommonComposables, useRunAsync } from 'src/scripts/composables/Common';
import { messageDialogOptions } from 'src/scripts/composables/Dialog';
import MessageDialog from 'components/common/MessageDialog.vue';
import HeaderToolbar from 'components/main/HeaderToolbar.vue';
import FooterLine from 'components/main/FooterLine.vue';
import { Project } from 'src/scripts/documents/model/Project';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function for executing asynchronous tasks.
 */
const runAsync = useRunAsync();

/**
 * Lifecycle method that is called before this component is mounted.
 */
onBeforeMount(() => {
  common.quasar.loading.show();

  const provider = getDocumentProvider();
  provider.onAccountStateChanged((account) => {
    if (account === null) {
      // Get the source path
      let path = common.router.currentRoute.value.path;
      // Keep the source path when an account was registered, otherwise redirect to the login page
      path = path === '/auth/register' ? path : '/auth/login';
      common.router.push(path).catch((reason: any) => {
        throw new Error(`Failed to redirect to login page: ${reason}`);
      });
    } else {
      runAsync(async () => {
        // Store the account on the session
        common.session.account = account;
        // Apply theme and language
        common.i18n.locale.value = account.document.data.preferences.language;
        common.quasar.dark.set(account.document.data.preferences.theme === 'dark');
        // Load all projects of the current user
        common.session.projects = await Project.loadProjects();
        console.debug(common.session.projects);
      }).catch((reason: any) => {
        console.error(reason);
      });
    }
    common.quasar.loading.hide();
  });
});
</script>
