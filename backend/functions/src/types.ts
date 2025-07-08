/**
 * Represents an error message structure with optional properties for code, message, and details.
 */
export type TErrorMessage = {
  code?: number;
  message?: string;
  details?: string;
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
};

/**
 * Represents a set of credentials which could belong to one of the supported cloud service providers or platforms.
 * This is a union type that combines specific credential types for GCP, AWS, or Snowflake, allowing flexibility
 * in handling various authentication mechanisms based on the selected provider/platform.
 */
export type TCredentials = TCredentialsGCP | TCredentialsAWS | TCredentialsSnowflake;

/**
 * Represents a request object containing provider details and credentials.
 */
export type TProviderRequest = {
  projectId: string;
  provider: string;
  credentials: TCredentials;
};

/**
 * TKeyPairRequest represents the structure of a request to generate or manage a key pair within a specific project.
 */
export type TKeyPairRequest = {
  projectId: string;
}
