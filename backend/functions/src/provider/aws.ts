import {TCredentialsAWS, TErrorMessage} from '../types';
import {AssumeRoleCommand, AssumeRoleCommandOutput, STSClient} from '@aws-sdk/client-sts';
import {awsCredentials} from './awsSecret';

/**
 * TImpersonatedCredentials represents the structure for AWS impersonated credentials.
 *
 * This type is typically used to store credential details for an impersonated AWS user session.
 * It includes fields to hold an access key ID, a secret access key, and a session token.
 */
type TImpersonatedCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

/**
 * Assumes an AWS IAM role by using the provided credentials and role details.
 *
 * @param {string} region - The AWS region where the role exists.
 * @param {string} roleARN - The Amazon Resource Name (ARN) of the role to assume.
 * @param {string} sessionName - A name for the session used to uniquely identify it.
 * @param {string} accessKeyId - The access key ID of the AWS credentials.
 * @param {string} secretAccessKey - The secret access key of the AWS credentials.
 * @param {string} sessionToken - The session token.
 * @return {Promise<AssumeRoleCommandOutput>} A promise that resolves to the result of the AssumeRole command.
 */
async function assumeRole(
  region: string,
  roleARN: string,
  sessionName: string,
  accessKeyId: string,
  secretAccessKey: string,
  sessionToken?: string,
): Promise<AssumeRoleCommandOutput> {
  // Create the STS client
  const client = new STSClient({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken,
    },
  });
  // Create the command to assume a role
  const assumedRoleCommand = new AssumeRoleCommand({
    RoleArn: roleARN,
    RoleSessionName: sessionName,
    DurationSeconds: 900,
  });
  // Execute the command and return the result.
  return await client.send(assumedRoleCommand);
}

/**
 * Generates impersonated AWS credentials by assuming the specified IAM role.
 *
 * @param {TCredentialsAWS} credentials - The AWS credentials including the IAM Role ARN to assume.
 * @return {Promise<TImpersonatedCredentials | undefined>} A promise that resolves to the impersonated credentials
 *         if successfully assumed, or undefined if impersonation fails.
 */
async function getImpersonatedCredentials(credentials: TCredentialsAWS): Promise<TImpersonatedCredentials | undefined> {
  // Assuming the own role
  const ownRole = await assumeRole(
    awsCredentials.region,
    awsCredentials.role,
    'cloudamoOwnRoleImpersonation',
    awsCredentials.accessKeyId,
    awsCredentials.secretAccessKey,
  );
  // Check the own role
  if (ownRole.Credentials) {
    // Assuming the user role
    const userRole = await assumeRole(
      credentials.region,
      credentials.iamRoleARN,
      'cloudamoUserRoleImpersonation',
      ownRole.Credentials.AccessKeyId as string,
      ownRole.Credentials.SecretAccessKey as string,
      ownRole.Credentials.SessionToken as string,
    );
    // Check the user role
    if (userRole.Credentials) {
      // Return impersonation credentials
      return {
        accessKeyId: userRole.Credentials.AccessKeyId as string,
        secretAccessKey: userRole.Credentials.SecretAccessKey as string,
        sessionToken: userRole.Credentials.SessionToken as string,
      };
    }
  }
  // Impersonation has failed
  return undefined;
}

/**
 * Tests the AWS connection using the provided credentials.
 *
 * @param {TCredentialsAWS} credentials - The AWS credentials used for impersonation and validation.
 * @return {Promise<string | null>} A promise that resolves to a string containing an error message if the connection
 *         test fails, or null if the connection is successful.
 */
export async function testConnection(credentials: TCredentialsAWS): Promise<string | null> {
  try {
    // Try to impersonate
    const result = await getImpersonatedCredentials(credentials);
    // Check credentials
    if (!result) {
      return 'Failed to impersonate.';
    }
    // Everything is okay
    return null;
  } catch (error: unknown) {
    // Return the error message
    return (error as TErrorMessage).message || 'Unknown error occured.';
  }
}
