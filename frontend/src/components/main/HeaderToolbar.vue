<template>
  <!-- Toolbar -->
  <q-toolbar class="header-toolbar">
    <!-- Application Title -->
    <div id="applicationTitle">{{ $t('application.title') }}</div>
    <!-- Space DIV -->
    <div style="width: 64px" />
    <!-- Project Menu -->
    <project-menu />
    <!-- Space -->
    <q-space />
    <!-- Account Name -->
    <div id="accountName">{{ _accountName }}</div>
    <!-- Account Menu -->
    <account-menu />
  </q-toolbar>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

.header-toolbar {
  background-color: $light-header-toolbar-background;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.5);
}

.body--dark .header-toolbar {
  background-color: $dark-header-toolbar-background;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.9);
}

#applicationTitle {
  color: $light-text-label;
  font-size: 14pt;
  font-variant: small-caps;
}

.body--dark #applicationTitle {
  color: $dark-text-label;
}

#accountName {
  padding: 0 8px;
  color: $light-text-normal;
}

.body--dark #accountName {
  padding: 0 8px;
  color: $dark-text-normal;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import AccountMenu from 'components/main/AccountMenu.vue';
import ProjectMenu from 'components/project/ProjectMenu.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * A computed property that retrieves the account name from the session's account document.
 * If the account document is not available or the username is not defined, it defaults to '?'.
 * The property dynamically updates whenever the account document changes.
 */
const _accountName = computed(() => {
  // Get the account document
  const document = common.session.accountDocument;
  // Return account name
  return document ? (document.data.user.name ?? '?') : '?';
});
</script>
