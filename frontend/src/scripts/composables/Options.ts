import { useCommonComposables } from 'src/scripts/composables/Common';
import { flagDE, flagUS } from 'quasar-extras-svg-icons/country-flag-icons';

export type TSeparatorPosition = 'above' | 'below' | 'none' | 'both';

export type TSelectOption = {
  value: string;
  label: string;
  icon?: string;
  separator?: TSeparatorPosition;
};

export function useLanguageOptions(): () => TSelectOption[] {
  const common = useCommonComposables();
  return () => {
    return [
      { value: 'en-US', label: common.i18n.t('options.language.enUS'), icon: flagUS },
      { value: 'de-DE', label: common.i18n.t('options.language.deDE'), icon: flagDE },
    ];
  };
}
