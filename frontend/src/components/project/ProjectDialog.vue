<template>
  <!-- Document Dialog -->
  <document-dialog
    v-model="dialogVisible"
    :editor-data="editorData"
    :tabs="['members']"
    support-custom-attributes
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
            />
          </div>
        </div>
      </div>
    </template>
  </document-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import { EDocumentType, IDocument } from 'src/scripts/documents/Document';
import { IProjectData, ProjectEditorData, EProjectRole } from 'src/scripts/documents/model/Project';
import { IAccountData } from 'src/scripts/documents/model/Account';
import DocumentDialog from 'components/main/DocumentDialog.vue';
import SelectAccount from 'components/authentication/SelectAccount.vue';
import ProjectMemberTable from 'components/project/ProjectMemberTable.vue';

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
 * A reactive variable that stores the height of this dialog component.
 */
const dialogHeight = ref(0);

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
 * Sets the project manager for the current project.
 *
 * @param {IDocument<IAccountData> | null} manager - The manager to be assigned as the project manager.
 *     Pass `null` to remove the current project manager.
 * @return {void} This method does not return a value.
 */
function setProjectManager(manager: IDocument<IAccountData> | null): void {
  if (editorData.value) {
    if (manager) {
      // Set project manager
      editorData.value.projectOwner = {
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
function validate(document: IDocument<IAccountData>): string | null {
  if (editorData.value) {
    // Check if not already added as a project member
    if (editorData.value.data.members.some((member) => member.id === document.id)) {
      return common.i18n.t('project.error.memberAlreadyAdded');
    }
  }
  return null;
}

/**
 * Defines the methods to be exposed.
 */
defineExpose({ open });
</script>
