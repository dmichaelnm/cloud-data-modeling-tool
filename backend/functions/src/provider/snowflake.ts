import * as sf from 'snowflake-sdk';
import * as gsm from '../gsm';
import {TCredentialsSnowflake, TErrorMessage} from '../types';

/**
 * Establishes a connection using the provided project ID, account, and username.
 * The method retrieves a private key associated with the project ID and uses it
 * to create a connection.
 *
 * @param {string} projectId - The identifier of the project for which the connection is being created.
 * @param {string} account - The account name associated with the connection.
 * @param {string} username - The username for the connection.
 * @return {Promise<sf.Connection>} A promise that resolves to the established connection object or rejects with an
 *         error.
 */
async function createConnection(
  projectId: string,
  account: string,
  username: string
): Promise<sf.Connection> {
  // Get the private key for the project
  let privateKey = await gsm.getSecret(`${projectId}-private-key`);
  // Check the private key
  if (privateKey === null) {
    // No private found
    throw new Error('Private key not found');
  }
  // Replace Prefix
  privateKey = privateKey.replace('-----BEGIN PRIVATE KEY-----', '');
  // Replace Suffix
  privateKey = privateKey.replace('-----END PRIVATE KEY-----', '');
  // Replace all line breaks
  privateKey = privateKey.replace(/\n/g, '');
  // Create the connection object
  const connection = sf.createConnection({
    account: account,
    username: username,
    privateKey: privateKey,
  });
  // Create and return a promise
  return new Promise((resolve, reject) => {
    // Try to establish the connection
    connection.connect((err, conn) => {
      if (err) {
        // An error has occurred, reject the promise
        reject(err);
      } else {
        // Connection successful, resolve the promise
        resolve(conn);
      }
    });
  });
}

/**
 * Disconnects the specified Snowflake connection by destroying it.
 *
 * @param {sf.Connection} connection - The Salesforce connection to be disconnected.
 * @return {Promise<void>} A promise that resolves when the connection is successfully destroyed or rejects with an
 *         error if the disconnection fails.
 */
async function disconnect(connection: sf.Connection): Promise<void> {
  // Create and return a promise
  return new Promise((resolve, reject) => {
    connection.destroy((err) => {
      if (err) {
        // An error has occurred, reject the promise
        reject(err);
      } else {
        // Connection successful, resolve the promise
        resolve();
      }
    });
  });
}

/**
 * Tests the connection to Snowflake with the provided credentials and project ID.
 *
 * @param {string} projectId - The identifier for the Snowflake project.
 * @param {TCredentialsSnowflake} credentials - The credential object containing Snowflake account and username
 *        information.
 * @return {Promise<string | null>} Returns null if the connection is successful, otherwise returns an error message.
 */
export async function testConnection(
  projectId: string,
  credentials: TCredentialsSnowflake
): Promise<string | null> {
  try {
    // Try to connect
    const connection = await createConnection(
      projectId,
      credentials.account,
      credentials.username
    );
    // Disconnect
    await disconnect(connection);
    // Connection was successful
    return null;
  } catch (error: unknown) {
    // Return the error message
    return (error as TErrorMessage).message || 'Unknown error occured.';
  }
}
