<template>
  <!-- Application Dialog -->
  <application-dialog
    ref="applicationDialog"
    :model-value="_modelValue"
    :title="$t(`${_documentType}.dialog.${_operation}.title`)"
    :message="$t(`${_documentType}.dialog.${_operation}.message`)"
    :buttons="_dialogButtons"
    :width="_dialogWith"
    :height="_dialogHeight"
    :submit-handler="performOperation"
    @update:model-value="(val) => (_modelValue = val)"
    @initialize="initDialog"
  >
    <!-- Message Template -->
    <template v-slot:bottomLeft>
      <!-- Meta Information Row -->
      <div v-if="editorData?.document" class="text-small text-disabled">
        <!-- Created -->
        <div v-if="editorData.document.data.meta">
          {{
            $t('message.createdByAt', {
              date: editorData.document.data.meta.created.time.toLocaleString(common.session.account?.document.data.preferences.language),
              name: editorData.document.data.meta.created.name
            })
          }}
        </div>
        <!-- Altered -->
        <div v-if="editorData.document.data.meta?.altered">
          {{
            $t('message.alteredByAt', {
              date: editorData.document.data.meta.altered.time.toLocaleString(common.session.account?.document.data.preferences.language),
              name: editorData.document.data.meta.altered.name
            })
          }}
        </div>
      </div>
    </template>

    <!-- Hidden button to force submit by pressing enter -->
    <button type="submit" style="display: none" />
    <!-- Dialog Content DIV -->
    <div class="q-col-gutter-y-sm">
      <!-- Common Properties Row -->
      <div class="row q-col-gutter-x-sm">
        <!-- Name Column -->
        <div class="col-4">
          <!-- Name Input -->
          <input-value
            v-model="_editorData.data.common.name"
            :label="$t(`${_documentType}.label.name`)"
            mandatory
            auto-focus
          />
        </div>
        <!-- Description Column -->
        <div class="col-8">
          <!-- Description Input -->
          <input-value
            v-model="_editorData.data.common.description"
            :label="$t('label.description')"
          />
        </div>
      </div>
      <!-- Tab View Row -->
      <div class="row">
        <!-- Tab View Column -->
        <div class="col">
          <!-- Tab Definitions -->
          <q-tabs v-model="currentTab" align="left" active-class="active-tab" no-caps dense>
            <!-- Tab Definition -->
            <q-tab
              v-for="tab in tabs"
              :key="tab"
              :name="tab"
              :label="$t(`${_documentType}.dialog.tab.${tab}.title`)"
            />
            <!-- Custom Attributes Tab Definition -->
            <q-tab
              v-if="supportCustomAttributes"
              name="customAttributes"
              :label="$t('label.customAttributes')"
            />
          </q-tabs>
          <!-- Tab Panels -->
          <q-tab-panels v-model="currentTab" keep-alive>
            <!-- Tab Panel -->
            <q-tab-panel v-for="tab in tabs" :key="tab" :name="tab">
              <div class="q-gutter-y-sm">
                <div>{{ $t(`${_documentType}.dialog.tab.${tab}.message`) }}</div>
                <div>
                  <!-- Tab Panel Slot -->
                  <slot :name="`tab-${tab}`"></slot>
                </div>
              </div>
            </q-tab-panel>
            <!-- Custom Attributes Tab Panel -->
            <q-tab-panel v-if="supportCustomAttributes" name="customAttributes">
              <!-- Custom Attributes Table -->
              <custom-attributes-table
                v-model="_editorData.data.customAttributes"
                :message="`${customAttributesMessagePrefix}.message`"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </application-dialog>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

.active-tab {
  color: $light-text-highlighted;
  font-weight: bold !important;
}

.body--dark .active-tab {
  color: $dark-text-highlighted;
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useCommonComposables, useRunAsync } from 'src/scripts/composables/Common';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import { TDialogButton } from 'src/scripts/composables/Dialog';
import * as dc from 'src/scripts/documents/Document';
import ApplicationDialog from 'components/common/ApplicationDialog.vue';
import InputValue from 'components/common/InputValue.vue';
import CustomAttributesTable from 'components/main/CustomAttributesTable.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function for executing asynchronous tasks.
 */
const runAsync = useRunAsync();

/**
 * A reactive reference to the application dialog instance.
 */
const applicationDialog = ref<InstanceType<typeof ApplicationDialog> | null>(null);

/**
 * A reactive reference variable that stores the identifier or name of the currently active tab.
 */
const currentTab = ref<string>('');
/**
 * A reactive reference holding the current width of the browser window.
 */
const windowWidth = ref<number>(window.innerWidth);
/**
 * A reactive reference holding the current height of the browser window.
 */
