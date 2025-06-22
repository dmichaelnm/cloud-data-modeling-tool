<template>
  <!-- Button -->
  <q-btn
    :label="label"
    :type="type"
    :push="_appearance === 'push'"
    :flat="_appearance === 'link'"
    :class="`button-label button-label-${_appearance}`"
    :to="to"
    :color="color"
    :dense="dense"
    no-caps
    @click="emits('click')"
  />
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

.button-label {
  border-radius: 4px;
  padding: 1px 16px 0 16px;
}

.button-label-push {
  background-color: $light-button-label-background;
  color: $light-button-label-color;
}

.body--dark .button-label-push {
  background-color: $dark-button-label-background;
  color: $dark-button-label-color;
}

.button-label-link {
  color: $light-text-highlighted;
}

.body--dark .button-label-link {
  color: $dark-text-highlighted;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Properties used in this component.
 */
const props = defineProps<{
  label: string;
  type?: 'button' | 'submit' | 'reset';
  appearance?: 'push' | 'link' | undefined;
  to?: string;
  color?: string | undefined;
  dense?: boolean;
}>();

/**
 * Emits events used for component communication.
 */
const emits = defineEmits<{
  (event: 'click'): void;
}>();

/**
 * Computed variable that determines the appearance style of a component.
 *
 * This variable evaluates the `appearance` property from `props` and uses its value if provided.
 * If the `appearance` property is not specified, it defaults to the value 'push'.
 */
const _appearance = computed(() => props.appearance ?? 'push').value;
</script>
