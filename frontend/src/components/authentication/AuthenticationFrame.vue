<template>
  <!-- Frame DIV -->
  <div id="authenticationFrame" class="frame">
    <!-- Application Title -->
    <div id="appTitle" class="frame-row text-center text-label">{{ $t('application.title') }}</div>
    <!-- Specific Frame Message -->
    <div id="authenticationMessage" class="frame-row">{{ message }}</div>
    <!-- Page Content DIV -->
    <div class="frame-row">
      <!-- Page Content Scope -->
      <slot />
    </div>
    <!-- Frame Options -->
    <div class="frame-row">
      <!-- Frame Options Row -->
      <div class="row">
        <!-- Dark Mode Column -->
        <div class="col">
          <!-- Dark Mode Button -->
          <button-icon :icon="_darkModeIcon" @click="toggleDarkMode" />
        </div>
        <!-- Language Column -->
        <div class="col">
          <!-- Select Language -->
          <select-value
            v-model="languageCode"
            :options="languageOptions()"
            borderless
            @update:modelValue="switchLanguage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

#appTitle {
  font-variant: small-caps;
  font-size: 24pt;
  font-weight: bold;
}

#authenticationFrame {
  width: 500px;
}

#authenticationMessage {
  height: 130px;
}
</style>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import ButtonIcon from 'components/common/ButtonIcon.vue';
import SelectValue from 'components/common/SelectValue.vue';
import { useLanguageOptions } from 'src/scripts/composables/Options';

const common = useCommonComposables();
const languageOptions = useLanguageOptions();

const languageCode = ref<string>('');

defineProps<{
  message: string;
}>();

const _darkModeIcon = computed(() => {
  return common.quasar.dark.isActive ? 'o_light_mode' : 'o_dark_mode';
});

onBeforeMount(() => {
  languageCode.value = common.quasar.cookies.get('language') ?? getDefaultLanguageCode();
  common.i18n.locale.value = languageCode.value;
  common.quasar.dark.set(common.quasar.cookies.get('dark') === 'true');
});

function toggleDarkMode(): void {
  common.quasar.dark.set(!common.quasar.dark.isActive);
  common.quasar.cookies.set('dark', common.quasar.dark.isActive.toString());
}

function switchLanguage(): void {
  common.i18n.locale.value = languageCode.value;
  common.quasar.cookies.set('language', languageCode.value);
}

function getDefaultLanguageCode(): string {
  const options = languageOptions();
  const option = options.find((opt) => opt.value === navigator.language);
  return option?.value ?? 'en-US';
}
</script>
