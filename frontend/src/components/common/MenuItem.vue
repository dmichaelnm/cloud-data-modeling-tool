<template>
  <!-- Above Separator -->
  <q-separator v-if="separator === 'above' || separator === 'both'" />
  <!-- Menu Item -->
  <q-item
    :clickable="!caption && !disabled"
    v-close-popup="!caption && !hasSubMenu && !disabled"
    dense
    @click="emits('click')"
  >
    <!-- Icon Section -->
    <q-item-section side>
      <!-- Icon -->
      <q-icon v-if="icon || showEmptyIcon" :name="icon" size="xs" />
    </q-item-section>
    <!-- Label Section -->
    <q-item-section>
      <!-- Label -->
      <q-item-label
        :class="`menu-item${disabled ? '-disabled' : ''} ${caption ? 'caption' : ''}`"
      >
        {{ label }}
      </q-item-label>
    </q-item-section>
    <!-- Submenu Icon Section -->
    <q-item-section side>
      <!-- Icon -->
      <q-icon name="arrow_right" v-if="hasSubMenu" />
    </q-item-section>
    <!-- Sub Item Slot -->
    <slot />
  </q-item>
  <!-- Below Separator -->
  <q-separator v-if="separator === 'below' || separator === 'both'" />
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

.menu-item {
  color: $light-text-normal;
}

.body--dark .menu-item {
  color: $dark-text-normal;
}

.menu-item-disabled{
  color: $light-text-disabled;
}

.body--dark .menu-item-disabled{
  color: $dark-text-disabled;
}

.caption {
  color: $light-text-label;
  font-size: 0.85rem;
  font-weight: bold;
}

.body--dark .caption {
  color: $dark-text-label;
}
</style>

<script setup lang="ts">
import { TSeparatorPosition } from 'src/scripts/composables/Options';

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
  // Caption
  caption?: boolean;
  // Separator
  separator?: TSeparatorPosition;
  // Show empty icon
  showEmptyIcon?: boolean;
  // Menu item disabled
  disabled?: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  // Click event
  (event: 'click'): void;
}>();
</script>
