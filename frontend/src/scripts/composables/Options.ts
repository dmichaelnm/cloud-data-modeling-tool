import { useCommonComposables } from 'src/scripts/composables/Common';
import { EProjectRole } from 'src/scripts/documents/model/Project';
import { ECloudServiceProvider } from 'src/scripts/documents/model/CloudServiceProvider';
import * as flag from 'quasar-extras-svg-icons/country-flag-icons';

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
      { value: 'en-US', label: common.i18n.t('options.language.enUS'), icon: flag.flagUS },
      { value: 'de-DE', label: common.i18n.t('options.language.deDE'), icon: flag.flagDE },
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

/**
 * Provides a function to retrieve a list of AWS regions with their respective metadata, such as value, label, and icon.
 *
 * @return {function(): TSelectOption[]} A function that returns an array of options where each option represents an
 *         AWS region, containing a value, a label, and optionally an icon.
 */
export function useAWSRegions(): () => TSelectOption[] {
  const common = useCommonComposables();
  return () => {
    return [
      {
        value: 'us-east-1',
        label: common.i18n.t('options.aws.region.usEast1'),
        icon: flag.flagUS,
      },
      {
        value: 'us-east-2',
        label: common.i18n.t('options.aws.region.usEast2'),
        icon: flag.flagUS,
      },
      {
        value: 'us-west-1',
        label: common.i18n.t('options.aws.region.usWest1'),
        icon: flag.flagUS,
      },
      {
        value: 'us-west-2',
        label: common.i18n.t('options.aws.region.usWest2'),
        icon: flag.flagUS,
      },
      {
        value: 'af-south-1',
        label: common.i18n.t('options.aws.region.afSouth1'),
        icon: flag.flagZA,
      },
      {
        value: 'ap-east-1',
        label: common.i18n.t('options.aws.region.apEast1'),
        icon: flag.flagHK,
      },
      {
        value: 'ap-south-1',
        label: common.i18n.t('options.aws.region.apSouth1'),
        icon: flag.flagIN,
      },
      {
        value: 'ap-south-2',
        label: common.i18n.t('options.aws.region.apSouth2'),
        icon: flag.flagIN,
      },
      {
        value: 'ap-northeast-1',
        label: common.i18n.t('options.aws.region.apNortheast1'),
        icon: flag.flagJP,
      },
      {
        value: 'ap-northeast-2',
        label: common.i18n.t('options.aws.region.apNortheast2'),
      },
      {
        value: 'ap-northeast-3',
        label: common.i18n.t('options.aws.region.apNortheast3'),
        icon: flag.flagJP,
      },
      {
        value: 'ap-southeast-1',
        label: common.i18n.t('options.aws.region.apSoutheast1'),
        icon: flag.flagSG,
      },
      {
        value: 'ap-southeast-2',
        label: common.i18n.t('options.aws.region.apSoutheast2'),
        icon: flag.flagAU,
      },
      {
        value: 'ap-southeast-3',
        label: common.i18n.t('options.aws.region.apSoutheast3'),
        icon: flag.flagID,
      },
      {
        value: 'ca-central-1',
        label: common.i18n.t('options.aws.region.caCentral1'),
        icon: flag.flagCA,
      },
      {
        value: 'cn-north-1',
        label: common.i18n.t('options.aws.region.cnNorth1'),
        icon: flag.flagCN,
      },
      {
        value: 'cn-northwest-1',
        label: common.i18n.t('options.aws.region.cnNorthwest1'),
        icon: flag.flagCN,
      },
      {
        value: 'eu-central-1',
        label: common.i18n.t('options.aws.region.euCentral1'),
        icon: flag.flagDE,
      },
      {
        value: 'eu-central-2',
        label: common.i18n.t('options.aws.region.euCentral2'),
        icon: flag.flagCH,
      },
      {
        value: 'eu-north-1',
        label: common.i18n.t('options.aws.region.euNorth1'),
        icon: flag.flagSE,
      },
      {
        value: 'eu-west-1',
        label: common.i18n.t('options.aws.region.euWest1'),
        icon: flag.flagIE,
      },
      {
        value: 'eu-west-2',
        label: common.i18n.t('options.aws.region.euWest2'),
        icon: flag.flagGB,
      },
      {
        value: 'eu-west-3',
        label: common.i18n.t('options.aws.region.euWest3'),
        icon: flag.flagFR,
      },
      {
        value: 'eu-south-1',
        label: common.i18n.t('options.aws.region.euSouth1'),
        icon: flag.flagIT,
      },
      {
        value: 'eu-south-2',
        label: common.i18n.t('options.aws.region.euSouth2'),
        icon: flag.flagES,
      },
      {
        value: 'me-south-1',
        label: common.i18n.t('options.aws.region.meSouth1'),
        icon: flag.flagBH,
      },
      {
        value: 'me-central-1',
        label: common.i18n.t('options.aws.region.meCentral1'),
        icon: flag.flagAE,
      },
      {
        value: 'sa-east-1',
        label: common.i18n.t('options.aws.region.saEast1'),
        icon: flag.flagBR,
      },
      {
        value: 'us-gov-east-1',
        label: common.i18n.t('options.aws.region.usGovEast1'),
        icon: flag.flagUS,
      },
      {
        value: 'us-gov-west-1',
        label: common.i18n.t('options.aws.region.usGovWest1'),
        icon: flag.flagUS,
      },
    ];
  };
}
