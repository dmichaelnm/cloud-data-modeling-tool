<template>
  <!-- Footer DIV -->
  <div class="footer-line text-small text-normal">
    <!-- Footer Row -->
    <div class="row">
      <!-- Left Footer -->
      <div class="col-4">
        <!-- Copyright Notice -->
        <span v-html="$t('application.copyright')" />
      </div>
      <!-- Center Footer -->
      <div class="col-4 text-center"></div>
      <!-- Right Footer -->
      <div class="col-4 text-right">
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
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables';

.footer-line {
  background-color: $light-body-background;
  padding: 4px 8px;
}

.body--dark .footer-line {
  background-color: $dark-body-background;
}

</style>

<script setup lang="ts">
import { version } from 'src/scripts/config/Version';
</script>
