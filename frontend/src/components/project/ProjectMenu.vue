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
      <!-- Own Projects -->
      <menu-item
        v-if="_ownProjects.length > 0"
        :label="$t('project.menu.ownProjects')"
        separator="above"
        caption
      />
      <menu-item v-for="prj in _ownProjects" :key="prj.id" :label="prj.data.common.name" />
      <!-- Memberships -->
      <menu-item
        v-if="_memberships.length > 0"
        :label="$t('project.menu.memberships')"
        separator="above"
        caption
      />
      <menu-item v-for="prj in _memberships" :key="prj.id" :label="prj.data.common.name" />
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
import { IProjectData, Project } from 'src/scripts/documents/model/Project';
import { IDocument } from 'src/scripts/documents/Document';
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
 * Opens the project creation dialog if available.
 *
 * @return {void} This method does not return any value.
 */
function createProject(): void {
  projectDialog.value?.open(null);
}
</script>
