import {onRequest, Request} from 'firebase-functions/v2/https';
import {Response} from 'express';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

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
 * @param {function(admin.auth.DecodedIdToken): Promise<T>} task - A function that executes the desired task when a
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

export const test = onRequest(
  {region: region, cors: true},
  async (request, response) => {
    // Authorize the request
    await authorize<string>(request, response, (user) => {
      return user.email as string;
    });
  });
