import {TCredentialsGCP, TErrorMessage} from '../types';
import {GoogleAuth} from 'google-auth-library';
import {gcpCredentials} from './gcpSecret';

/**
 * Represents the result of a token generation process.
 *
 * This type is used to hold the access token issued during
 * an authentication or authorization process.
 */
type TTokenResult = {
  accessToken: string;
}

/**
 * Generates an impersonated access token for a given service account using the provided credentials.
 *
 * @param {TCredentialsGCP} credentials - The credentials for Google Cloud, including the service account email.
 * @return {Promise<string | undefined>} A promise that resolves to the generated access token or undefined if the
 *         token could not be retrieved.
 */
async function getImpersonatedToken(credentials: TCredentialsGCP): Promise<string | undefined> {
  // Defined Scopes
  const scopes = [
    'https://www.googleapis.com/auth/devstorage.read_write',
    'https://www.googleapis.com/auth/bigquery',
  ];
  // Create the authentication client
  const authClient = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    credentials: gcpCredentials,
  });
  // Create the request client
  const client = await authClient.getClient();
  // Build request URL
  const requestUrl = 'https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/' +
    `${credentials.serviceAccount}:generateAccessToken`;
  // Make the request
  const response = await client.request({
    url: requestUrl,
    method: 'POST',
    data: {
      scope: scopes,
      lifetime: '3600s',
    },
  });
  // Check the response and return the token
  if (response.data) {
    return (response.data as TTokenResult).accessToken;
  }
  // No token retrieved
  return undefined;
}

/**
 * Tests the connection to a GCP service using the provided credentials.
 * Attempts to retrieve an impersonated access token and checks its validity.
 *
 * @param {TCredentialsGCP} credentials - The GCP service account credentials to use for testing the connection.
 * @return {Promise<string | null>} A promise that resolves to an error message if the connection fails,
 * or null if the connection is successful.
 */
export async function testConnection(credentials: TCredentialsGCP): Promise<string | null> {
  try {
    // Try to get a token
    const token = await getImpersonatedToken(credentials);
    // Check the token
    if (!token) {
      return 'Failed to retrieve an impersonated access token.';
    }
    // Everything is okay
    return null;
  } catch (error: unknown) {
    // Return the error message
    return (error as TErrorMessage).message || 'Unknown error occured.';
  }
}
