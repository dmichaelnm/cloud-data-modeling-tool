<template>
  <!-- Document Dialog -->
  <document-dialog
    v-model="dialogVisible"
    :editor-data="editorData"
    :tabs="['selection']"
    :operation="dialogOperation"
    :post-operation-handler="onPostOperation"
  >
    <!-- Cloud Service Selection Template -->
    <template v-slot:tab-selection>
      <!-- Cloud Service Selection Component -->
      <cloud-service-provider-selection
        v-if="editorData"
        v-model="editorData"
        :operation="dialogOperation"
      />
    </template>
  </document-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { IAccountData } from 'src/scripts/documents/model/Account';
import { IProjectData } from 'src/scripts/documents/model/Project';
import * as dc from 'src/scripts/documents/Document';
import * as csp from 'src/scripts/documents/model/CloudServiceProvider';
import CloudServiceProviderSelection from 'components/cloudService/CloudServiceProviderSelection.vue';
import DocumentDialog from 'components/main/DocumentDialog.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * Reactive reference to the editor data for a cloud service provider.
 */
const editorData = ref<csp.CloudServiceProviderEditorData>();
/**
 * A reactive reference that determines the visibility state of this dialog.
 */
const dialogVisible = ref(false);
/**
 * A reactive reference to the dialog operation.
 */
const dialogOperation = ref(dc.EDocumentOperation.read);

/**
 * Opens a dialog with the specified document and operation.
 *
 * @param {IDocument<csp.ICloudServiceProviderData> | null} document - The document to be processed,
 *        or null if no document is provided.
 * @param {EDocumentOperation} operation - The operation to be performed on the document.
 * @return {void} This method does not return a value.
 */
function open(
  document: dc.IDocument<csp.ICloudServiceProviderData> | null,
  operation: dc.EDocumentOperation,
): void {
  // Create editor data instance
  editorData.value = new csp.CloudServiceProviderEditorData(
    common.session.accountDocument as dc.IDocument<IAccountData>,
    dc.EDocumentType.CloudServiceProvider,
    document,
    common.session.projectDocument as dc.IDocument<IProjectData>,
  );
  // Set the operation of the project dialog
  dialogOperation.value = operation;
  // Show dialog
  dialogVisible.value = true;
}

/**
 * Handles post-operation actions after a document operation is performed.
 *
 * @param {EDocumentOperation} operation The type of document operation performed (e.g., create, update, delete).
 * @param {IDocument<IProjectDocumentData>} document The document on which the operation was performed.
 * @return {void} No value is returned.
 */
function onPostOperation(
  operation: dc.EDocumentOperation,
  document: dc.IDocument<dc.IProjectDocumentData>,
): void {
  // If the document was newly created, it must be added to the project
  if (operation === dc.EDocumentOperation.create) {
    // Get the current project document
    const projectDocument = common.session.projectDocument;
    if (projectDocument) {
      // Add the cloud service provider document to the project document
      projectDocument.addDocument(document);
    }
  }
}

/**
 * Defines the exposed methods of this component.
 */
defineExpose({ open });
</script>
