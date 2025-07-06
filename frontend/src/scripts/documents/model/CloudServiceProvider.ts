import { EditorData, IProjectDocumentData } from 'src/scripts/documents/Document';
import { ModelObject } from 'src/scripts/documents/ModelObject';

/**
 * Enum representing various cloud service providers.
 *
 * This enum is used to standardize the identification of supported cloud service providers
 * within the context of the application. Each enum value corresponds to a specific provider.
 */
export enum ECloudServiceProvider {
  // Amazon Web Service
  AWS = 'aws',
  // Google Cloud Platform
  GCP = 'gcp',
  // Snowflake Database
  Snowflake = 'snowflake',
}

/**
 * Represents the credential configuration for accessing AWS resources.
 */
export type TCredentialsAWS = {
  iamRoleARN: string;
  region: string;
};

/**
 * Represents the credentials required to authenticate with Google Cloud Platform (GCP).
 */
export type TCredentialsGCP = {
  serviceAccount: string;
};

/**
 * Represents the credentials required to connect to a Snowflake database.
 */
export type TCredentialsSnowflake = {
  account: string;
  username: string;
  password: string;
};

/**
 * Represents a set of credentials which could belong to one of the supported cloud service providers or platforms.
 * This is a union type that combines specific credential types for GCP, AWS, or Snowflake, allowing flexibility
 * in handling various authentication mechanisms based on the selected provider/platform.
 */
export type TCredentials = TCredentialsGCP | TCredentialsAWS | TCredentialsSnowflake;

/**
 * Represents the data structure for cloud service provider details related to a project.
 *
 * This interface extends the base project document data and includes additional properties
 * specifically related to the cloud service provider used in a project.
 */
export interface ICloudServiceProviderData extends IProjectDocumentData {
  provider: ECloudServiceProvider;
  credentials: TCredentials;
}

/**
 * Represents a cloud service provider, inheriting the core structure and behavior
 * from the ModelObject class. This class is designed to handle cloud-specific
 * service provider data and functionality.
 */
export class CloudServiceProvider extends ModelObject<ICloudServiceProviderData> {}

/**
 * Represents the editor data for a cloud service provider.
 * This class extends the EditorData class and manages initialization
 * and updating of cloud service provider data.
 */
export class CloudServiceProviderEditorData extends EditorData<ICloudServiceProviderData> {
  /**
   * Initializes cloud provider data by assigning the provider field based on the current document context.
   * If a document context exists, it assigns the provider from the document data.
   * Otherwise, it defaults the provider to AWS.
   *
   * @param {ICloudServiceProviderData} data - The cloud service provider data object to initialize.
   * @return {void}
   */
  initData(data: ICloudServiceProviderData): void {
    if (this.document) {
      data.provider = this.document.data.provider;
      data.credentials = this.document.data.credentials;
    } else {
      data.provider = ECloudServiceProvider.AWS;
      data.credentials = {
        iamRoleARN: '',
        region: 'eu-central-1',
      } as TCredentialsAWS;
    }
  }

  /**
   * Updates the given document data with the provider and credential information from the current instance.
   *
   * @param {ICloudServiceProviderData} documentData - The document data object that will be updated with provider
   *        and credentials information.
   * @return {void} This method does not return any value.
   */
  updateDocumentData(documentData: ICloudServiceProviderData): void {
    documentData.provider = this.data.provider;
    documentData.credentials = this.data.credentials;
  }
}
