import {onRequest, Request} from 'firebase-functions/v2/https';
import {generateKeyPairSync} from 'node:crypto';
import {Response} from 'express';
import {TKeyPairRequest} from './types';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';
import * as types from './types';
import * as aws from './provider/aws';
import * as gcp from './provider/gcp';
import * as sf from './provider/snowflake';
import * as gsm from './gsm';

/**
 * This variable specifies the geographical region setting
 * where the application or service is deployed or accessible.
 * Commonly used to configure cloud services or handle
 * location-specific settings.
 */
const region = 'europe-west1';

/**
 * Initializes Firebase
 */
admin.initializeApp();

/**
 * Handles the authorization of a request by verifying the provided token,
 * executing the specified task for an authenticated user, and sending the response.
 *
 * @param {Request} request - The HTTP request object containing headers and body.
 * @param {Response} response - The HTTP response object used to send back the response.
 * @param {function} task - A function that executes the desired task when a
 *        user is authenticated. Receives the decoded token as an argument and returns a promise.
 * @return {Promise<void>} A promise that resolves when the authorization and task execution are complete. Sends
 *         appropriate HTTP responses to the client.
 * @template T - The type of the result returned by the task handler.
 */
async function authorize<T>(
  request: Request,
  response: Response,
  task: (user: admin.auth.DecodedIdToken) => Promise<T> | T
): Promise<void> {
  // Get authorization token from the header
  let token = request.headers.authorization;
  // Check the existence of the header token
  if (token) {
    // Remove the token prefix
    token = token.startsWith('Bearer') ? token.substring(7) : token;
    try {
      // Decode the token
      const decodedIdToken = await admin.auth().verifyIdToken(token);
      // Log request body to console
      logger.debug(request.body);
      try {
        // Call the task handler
        const result = await task(decodedIdToken);
        // Send the result to the client
        response.send(result);
      } catch (error: unknown) {
        // Log the error
        logger.error(error);
        // Return internal server error
        response.status(500).send('Internal server error');
      }
    } catch (error: unknown) {
      // Log the error
      logger.error(error, token);
      // Return unauthorized response
      response.status(401).send('Unauthorized');
    }
  } else {
    // Log the missing token
    logger.error('Missing token');
    // Return unauthorized response
    response.status(401).send('Unauthorized');
  }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Retrieves or generates the public key associated with a specific project.
 *
 * This function handles requests for getting a public key by either fetching
 * an existing one from the secret manager or generating a new RSA key pair if
 * the key does not already exist. The new key pair is securely stored in a
 * secret manager with separate entries for the public and private keys.
 */
export const getProjectPublicKey = onRequest(
  {region: region, cors: true},
  async (request, response) => {
    // Authorize the request
    await authorize<string>(request, response, async () => {
      // Get request body
      const payload = request.body as TKeyPairRequest;
      // Get project ID
      const projectId = payload.projectId;
      // Try to get the public key for the project
      const secret = await gsm.getSecret(`${projectId}-public-key`);
      // Check if the public key was found
      let result: string;
      if (secret === null) {
        // Generate the key pair
        const {privateKey, publicKey} = generateKeyPairSync(
          'rsa',
          {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem',
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem',
            },
          });
        // Create the secret for the public key
        await gsm.addSecret(`${projectId}-public-key`, publicKey);
        // Create the secret for the private key
        await gsm.addSecret(`${projectId}-private-key`, privateKey);
        // Set the public key as the result
        result = publicKey;
      } else {
        // Apply public key
        result = secret;
      }
      // Return the public key
      return result;
    });
  });

// noinspection JSUnusedGlobalSymbols
/**
 * Handles a request to test the connection for a specified cloud provider.
 */
export const testConnection = onRequest(
  {region: region, cors: true},
  async (request, response) => {
    // Authorize the request
    await authorize(request, response, async () => {
      // Get request payload
      const payload = request.body as types.TProviderRequest;
      // Get provider from payload
      const provider = payload.provider;
      // The result
      let result: string | null = null;
      // Evaluate provider
      switch (provider) {
        case 'aws':
          // Amazon Web Service
          result = await aws.testConnection(payload.credentials as types.TCredentialsAWS);
          break;
        case 'gcp':
          // Google Cloud Platform
          result = await gcp.testConnection(payload.credentials as types.TCredentialsGCP);
          break;
        case 'snowflake':
          // Snowflake Database
          result = await sf.testConnection(payload.projectId, payload.credentials as types.TCredentialsSnowflake);
          break;
        default:
          // Unknown provider
          throw new Error(`Unknown provider: ${provider}`);
      }
      // Check the result
      if (result) {
        // Testing connection was not successful
        response.json({status: 'error', message: result});
      } else {
        // Testing connection was successful
        response.json({status: 'success'});
      }
    });
  });