const windowHeight = ref<number>(window.innerHeight);

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: boolean;
  // Editor data
  editorData: dc.EditorData<dc.IProjectDocumentData> | undefined;
  // Tab names
  tabs: string[];
  // Flag for supporting custom attributes for this document
  supportCustomAttributes?: boolean;
  // Prefix for special custom attributes messages
  customAttributesMessagePrefix?: string;
  // Prepare-handler function
  prepareHandler?: () => Promise<void> | void;
  // Post-operation handler function
  postOperationHandler?: (
    operation: dc.EDocumentOperation,
    document: dc.IDocument<dc.IProjectDocumentData>,
  ) => void;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Update model value
  (event: 'update:modelValue', value: boolean): void;
  // Dialog resize event
  (event: 'dialogResize', width: number, height: number): void;
}>();

/**
 * A computed property that acts as a two-way data binding for the `modelValue` prop.
 */
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

/**
 * A computed property that calculates the width of a dialog box.
 */
const _dialogWith = computed(() => {
  return Math.floor(windowWidth.value * 0.8);
});

/**
 * A computed property that calculates the height of a dialog box.
 */
const _dialogHeight = computed(() => {
  return Math.floor(windowHeight.value * 0.65);
});

/**
 * A computed property representing the editor data associated with the current component.
 * This property retrieves and casts the `editorData` from the component's props
 * to a specific type `dc.EditorData<dc.IProjectDocumentData>`.
 */
const _editorData = computed(() => props.editorData as dc.EditorData<dc.IProjectDocumentData>);

/**
 * Represents the computed type of the document based on the editor's data.
 */
const _documentType = computed(() => props.editorData?.type ?? dc.EDocumentType.Project);

/**
 * A computed property that determines the current document operation
 * based on the presence of the `document` property in `editorData`.
 * If `editorData.document` exists, the operation will be set to
 * `EDocumentOperation.update`. Otherwise, it defaults to
 * `EDocumentOperation.create`.
 */
const _operation = computed(() =>
  props.editorData?.document ? dc.EDocumentOperation.update : dc.EDocumentOperation.create,
);

/**
 * A computed property that generates an array of dialog button configurations
 * based on the current operation type.
 * The generated buttons are designed to align with the specific document operation
 * being performed (e.g., create, update, or default behavior).
 */
const _dialogButtons = computed<TDialogButton[]>(() => {
  switch (_operation.value) {
    case dc.EDocumentOperation.create:
      return [
        {
          value: 'save',
          label: common.i18n.t('button.create'),
          appearance: 'push',
          submit: true,
        },
        { value: 'cancel', label: common.i18n.t('button.cancel'), appearance: 'link' },
      ] as TDialogButton[];
    case dc.EDocumentOperation.update:
      return [
        {
          value: 'save',
          label: common.i18n.t('button.save'),
          appearance: 'push',
          submit: true,
        },
        { value: 'cancel', label: common.i18n.t('button.cancel'), appearance: 'link' },
      ] as TDialogButton[];
    default:
      return [{ value: 'close', label: common.i18n.t('button.close'), appearance: 'link' }];
  }
});

/**
 * Lifecycle method that is called before this component is mounted.
 */
onBeforeUnmount(() => {
  emits('dialogResize', _dialogWith.value, _dialogHeight.value);
});

/**
 * Initializes the dialog by setting the initial value of the current tab based on the tabs provided in the props.
 * If the `tabs` array in props is not empty, it assigns the first tab. Otherwise, it sets an empty string.
 *
 * @return {void} Does not return a value.
 */
function initDialog(): void {
  currentTab.value = props.tabs.length > 0 ? (props.tabs[0] as string) : '';
}

async function performOperation(): Promise<boolean> {
  return (
    (await runAsync<boolean>(async () => {
      // Prepare editor data
      await props.prepareHandler?.();
      if (_operation.value === dc.EDocumentOperation.create) {
        // Create data object
        const data: dc.IProjectDocumentData = {
          common: {
            name: _editorData.value.data.common.name,
            description: _editorData.value.data.common.description,
          },
          customAttributes: [
            ..._editorData.value.data.customAttributes.map((attr) => {
              return {
                ...attr,
              };
            }),
          ],
        };
        // Update document data with editor data
        _editorData.value.updateDocumentData(data);
        // Get document provider
        const provider = getDocumentProvider();
        // Create the document in Firestore
        const document = await provider.createDocument(dc.EDocumentType.Project, undefined, data);
        // Call post operation handler
        props.postOperationHandler?.(dc.EDocumentOperation.create, document);
      } else if (_operation.value === dc.EDocumentOperation.update) {
        // Get the document
        const document = _editorData.value.document as dc.IDocument<dc.IProjectDocumentData>;
        // Apply common values
        document.data.common.name = _editorData.value.data.common.name;
        document.data.common.description = _editorData.value.data.common.description;
        // Apply custom attributes
        document.data.customAttributes = [..._editorData.value.data.customAttributes.map((attr) => {
          return {
            ...attr,
          };
        })];
        // Apply document type specific data
        _editorData.value.updateDocumentData(document.data);
        // Update the document
        await document.update();
      }
      // Process successful
      return true;
    })) ?? false
  );
}

/**
 * Adds an event listener to capture window resize events.
 */
window.addEventListener('resize', (event) => {
  const window = event.target as Window;
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
  emits('dialogResize', _dialogWith.value, _dialogHeight.value);
});
</script>
