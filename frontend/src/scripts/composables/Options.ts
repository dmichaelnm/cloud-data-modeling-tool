import { useCommonComposables } from 'src/scripts/composables/Common';
import { flagDE, flagUS } from 'quasar-extras-svg-icons/country-flag-icons';
import { EProjectRole } from 'src/scripts/documents/model/Project';
import { ECloudServiceProvider } from 'src/scripts/documents/model/CloudServiceProvider';

/**
 * Represents the position of a separator in a select option menu.
 *
 * Possible values:
 * - 'above': The separator is positioned above.
 * - 'below': The separator is positioned below.
 * - 'none': No separator is applied.
 * - 'both': The separator is positioned both above and below.
 */
export type TSeparatorPosition = 'above' | 'below' | 'none' | 'both';

/**
 * Represents an option in a select input.
 */
export type TSelectOption = {
  value: unknown;
  label: string;
  icon?: string;
  separator?: TSeparatorPosition;
};

/**
 * Provides a function that returns a list of language options for selection.
 *
 * The returned function generates an array of language option objects,
 * each containing a value, label, and icon property. The label text is localized
 * using the i18n translation utility.
 *
 * @return {function(): TSelectOption[]} A function that retrieves the language options as an array.
 */
export function useLanguageOptions(): () => TSelectOption[] {
  const common = useCommonComposables();
  return () => {
    return [
      { value: 'en-US', label: common.i18n.t('options.language.enUS'), icon: flagUS },
      { value: 'de-DE', label: common.i18n.t('options.language.deDE'), icon: flagDE },
    ];
  };
}

/**
 * Provides a function to retrieve a list of role options with their corresponding labels.
 * Role options include various project roles such as Maintainer, Deployer, Developer, and Visitor.
 *
 * @return {function(): TSelectOption[]} A function that returns an array of role options,
 * with each option containing a `value` representing the role and a `label` for display purposes.
 */
export function useRoleOptions(): () => TSelectOption[] {
  const common = useCommonComposables();
  return () => {
    return [
      { value: EProjectRole.Maintainer, label: common.i18n.t('options.projectRole.maintainer') },
      { value: EProjectRole.Deployer, label: common.i18n.t('options.projectRole.deployer') },
      { value: EProjectRole.Developer, label: common.i18n.t('options.projectRole.developer') },
      { value: EProjectRole.Visitor, label: common.i18n.t('options.projectRole.visitor') },
    ];
  };
}

/**
 * Provides a function that returns an array of options for custom attribute types.
 *
 * @return {function(): TSelectOption[]} A function that returns an array of custom attribute type options.
 */
export function useCustomAttributeTypeOptions(): () => TSelectOption[] {
  const common = useCommonComposables();
  return () => {
    return [
      { value: 'string', label: common.i18n.t('options.customAttributeType.string') },
      { value: 'number', label: common.i18n.t('options.customAttributeType.number') },
      { value: 'boolean', label: common.i18n.t('options.customAttributeType.boolean') },
    ];
  };
}

/**
 * Provides a function that returns an array of provider options.
 * Each option includes a value, label, and icon.
 *
 * @return {function(): TSelectOption[]} A function that, when called, returns a list of provider options with
 *         predefined values, labels, and icons.
 */
export function useProviderOptions(): () => TSelectOption[] {
  const common = useCommonComposables();
  return () => {
    return [
      {
        value: ECloudServiceProvider.AWS,
        label: common.i18n.t('options.provider.aws'),
        icon: 'img:icons/provider/aws.png',
      },
      {
        value: ECloudServiceProvider.GCP,
        label: common.i18n.t('options.provider.gcp'),
        icon: 'img:icons/provider/gcp.png',
      },
      {
        value: ECloudServiceProvider.Snowflake,
        label: common.i18n.t('options.provider.snowflake'),
        icon: 'img:icons/provider/snowflake.png',
      },
    ];
  };
}
