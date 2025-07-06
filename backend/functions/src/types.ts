/**
 * Represents an error message with a descriptive text.
 *
 * This type is used to encapsulate error information in a structured format,
 * primarily consisting of a single string message. It helps standardize
 * error handling and reporting across systems or components.
 */
export type TErrorMessage = {
  message: string;
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
 * Represents a request object containing provider details and credentials.
 */
export type TRequest = {
  provider: string;
  credentials: TCredentials;
};
