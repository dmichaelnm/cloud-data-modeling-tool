import {SecretManagerServiceClient} from '@google-cloud/secret-manager';
import {gcpCredentials} from './provider/gcpSecret';
import {TErrorMessage} from './types';

/**
 * Adds a secret to the secret manager. Creates a new secret if it does not already exist
 * and then adds a new version of the secret with the provided payload.
 *
 * @param {string} secretId - The unique identifier for the secret to add or update.
 * @param {string} secretPayload - The actual secret data in string format to store.
 * @return {Promise<void>} A promise that resolves when the secret is successfully added or updated.
 */
export async function addSecret(secretId: string, secretPayload: string): Promise<void> {
  // Create the secret manager client
  const smClient = new SecretManagerServiceClient({credentials: gcpCredentials});
  // Check if there is already a secret
  if (await getSecret(secretId) === null) {
    // No secret found, it must be created first
    await smClient.createSecret({
      parent: `projects/${gcpCredentials.project_id}`,
      secretId: secretId,
      secret: {
        replication: {
          automatic: {},
        },
      },
    });
  }
  // Add the new version of the secret
  await smClient.addSecretVersion({
    parent: `projects/${gcpCredentials.project_id}/secrets/${secretId}`,
    payload: {
      data: Buffer.from(secretPayload, 'utf-8'),
    },
  });
}

/**
 * Retrieves the value of a secret from the Google Cloud Secret Manager service.
 *
 * @param {string} secretId - The ID of the secret to retrieve.
 * @return {Promise<string | null>} A promise that resolves to the secret value as a string if found, or null if
 *         the secret does not exist. Throws an error for other unexpected scenarios.
 */
export async function getSecret(secretId: string): Promise<string | null> {
  // Create the secret manager client
  const smClient = new SecretManagerServiceClient({credentials: gcpCredentials});
  try {
    // Try to get the public key for the project
    const [version] = await smClient.accessSecretVersion({
      name: `projects/${gcpCredentials.project_id}/secrets/${secretId}/versions/latest`,
    });
    // Return the secret
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return version.payload?.data?.toString('utf-8') ?? null;
  } catch (error: unknown) {
    const err = error as TErrorMessage;
    if (err.code === 5 || (err.code === 7 && err.details?.includes('NOT_FOUND'))) {
      // Secret not found
      return null;
    }
    // Other error
    throw error;
  }
}
