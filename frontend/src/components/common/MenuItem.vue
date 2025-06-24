<template>
  <!-- Menu Item -->
  <q-item
    :clickable="!readonly"
    v-close-popup="!readonly && !hasSubMenu"
    dense
    @click="emits('click')"
  >
    <!-- Icon Section -->
    <q-item-section side>
      <!-- Icon -->
      <q-icon v-if="icon" :name="icon" size="xs" />
    </q-item-section>
    <!-- Label Section -->
    <q-item-section>
      <!-- Label -->
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
    <!-- Submenu Icon Section -->
    <q-item-section side>
      <!-- Icon -->
      <q-icon name="arrow_right" v-if="hasSubMenu" />
    </q-item-section>
    <!-- Sub Item Slot -->
    <slot />
  </q-item>
</template>

<script setup lang="ts">
/**
 * Properties used in this component.
 */
defineProps<{
  // Label of the menu item
  label: string;
  // Optional icon
  icon?: string | undefined;
  // Options submenu indicator
  hasSubMenu?: boolean;
  // Read-Only Flag
  readonly?: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Click event
  (event: 'click'): void;
}>();
</script>
