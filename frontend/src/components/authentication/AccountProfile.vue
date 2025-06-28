<template>
  <!-- Avatar -->
  <q-avatar class="account-profile">
    <!-- Profile Picture -->
    <img v-if="_profilePicture" :src="_profilePicture" alt="Profile Picture" />
    <!-- Initials -->
    <span v-if="!_profilePicture">{{ _accountInitials }}</span>
  </q-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IDocument } from 'src/scripts/documents/Document';
import { Account, IAccountData } from 'src/scripts/documents/model/Account';

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Model value
  modelValue: IDocument<IAccountData> | null | undefined;
}>();

/**
 * Computed property that retrieves the profile picture URL of a user.
 * If `modelValue` exists within the component's props and includes a `data.user.picture` property,
 * it returns the picture URL. Otherwise, it returns an empty string.
 */
const _profilePicture = computed(() => {
  return props.modelValue ? props.modelValue.data.user.picture : undefined;
});

/**
 * A computed property that represents the initials of an account.
 */
const _accountInitials = computed(() => {
  return props.modelValue ? new Account(props.modelValue).getAccountInitials() : '?';
});
</script>
