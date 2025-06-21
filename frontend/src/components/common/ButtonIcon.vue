<template>
  <!-- Button -->
  <q-btn flat round :icon="icon" class="button-icon" @click="emits('click')">
    <q-tooltip v-if="tooltip">
      {{ tooltip }}
    </q-tooltip>
  </q-btn>
</template>

<style lang="scss">
@import 'src/css/quasar.variables';

.button-icon {
  color: $light-button-icon;
}

.body--dark .button-icon {
  color: $dark-button-icon;
}
</style>

<script setup lang="ts">
defineProps<{
  icon: string;
  tooltip?: string;
}>();

const emits = defineEmits<{
  (event: 'click'): void;
}>();
</script>
