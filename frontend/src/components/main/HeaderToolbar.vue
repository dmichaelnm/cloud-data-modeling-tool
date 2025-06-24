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
      <q-menu anchor="bottom right" self="top right" style="width: 250px">
        <!-- Menu Item List -->
        <q-list>
          <!-- Dark Mode Menu Item -->
          <menu-item :label="_darkModeLabel" :icon="_darkModeIcon" @click="toggleDarkMode" />
          <!-- Language Selection Menu Item -->
          <menu-item :label="$t('main.account.menu.language')" icon="language" has-sub-menu>
            <!-- Sub Menu -->
            <q-menu anchor="top left" self="top right" style="width: 200px">
              <!-- Language List -->
              <q-list>
                <!-- Language Items -->
                <menu-item
                  v-for="lng in languageOptions()"
                  :key="lng.value"
                  :label="lng.label"
                  :icon="lng.icon"
                  @click="switchLanguage(lng.value)"
                />
              </q-list>
            </q-menu>
          </menu-item>
          <!-- Separator -->
          <q-separator />
          <!-- Logout Menu Item -->
          <menu-item :label="$t('main.account.menu.logout')" icon="logout" @click="logout" />
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

#accountAvatar {
  background-color: $light-button-label-background;
  color: $light-button-label-color;
}

.body--dark #accountAvatar {
  background-color: $dark-button-label-background;
  color: $dark-button-label-color;
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

.body--dark .header-toolbar {
  background-color: $dark-header-toolbar-background;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.9);
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';
import { useLanguageOptions } from 'src/scripts/composables/Options';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import MenuItem from 'components/common/MenuItem.vue';

/**
 * Function returning the most common composables like "router", "quasar", "i18n".
 */
const common = useCommonComposables();
/**
 * Function returning an array of possible languages.
 */
const languageOptions = useLanguageOptions();

/**
 * A computed property that returns the URL of the user's picture.
 */
const _pictureURL = computed(() => {
  // Get the account document
  const document = common.session.accountDocument;
  // Return picture URL
  return document ? (document.data.user.picture ?? '') : '';
});

/**
 * A computed property that retrieves the account name from the session's account document.
 * If the account document is not available or the username is not defined, it defaults to '?'.
 * The property dynamically updates whenever the account document changes.
 */
const _accountName = computed(() => {
  // Get the account document
  const document = common.session.accountDocument;
  // Return account name
  return document ? (document.data.user.name ?? '?') : '?';
});

/**
 * Computes the initials of the account name based on the user's name data from the account document.
 *
 * This variable uses a computed property to dynamically derive a string with up to the first two uppercase
 * initials of the user's name. If the name is unavailable or the document cannot be accessed, a fallback
 * character '?' is used.
 */
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

/**
 * A computed property that determines the label for the dark mode toggle
 * in the account menu based on the current theme state.
 */
const _darkModeLabel = computed(() => {
  return common.quasar.dark.isActive
    ? common.i18n.t('main.account.menu.lightMode')
    : common.i18n.t('main.account.menu.darkMode');
});

/**
 * A computed property that determines the icon to represent the current dark mode state.
 * Returns 'o_light_mode' if dark mode is active, otherwise returns 'o_dark_mode'.
 * The computed property dynamically reacts to changes in the dark mode state.
 */
const _darkModeIcon = computed(() => {
  return common.quasar.dark.isActive ? 'o_light_mode' : 'o_dark_mode';
});

/**
 * Toggles the application's dark mode setting between dark and light modes.
 * Updates the visual theme of the application, sets a persistent cookie for the dark mode state,
 * and synchronizes the user's theme preference with their account document if applicable.
 *
 * @return {Promise<void>} A promise that resolves when the dark mode toggling process is complete, including any
 *         update to the account document.
 */
async function toggleDarkMode(): Promise<void> {
  // Switch dark mode
  common.quasar.dark.set(!common.quasar.dark.isActive);
  // Set dark mode cookie
  common.quasar.cookies.set('dark', common.quasar.dark.isActive.toString(), { expires: 28 });
  // Update account document
  const document = common.session.accountDocument;
  if (document) {
    document.data.preferences.theme = common.quasar.dark.isActive ? 'dark' : 'light';
    await document.update();
  }
}

/**
 * Changes the application's language and updates relevant data accordingly.
 *
 * @param {string} languageCode - The language code to switch to (e.g., 'en', 'de').
 * @return {Promise<void>} A promise that resolves when the language switching process is completed.
 */
async function switchLanguage(languageCode: string): Promise<void> {
  // Switch language
  common.i18n.locale.value = languageCode;
  // Set language cookie
  common.quasar.cookies.set('language', languageCode, { expires: 28 });
  // Update account document
  const document = common.session.accountDocument;
  if (document) {
    document.data.preferences.language = languageCode;
    await document.update();
  }
}

/**
 * Logs out the current user by clearing the session and invoking
 * the logout functionality of the associated provider.
 *
 * @return {Promise<void>} A promise that resolves when the logout process is complete.
 */
async function logout(): Promise<void> {
  // Clear session
  common.session.clear();
  // Log out from the application
  const provider = getDocumentProvider();
  await provider.logout();
}
</script>
