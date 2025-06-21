import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

export function useCommonComposables() {
  return {
    i18n: useI18n(),
    quasar: useQuasar(),
    router: useRouter(),
  };
}
