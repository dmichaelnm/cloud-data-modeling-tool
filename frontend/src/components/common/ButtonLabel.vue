<template>
  <!-- Button -->
  <q-btn
    :label="label"
    :type="type"
    :push="_appearance === 'push'"
    :flat="_appearance === 'link'"
    :class="`button-label button-label-${_appearance}`"
    no-caps
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

const props = defineProps<{
  label: string;
  type?: 'button' | 'submit' | 'reset';
  appearance?: 'push' | 'link';
}>();

const _appearance = computed(() => props.appearance ?? 'push').value;
</script>
