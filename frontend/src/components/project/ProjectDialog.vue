<template>
  <!-- Document Dialog -->
  <document-dialog
    v-model="dialogVisible"
    :editor-data="editorData"
    :tabs="['members']"
    :prepare-handler="prepare"
    support-custom-attributes
  >
    <!-- Project Member Tab Template -->
    <template v-slot:tab-members v-if="editorData">
      <!-- Main DIV -->
      <div>
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
            <select-account v-model="projectManager" :label="$t('options.projectRole.manager')" />
          </div>
        </div>
      </div>
    </template>
  </document-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import { EDocumentType, IDocument } from 'src/scripts/documents/Document';
import { IProjectData, ProjectEditorData, TProjectRole } from 'src/scripts/documents/model/Project';
import { IAccountData } from 'src/scripts/documents/model/Account';
import DocumentDialog from 'components/main/DocumentDialog.vue';
import SelectAccount from 'components/authentication/SelectAccount.vue';

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
 * A reference variable used to store the owner of a project.
 */
const projectOwner = ref<IDocument<IAccountData> | null>(null);
/**
 * A reference variable used to store the manager of a project.
 */
const projectManager = ref<IDocument<IAccountData> | null>(null);

/**
 * Opens the project editor dialog.
 *
 * @param {IDocument<IProjectData> | null} document The project document to be opened, or null if a
 *        new project is created.
 * @return {Promise<void>} A promise that resolves once the edito has been opened and necessary
 *                         data is loaded.
 */
async function open(document: IDocument<IProjectData> | null): Promise<void> {
  editorData.value = new ProjectEditorData(
    common.session.accountDocument as IDocument<IAccountData>,
    EDocumentType.Project,
    document,
    undefined,
  );
  // Get document provider
  const provider = getDocumentProvider();
  // Initialize the project owner
  projectOwner.value = await provider.getDocument<IAccountData>(
    EDocumentType.Account,
    editorData.value.projectOwner.id,
  );
  // Initialize the project manager
  projectManager.value = await provider.getDocument<IAccountData>(
    EDocumentType.Account,
    editorData.value.projectManager.id,
  );
  // Show dialog
  dialogVisible.value = true;
}

/**
 * Prepares the editor data by setting the project owner and project manager details
 * based on the currently available values.
 *
 * @return {void} This method does not return a value.
 */
function prepare(): void {
  if (editorData.value) {
    if (projectOwner.value) {
      // Set project owner
      editorData.value.projectOwner = {
        role: TProjectRole.Owner,
        id: projectOwner.value.id,
        name: projectOwner.value.data.user.name,
        picture: projectOwner.value.data.user.picture,
        description: null,
        active: true,
      };
    }
    if (projectManager.value) {
      // Set project manager
      editorData.value.projectManager = {
        role: TProjectRole.Manager,
        id: projectManager.value.id,
        name: projectManager.value.data.user.name,
        picture: projectManager.value.data.user.picture,
        description: null,
        active: true,
      };
    }
  }
}

/**
 * Defines the methods to be exposed.
 */
defineExpose({ open });
</script>
