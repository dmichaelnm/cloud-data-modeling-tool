<template>
  <!-- Layout -->
  <q-layout view="hHh LpR fFf">
    <!-- Message Dialog -->
    <message-dialog v-model="messageDialogOptions.visibility" />
    <!-- Header -->
    <q-header>
      <!-- Header Toolbar -->
      <header-toolbar @project-selected="switchProject" />
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
import { IProjectData, Project } from 'src/scripts/documents/model/Project';
import { IDocument } from 'src/scripts/documents/Document';
import MessageDialog from 'components/common/MessageDialog.vue';
import HeaderToolbar from 'components/main/HeaderToolbar.vue';
import FooterLine from 'components/main/FooterLine.vue';

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
        // Switch to project
        await switchProject(null);
      }).catch((reason: any) => {
        console.error(reason);
      });
    }
    common.quasar.loading.hide();
  });
});

/**
 * Switches the active project for the current session.
 * If the provided project document is null, the method attempts to switch to the last active project
 * or falls back to the first available project in the session's project list.
 *
 * @param {IDocument<IProjectData> | null} projectDocument - The project document to switch to. If null, the method
 *        tries to resolve the project automatically.
 * @return {Promise<void>} A promise that resolves once the project switching operation is complete.
 */
async function switchProject(projectDocument: IDocument<IProjectData> | null): Promise<void> {
  await runAsync(async () => {
    // Get the account document
    const accountDocument = common.session.accountDocument;
    // If the project document is null, take the last active project from the account
    let projectId = projectDocument?.id ?? accountDocument?.data.state.lastActiveProject ?? null;
    // Check if the project ID is part of the project array.
    const found = common.session.projects.find((prj) => prj.id === projectId);
    // If the project ID is null or not found, take the first project from the list
    projectId = projectId !== null && found ? projectId : (common.session.projects[0]?.id ?? null);
    // Set the project ID on the account
    if (accountDocument) {
      accountDocument.data.state.lastActiveProject = projectId;
      // Update account
      await accountDocument.update();
    }
    if (projectId !== null) {
      // Load project
    } else {
      // No project to set
    }
    common.session.activeProject = projectId;
  });
}
</script>
