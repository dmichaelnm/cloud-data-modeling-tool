<template>
  <!-- Avatar -->
  <q-avatar :class="`account-profile${header ? '-header' : ''}`" :size="size">
    <!-- Profile Picture -->
    <img v-if="_profilePicture" :src="_profilePicture" alt="Profile Picture" referrerpolicy="no-referrer"/>
    <!-- Initials -->
    <span v-if="!_profilePicture">{{ _accountInitials }}</span>
  </q-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IDocument } from 'src/scripts/documents/Document';
import { Account, IAccountData } from 'src/scripts/documents/model/Account';
import { TSize } from 'src/scripts/composables/Common';

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  document?: IDocument<IAccountData> | null | undefined;
  // Picture URL
  accountPicture?: string;
  // Account Name
  accountName?: string;
  // Optional Size
  size?: TSize;
  // Header
  header?: boolean;
}>();

/**
 * Computed property that retrieves the profile picture URL of a user.
 * If `modelValue` exists within the component's props and includes a `data.user.picture` property,
 * it returns the picture URL. Otherwise, it returns an empty string.
 */
const _profilePicture = computed(() => {
  if (props.document) {
    return props.document ? props.document.data.user.picture : undefined;
  } else if (props.accountPicture) {
    return props.accountPicture;
  } else {
    return undefined;
  }
});

/**
 * A computed property that represents the initials of an account.
 */
const _accountInitials = computed(() => {
  if (props.document) {
    return props.document ? Account.getAccountInitials(props.document.data.user.name) : '?'
  } else if (props.accountName) {
    return Account.getAccountInitials(props.accountName);
  } else {
    return '?'
  }
});
</script>
