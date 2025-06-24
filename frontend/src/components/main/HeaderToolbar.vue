<template>
  <!-- Toolbar -->
  <q-toolbar class="header-toolbar">
    <!-- Space -->
    <q-space />
    <!-- Account Menu Button -->
    <q-btn flat round>
      <!-- Avatar -->
      <q-avatar id="accountAvatar">
        <!-- Account Initials -->
        <span id="accountInitials" v-if="_pictureURL === ''">{{ _accountInitials }}</span>
        <!-- Profile Image -->
        <img :src="_pictureURL" alt="Profile Image" v-if="_pictureURL !== ''" />
        <!-- Tooltip -->
        <q-tooltip>{{ _accountName }}</q-tooltip>
      </q-avatar>
      <!-- Account Menu -->
      <q-menu anchor="bottom right" self="top right">

      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

#accountAvatar {
  background-color: $light-button-label-color;
  color: $light-text-normal;
}

#accountInitials {
  padding-top: 1px;
  padding-right: 1px;
  font-size: 12pt;
}

.header-toolbar {
  background-color: $light-header-toolbar-background;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.5);
}
</style>

<script setup lang="ts">
import { useCommonComposables } from 'src/scripts/composables/Common';
import { computed } from 'vue';

const common = useCommonComposables();

const _pictureURL = computed(() => {
  // Get the account document
  const document = common.session.accountDocument;
  // Return picture URL
  return document ? (document.data.user.picture ?? '') : '';
});

const _accountName = computed(() => {
  // Get the account document
  const document = common.session.accountDocument;
  // Return account name
  return document ? (document.data.user.name ?? '?') : '?';
});

const _accountInitials = computed(() => {
  // Get the account document
  const document = common.session.accountDocument;
  // Get account name
  const name = document ? (document.data.user.name ?? '?') : '?';
  // Splitting the name by spaces
  const nameParts = name.trim().split(/\s+/);
  // Get the first letter from each part and combine them
  const initials = nameParts.map((part) => part[0]?.toUpperCase()).join('');
  // Return the first to letters
  return initials.substring(0, Math.min(2, initials.length));
});
</script>
