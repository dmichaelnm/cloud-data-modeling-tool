<template>
  <!-- Document Dialog -->
  <document-dialog
    v-model="dialogVisible"
    :editor-data="editorData"
    :tabs="['members']"
    :post-operation-handler="onAfterOperation"
    :operation="dialogOperation"
    support-custom-attributes
    custom-attributes-message-prefix="project.dialog.tab.customAttributes"
    @dialog-resize="(_, height) => (dialogHeight = height)"
  >
    <!-- Project Member Tab Template -->
    <template v-slot:tab-members v-if="editorData">
      <!-- Main DIV -->
      <div class="q-col-gutter-y-lg">
        <!-- Owner & Manager Row -->
        <div class="row q-col-gutter-x-sm">
          <!-- Owner Column -->
          <div class="col-3">
            <!-- Owner Selection -->
            <select-account
              v-model="projectOwner"
              :label="$t('options.projectRole.owner')"
              read-only
            />
          </div>
          <!-- Manager Column -->
          <div class="col-3">
            <!-- Manager Selection -->
            <select-account
              v-model="projectManager"
              :label="$t('options.projectRole.manager')"
              :validation-handler="validate"
              :read-only="_isProjectManager || dialogOperation === EDocumentOperation.read"
              @update:model-value="setProjectManager"
            />
          </div>
        </div>
        <!-- Project Member Row -->
        <div class="row">
          <!-- Project Member Column -->
          <div class="col">
            <!-- Project Member Table -->
            <project-member-table
              v-if="editorData"
              v-model="editorData"
              :height="_memberTableHeight"
              :read-only="dialogOperation === EDocumentOperation.read"
            />
          </div>
        </div>
      </div>
    </template>
  </document-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useCommonComposables} from 'src/scripts/composables/Common';
import {getDocumentProvider} from 'src/scripts/documents/DocumentProvider';
import {EProjectRole, IProjectData, Project, ProjectEditorData} from 'src/scripts/documents/model/Project';
import {IAccountData} from 'src/scripts/documents/model/Account';
import * as dc from 'src/scripts/documents/Document';
import DocumentDialog from 'components/main/DocumentDialog.vue';
import SelectAccount from 'components/authentication/SelectAccount.vue';
import ProjectMemberTable from 'components/project/ProjectMemberTable.vue';
import {EDocumentOperation} from "src/scripts/documents/Document";

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * A reactive reference to the ProjectEditorData object. This variable contains all the data and state
 * related to the editor. It serves as a centralized source for managing and accessing the editor's
 * content.
 */
const editorData = ref<ProjectEditorData>();
/**
 * A reactive reference representing the visibility state of this dialog.
 */
const dialogVisible = ref(false);
/**
 * A reactive variable that determines if a dialog should be in read-only mode.
 */
const dialogOperation = ref(EDocumentOperation.read);
/**
 * A reference variable used to store the owner of a project.
 */
const projectOwner = ref<dc.IDocument<IAccountData> | null>(null);
/**
 * A reference variable used to store the manager of a project.
 */
const projectManager = ref<dc.IDocument<IAccountData> | null>(null);
/**
 * A reactive variable that stores the height of this dialog component.
 */
const dialogHeight = ref(0);

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Project created
  (event: 'project-created', document: dc.IDocument<IProjectData>): void;
}>();

/**
 * A computed property that dynamically calculates the height of the member table.
 * The height is determined based on the `dialogHeight` value, reduced by a fixed offset of 317.
 * Logs the calculated height to the console for debugging.
 */
const _memberTableHeight = computed(() => {
  const x = dialogHeight.value - 317;
  console.log(x);
  return x;
});

/**
 * A computed property that determines whether the current user holds the role of a
 * Project Manager in the context of the provided document data.
 */
const _isProjectManager = computed(() => {
  if (editorData.value?.document) {
    const project = new Project(editorData.value.document);
    return project.getCurrentRole() === EProjectRole.Manager;
  }
  return false;
});

/**
 * Opens a document and initializes the necessary data for the editor,
 * including the project owner, project manager, and dialog settings.
 *
 * @param {dc.IDocument<IProjectData> | null} document - The document to open, or null if no document is provided.
 * @param {dc.EDocumentOperation} operation - The operation to perform, such as viewing or editing the document.
 * @return {Promise<void>} A Promise that resolves when the dialog and required data have been fully initialized.
 */
async function open(document: dc.IDocument<IProjectData> | null, operation: dc.EDocumentOperation): Promise<void> {
  editorData.value = new ProjectEditorData(
    common.session.accountDocument as dc.IDocument<IAccountData>,
    dc.EDocumentType.Project,
    document,
    undefined,
  );
  // Get document provider
  const provider = getDocumentProvider();
  // Initialize the project owner
  projectOwner.value = await provider.getDocument<IAccountData>(
    dc.EDocumentType.Account,
    editorData.value.projectOwner.id,
  );
  // Initialize the project manager
  projectManager.value = await provider.getDocument<IAccountData>(
    dc.EDocumentType.Account,
    editorData.value.projectManager.id,
  );
  // Set the operation of the project dialog
  dialogOperation.value = operation
  // Show dialog
  dialogVisible.value = true;
}

/**
 * Sets the project manager for the current project.
 *
 * @param {IDocument<IAccountData> | null} manager - The manager to be assigned as the project manager.
 *     Pass `null` to remove the current project manager.
 * @return {void} This method does not return a value.
 */
function setProjectManager(manager: dc.IDocument<IAccountData> | null): void {
  if (editorData.value) {
    if (manager) {
      // Set project manager
      editorData.value.projectManager = {
        role: EProjectRole.Manager,
        id: manager.id,
        name: manager.data.user.name,
        picture: manager.data.user.picture,
        description: null,
        active: true,
      };
    }
  }
}

/**
 * Validates whether the specified document can be added as a project member.
 *
 * @param {IDocument<IAccountData>} document - The document representing the account data to validate.
 * @return {string | null} A localized error message if the document is already added as a member, otherwise null.
 */
function validate(document: dc.IDocument<IAccountData>): string | null {
  if (editorData.value) {
    // Check if not already added as a project member
    if (editorData.value.data.members.some((member) => member.id === document.id)) {
      return common.i18n.t('project.error.memberAlreadyAdded');
    }
  }
  return null;
}

/**
 * Performs actions after a document operation is executed.
 *
 * @param {dc.EDocumentOperation} operation - The type of document operation that was performed.
 * @param {dc.IDocument<dc.IProjectDocumentData>} document - The document affected by the operation.
 * @return {void} This method does not return anything.
 */
function onAfterOperation(
  operation: dc.EDocumentOperation,
  document: dc.IDocument<dc.IProjectDocumentData>,
): void {
  if (operation === dc.EDocumentOperation.create) {
    // Add the new project to the list of projects
    const projectDocument = document as dc.IDocument<IProjectData>;
    common.session.projects.push(projectDocument);
    common.session.sortProjects();
    // Emit event
    emits('project-created', projectDocument);
  }
}

/**
 * Defines the methods to be exposed.
 */
defineExpose({open});
</script>
