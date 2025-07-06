<template>
  <!-- Cloud Service Provider Dialog -->
  <cloud-service-provider-dialog ref="cspDialog" />
  <!-- Menu Button -->
  <q-btn-dropdown flat icon="o_cloud" menu-anchor="bottom left" menu-self="top left">
    <!-- New Cloud Service Provider Menu Item -->
    <menu-item
      v-if="_canMaintainProvider"
      :label="$t('cloudServiceProvider.menu.new')"
      :separator="_providers.length > 0 ? 'below' : 'none'"
      icon="add"
      @click="openDialog(null, EDocumentOperation.create)"
    />
    <!-- Cloud Service Provider Menu Items -->
    <menu-item
      v-for="prv of _providers"
      :key="prv.id"
      :label="prv.data.common.name"
      :icon="`img:icons/provider/${prv.data.provider}.png`"
      has-sub-menu
    >
      <!-- Cloud Service Provider Sub Menu -->
      <q-menu anchor="top right" self="top left">
        <!-- List -->
        <q-list>
          <!-- Edit Cloud Service Provider -->
          <menu-item
            v-if="_canMaintainProvider"
            :label="$t('cloudServiceProvider.menu.edit')"
            show-empty-icon
            @click="openDialog(prv, EDocumentOperation.update)"
          />
          <menu-item
            v-if="_canMaintainProvider"
            :label="$t('cloudServiceProvider.menu.delete')"
            show-empty-icon
          />
          <menu-item
            v-if="!_canMaintainProvider"
            :label="$t('cloudServiceProvider.menu.view')"
            show-empty-icon
          />
          <menu-item
            v-if="_canMaintainProvider"
            :label="$t('cloudService.menu.new')"
            icon="add"
            separator="above"
          />
        </q-list>
      </q-menu>
    </menu-item>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { EDocumentOperation, EDocumentType, IDocument } from 'src/scripts/documents/Document';
import { ICloudServiceProviderData } from 'src/scripts/documents/model/CloudServiceProvider';
import { EProjectRole, Project } from 'src/scripts/documents/model/Project';
import CloudServiceProviderDialog from 'components/cloudService/CloudServiceProviderDialog.vue';
import MenuItem from 'components/common/MenuItem.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * A reactive reference to an instance of the CloudServiceProviderDialog component.
 */
const cspDialog = ref<InstanceType<typeof CloudServiceProviderDialog>>();

/**
 * A computed property that retrieves the collection of active cloud service provider documents
 * associated with the current project document in the session. If no project document exists,
 * an empty array is returned.
 */
const _providers = computed(() => {
  // Get the active project document
  const projectDocument = common.session.projectDocument;
  if (projectDocument) {
    // Return cloud service provider document
    return projectDocument.getDocuments<ICloudServiceProviderData>(
      EDocumentType.CloudServiceProvider,
    );
  }
  // Return an empty array
  return [];
});

/**
 * A computed property that determines if the user can maintain the provider and services based on their role in
 * the active project.
 */
const _canMaintainProvider = computed(() => {
  // Get the active project document
  const projectDocument = common.session.projectDocument;
  if (projectDocument) {
    const project = new Project(projectDocument);
    const role = project.getCurrentRole();
    return (
      role === EProjectRole.Owner ||
      role === EProjectRole.Manager ||
      role === EProjectRole.Maintainer
    );
  }
  return false;
});

/**
 * Opens a dialog for the given document and operation.
 *
 * @param {IDocument<ICloudServiceProviderData> | null} document - The document to be processed in the dialog.
 *        Provide `null` if no document is associated.
 * @param {EDocumentOperation} operation - The operation that will be performed in the dialog.
 * @return {void} This method does not return any value.
 */
function openDialog(
  document: IDocument<ICloudServiceProviderData> | null,
  operation: EDocumentOperation,
): void {
  // Open Dialog
  cspDialog.value?.open(document, operation);
}
</script>
