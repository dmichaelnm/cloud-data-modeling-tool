<template>
  <!-- Main DIV -->
  <div>
    <!-- Frame DIV -->
    <div id="authenticationFrame" class="frame">
      <!-- Application Title -->
      <div id="appTitle" class="frame-row text-center text-label">
        {{ $t('application.title') }}
      </div>
      <!-- Specific Frame Message -->
      <div class="frame-row" :style="`height: ${_messageHeight}`">
        {{ message }}
      </div>
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
    <!-- Copyright / Version DIV -->
    <div style="margin-top: 4px">
      <!-- Copyright / Version Row -->
      <div class="row">
        <!-- Copyright Column -->
        <div class="col-5">
          <!-- Copyright Notice -->
          <span class="text-small text-disabled" v-html="$t('application.copyright')" />
        </div>
        <!-- Version Column -->
        <div class="col-7 text-right text-small text-disabled">
          <!-- Version Info -->
          {{
            $t('application.version', {
              major: version.major,
              minor: version.minor,
              patch: version.patch,
              build: version.build,
            })
          }}
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
</style>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { version } from 'src/scripts/config/Version';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { useLanguageOptions } from 'src/scripts/composables/Options';
import ButtonIcon from 'components/common/ButtonIcon.vue';
import SelectValue from 'components/common/SelectValue.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();

/**
 * Function returning an array of possible languages.
 */
const languageOptions = useLanguageOptions();

/**
 * A reactive string variable that holds the code for the selected language.
 */
const languageCode = ref<string>('');

/**
 * Properties used in this component.
 */
const props = defineProps<{
  // Message to be displayed in the authentication frame
  message: string;
  // Height of the message row
  messageHeight?: number;
}>();

/**
 * Reactive computed property representing the height of a message.
 *
 * This computed property determines the height of a message based on the `props.messageHeight` value.
 * If `props.messageHeight` is defined, it returns the height as a string with a `px` unit appended.
 * Otherwise, it defaults to the string value `auto`, allowing the message height to adjust dynamically based on content.
 */
const _messageHeight = computed(() => (props.messageHeight ? `${props.messageHeight}px` : `auto`));

/**
 * A computed property that determines the icon to be displayed based on the dark mode state.
 * If dark mode is active, the icon will represent light mode ('o_light_mode').
 * If dark mode is inactive, the icon will represent dark mode ('o_dark_mode').
 */
const _darkModeIcon = computed(() => {
  return common.quasar.dark.isActive ? 'o_light_mode' : 'o_dark_mode';
});

/**
 * Lifecycle method that is called before this component is mounted.
 */
onBeforeMount(() => {
  languageCode.value = common.quasar.cookies.get('language') ?? getDefaultLanguageCode();
  common.i18n.locale.value = languageCode.value;
  common.quasar.dark.set(common.quasar.cookies.get('dark') === 'true');
});

/**
 * Toggles the dark mode setting for the application.
 * Updates the dark mode state in the Quasar framework and synchronizes the preference in cookies.
 *
 * @return {void} Does not return a value.
 */
function toggleDarkMode(): void {
  common.quasar.dark.set(!common.quasar.dark.isActive);
  common.quasar.cookies.set('dark', common.quasar.dark.isActive.toString(), { expires: 28 });
}

/**
 * Switches the application language by updating the locale value and saving the selected language
 * code in cookies.
 *
 * @return {void} Does not return a value.
 */
function switchLanguage(): void {
  common.i18n.locale.value = languageCode.value;
  common.quasar.cookies.set('language', languageCode.value, { expires: 28 });
}

/**
 * Retrieves the default language code based on the user's current language settings.
 * If a matching language code is not found, it defaults to 'en-US'.
 *
 * @return {string} The default language code.
 */
function getDefaultLanguageCode(): string {
  const options = languageOptions();
  const option = options.find((opt) => opt.value === navigator.language);
  return option?.value ?? 'en-US';
}
</script>
