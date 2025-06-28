<template>
  <!-- Project Dialog -->
  <project-dialog ref="projectDialog" />
  <!-- Project Label -->
  <div class="text-normal">{{ $t('project.label.active') }}</div>
  <!-- Project Menu DIV -->
  <div id="projectMenu">
    <!-- Project Menu Button -->
    <q-btn-dropdown id="projectDropdown" :label="_projectLabel" flat no-caps>
      <!-- New Project Menu Item -->
      <menu-item :label="$t('project.menu.new')" icon="add" @click="createProject" />
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
import { useCommonComposables } from 'src/scripts/composables/Common';
import MenuItem from 'components/common/MenuItem.vue';
import ProjectDialog from 'components/project/ProjectDialog.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * Ref variable for managing the reference to the ProjectDialog instance.
 */
const projectDialog = ref<InstanceType<typeof ProjectDialog> | null>(null);

const _projectLabel = computed(() => {
  return common.i18n.t('message.noSelection');
});

/**
 * Opens the project creation dialog if available.
 *
 * @return {void} This method does not return any value.
 */
function createProject(): void {
  projectDialog.value?.open(null);
}
</script>
