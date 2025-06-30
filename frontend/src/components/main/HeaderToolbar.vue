<template>
  <!-- Toolbar -->
  <q-toolbar class="header-toolbar">
    <!-- Application Title -->
    <div id="applicationTitle">{{ $t('application.title') }}</div>
    <!-- Space DIV -->
    <div style="width: 64px" />
    <!-- Project Menu -->
    <project-menu @project-selected="onProjectSelected" />
    <!-- Space -->
    <q-space />
    <!-- Account Name -->
    <div class="text-right" style="padding: 0 8px">
      <!-- Account Name -->
      <div class="text-normal">{{ _accountName }}</div>
      <!-- Project Role -->
      <div class="text-disabled text-small">{{ $t(`options.projectRole.${_projectRole}`) }}</div>
    </div>
    <!-- Account Menu -->
    <account-menu />
  </q-toolbar>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

.header-toolbar {
  background-color: $light-header-toolbar-background;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.5);
}

.body--dark .header-toolbar {
  background-color: $dark-header-toolbar-background;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.9);
}

#applicationTitle {
  color: $light-text-label;
  font-size: 14pt;
  font-variant: small-caps;
}

.body--dark #applicationTitle {
  color: $dark-text-label;
}

</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { IDocument } from 'src/scripts/documents/Document';
import { IProjectData, Project } from 'src/scripts/documents/model/Project';
import AccountMenu from 'components/main/AccountMenu.vue';
import ProjectMenu from 'components/project/ProjectMenu.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Project selected
  (event: 'projectSelected', project: IDocument<IProjectData> | null): void;
}>();

/**
 * A computed property that retrieves the account name from the session's account document.
 * If the account document is not available or the username is not defined, it defaults to '?'.
 * The property dynamically updates whenever the account document changes.
 */
const _accountName = computed(() => {
  // Get the account document
  const document = common.session.accountDocument;
  // Return account name
  return document ? (document.data.user.name ?? '?') : '?';
});

/**
 * A computed property that determines the current user's role within the active project.
 */
const _projectRole = computed(() => {
  // Get the active project document
  const projectDocument = common.session.projectDocument;
  if (projectDocument) {
    // Create the project instance
    const project = new Project(projectDocument);
    // Return current role
    return project.getCurrentRole();
  }
  return undefined;
});

/**
 * Emits the 'projectSelected' event with the provided project data.
 *
 * @param {IDocument<IProjectData> | null} project - The project data to emit with the event, or
 *        null if no project is selected.
 * @return {void} This method does not return a value.
 */
function onProjectSelected(project: IDocument<IProjectData> | null): void {
  emits('projectSelected', project);
}
</script>
