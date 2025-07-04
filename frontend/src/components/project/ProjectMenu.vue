<template>
  <!-- Message Dialog -->
  <message-dialog v-model="messageDialogOptions.visibility" />
  <!-- Project Dialog -->
  <project-dialog ref="projectDialog" @project-created="onProjectCreated" />
  <!-- Project Label -->
  <div class="text-header-normal">{{ $t('project.label.active') }}</div>
  <!-- Project Menu DIV -->
  <div id="projectMenu">
    <!-- Project Menu Button -->
    <q-btn-dropdown
      id="projectDropdown"
      :label="_projectLabel"
      flat
      no-caps
      menu-anchor="bottom left"
      menu-self="top left"
    >
      <!-- New Project Menu Item -->
      <menu-item :label="$t('project.menu.new')" icon="add" @click="createProject" />
      <!-- Edit Current Project Menu Item -->
      <menu-item
        :label="$t('project.menu.edit')"
        v-if="_canEdit"
        show-empty-icon
        @click="openCurrentProject(EDocumentOperation.update)"
      />
      <!-- Delete Current Project Menu Item -->
      <menu-item
        :label="$t('project.menu.delete')"
        v-if="_canDelete"
        show-empty-icon
        @click="onConfirmProjectDeletion"
      />
      <!-- View Current Project Menu Item -->
      <menu-item
        :label="$t('project.menu.view')"
        v-if="!_canEdit && common.session.projects.length > 0"
        show-empty-icon
        @click="openCurrentProject(EDocumentOperation.read)"
      />
      <!-- Own Projects -->
      <menu-item
        v-if="_ownProjects.length > 0"
        :label="$t('project.menu.ownProjects')"
        separator="above"
        caption
      />
      <menu-item
        v-for="prj in _ownProjects"
        :key="prj.id"
        :label="prj.data.common.name"
        :icon="common.session.activeProject === prj.id ? 'check' : ''"
        show-empty-icon
        @click="emits('projectSelected', prj)"
      />
      <!-- Memberships -->
      <menu-item
        v-if="_memberships.length > 0"
        :label="$t('project.menu.memberships')"
        separator="above"
        caption
      />
      <menu-item
        v-for="prj in _memberships"
        :key="prj.id"
        :label="prj.data.common.name"
        :icon="common.session.activeProject === prj.id ? 'check' : ''"
        show-empty-icon
        @click="emits('projectSelected', prj)"
      />
    </q-btn-dropdown>
  </div>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

#projectMenu {
  padding: 8px 16px;
}

#projectDropdown {
  border-radius: 4px;
  color: $light-text-normal;
  background-color: $light-body-background;
  border: 1px solid $light-border-normal;
  font-weight: normal;
}

.body--dark #projectDropdown {
  color: $dark-text-normal;
  background-color: $dark-body-background;
  border: 1px solid $dark-border-normal;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCommonComposables, useRunAsync } from 'src/scripts/composables/Common';
import { EProjectRole, IProjectData, Project } from 'src/scripts/documents/model/Project';
import { EDocumentOperation, IDocument } from 'src/scripts/documents/Document';
import { messageDialogOptions, useConfirmationDialog } from 'src/scripts/composables/Dialog';
import MenuItem from 'components/common/MenuItem.vue';
import ProjectDialog from 'components/project/ProjectDialog.vue';
import MessageDialog from 'components/common/MessageDialog.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function for executing asynchronous tasks.
 */
const runAsync = useRunAsync();
/**
 * Function to show a confirmation dialog.
 */
const confirmationDialog = useConfirmationDialog();

/**
 * Ref variable for managing the reference to the ProjectDialog instance.
 */
const projectDialog = ref<InstanceType<typeof ProjectDialog> | null>(null);

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Project selected
  (event: 'projectSelected', project: IDocument<IProjectData> | null): void;
}>();

/**
 * A computed property that determines the label of the currently active project.
 */
const _projectLabel = computed(() => {
  const projectDocument = common.session.projectDocument;
  return projectDocument ? projectDocument.data.common.name : common.i18n.t('message.noSelection');
});

/**
 * A computed property that returns a list of projects owned by the current user.
 */
const _ownProjects = computed(() => {
  const ownId = common.session.accountDocument?.data.user.id;
  return common.session.projects.filter((prj) => {
    const project = new Project(prj);
    const owner = project.getProjectOwner();
    return owner && owner.id === ownId;
  }) as IDocument<IProjectData>[];
});

/**
 * A computed property that returns a filtered list of project memberships.
 */
const _memberships = computed(() => {
  const ownId = common.session.accountDocument?.data.user.id;
  return common.session.projects.filter((prj) => {
    const project = new Project(prj);
    const owner = project.getProjectOwner();
    return owner && owner.id !== ownId;
  }) as IDocument<IProjectData>[];
});

/**
 * A computed property that determines whether the current user can edit the active project.
 */
const _canEdit = computed(() => {
  const projectDocument = common.session.projectDocument;
  if (projectDocument) {
    const project = new Project(projectDocument);
    const role = project.getCurrentRole();
    return role === EProjectRole.Owner || role === EProjectRole.Manager;
  }
  return false;
});

/**
 * A computed property that determines whether the current user can delete the active project.
 */
const _canDelete = computed(() => {
  const projectDocument = common.session.projectDocument;
  if (projectDocument) {
    const project = new Project(projectDocument);
    const role = project.getCurrentRole();
    return role === EProjectRole.Owner;
  }
  return false;
});

/**
 * Opens the project creation dialog if available.
 *
 * @return {void} This method does not return any value.
 */
function createProject(): void {
  projectDialog.value?.open(null, EDocumentOperation.create);
}

/**
 * Opens the current project document within the application.
 *
 * @param {EDocumentOperation} operation - The operation to perform on the current project document.
 * @return {void} Does not return a value.
 */
function openCurrentProject(operation: EDocumentOperation): void {
  // Get the current project document
  const projectDocument = common.session.projectDocument;
  if (projectDocument) {
    projectDialog.value?.open(projectDocument, operation);
  }
}

/**
 * Handles the event triggered when a new project is created.
 * Emits an event to indicate that a project has been selected.
 *
 * @param {IDocument<IProjectData>} projectDocument - The document object containing project data.
 * @return {void} Does not return a value.
 */
function onProjectCreated(projectDocument: IDocument<IProjectData>): void {
  // Emit event for project selection
  emits('projectSelected', projectDocument);
}

/**
 * Handles the confirmation and later deletion of a project document.
 *
 * This method displays a confirmation dialog to the user when they attempt to delete a project.
 * If the user confirms the deletion, the project document is deleted, the project is removed
 * from the project list, and another project is activated.
 *
 * @return {void} Does not return a value.
 */
function onConfirmProjectDeletion(): void {
  // Get the current project document
  const projectDocument = common.session.projectDocument;
  confirmationDialog(
    common.i18n.t('project.dialog.delete.title'),
    common.i18n.t('project.dialog.delete.message', { name: projectDocument?.data.common.name }),
    undefined,
    async (value) => {
      // Check user confirmation
      if (value === 'ok') {
        await runAsync(async () => {
          // Delete project document
          await projectDocument?.delete();
          // Remove the project from the project list
          const index = common.session.projects.findIndex((prj) => prj.id === projectDocument?.id);
          if (index > -1) {
            common.session.projects.splice(index, 1);
          }
          // Force to activate another project
          emits('projectSelected', null);
        });
      }
    },
  );
}
</script>
