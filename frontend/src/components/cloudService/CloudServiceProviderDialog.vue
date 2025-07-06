<template>
  <!-- Document Dialog -->
  <document-dialog
    v-model="dialogVisible"
    :editor-data="editorData"
    :tabs="['selection']"
    :operation="dialogOperation"
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
import { EDocumentOperation, EDocumentType, IDocument } from 'src/scripts/documents/Document';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { IAccountData } from 'src/scripts/documents/model/Account';
import { IProjectData } from 'src/scripts/documents/model/Project';
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
const dialogOperation = ref(EDocumentOperation.read);

/**
 * Opens a dialog with the specified document and operation.
 *
 * @param {IDocument<csp.ICloudServiceProviderData> | null} document - The document to be processed,
 *        or null if no document is provided.
 * @param {EDocumentOperation} operation - The operation to be performed on the document.
 * @return {void} This method does not return a value.
 */
function open(
  document: IDocument<csp.ICloudServiceProviderData> | null,
  operation: EDocumentOperation,
): void {
  // Create editor data instance
  editorData.value = new csp.CloudServiceProviderEditorData(
    common.session.accountDocument as IDocument<IAccountData>,
    EDocumentType.CloudServiceProvider,
    document,
    common.session.projectDocument as IDocument<IProjectData>,
  );
  // Set the operation of the project dialog
  dialogOperation.value = operation;
  // Show dialog
  dialogVisible.value = true;
}

/**
 * Defines the exposed methods of this component.
 */
defineExpose({ open });
</script>
