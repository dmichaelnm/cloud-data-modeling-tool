import type * as dc from 'src/scripts/documents/Document';
import type { Account } from 'src/scripts/documents/model/Account';
import { FirebaseDocumentProvider } from 'src/scripts/documents/firebase/FirebaseDocumentProvider';

/**
 * Represents the result of an account registration process.
 *
 * This object contains details about the registered account and the status of its creation.
 */
export type TAccountRegisterResult = {
  account: Account;
  created: boolean;
};

/**
 * Provides an interface for managing documents and user accounts. This includes creating, retrieving documents,
 * and handling user registration and authentication.
 */
export interface IDocumentProvider {
  /**
   * Creates a new document of the specified type with the provided data.
   *
   * @param {dc.EDocumentType} type - The type of the document to be created.
   * @param {string | undefined} id - The unique identifier for the document. Can be undefined if
   *        the ID is to be auto-generated.
   * @param {D} data - The data associated with the document.
   * @param {dc.IDocument<dc.IDocumentData>} [parent] - The parent document, if applicable.
   * @return {Promise<dc.IDocument<D>>} A promise that resolves to the newly created document.
   */
  createDocument<D extends dc.IDocumentData>(
    type: dc.EDocumentType,
    id: string | undefined,
    data: D,
    parent?: dc.IDocument<dc.IDocumentData>,
  ): Promise<dc.IDocument<D>>;

  /**
   * Retrieves a document of the specified type and id. Optionally, the document can have a parent document.
   *
   * @param {dc.EDocumentType} type - The type of the document to retrieve.
   * @param {string} id - The unique identifier of the document.
   * @param {dc.IDocument<dc.IDocumentData>} [parent] - The parent document, if available.
   * @return {Promise<dc.IDocument<D> | null>} A promise that resolves to the requested document or null if not found.
   */
  getDocument<D extends dc.IDocumentData>(
    type: dc.EDocumentType,
    id: string,
    parent?: dc.IDocument<dc.IDocumentData>,
  ): Promise<dc.IDocument<D> | null>;

  /**
   * Registers a new user account using the provided email and password.
   *
   * @param {string} name - The full name of the user.
   * @param {string} email - The email address used for account registration.
   * @param {string} password - The password for the new account.
   * @param {string} languageCode - The preferred language code for the user (e.g., "en", "de").
   * @param {string} theme - The preferred theme for the user interface (e.g., "light", "dark").
   * @return {Promise<TAccountRegisterResult>} A promise that resolves with the result of the account
   *         registration process.
   */
  registerAccountWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
    languageCode: string,
    theme: string,
  ): Promise<TAccountRegisterResult>;

  /**
   * Registers a user account using Google authentication.
   *
   * @param {string} languageCode - The code representing the preferred language for the user during registration.
   * @param {string} theme - The visual theme to apply during the registration process.
   * @return {Promise<TAccountRegisterResult>} A promise that resolves to the result of the account registration process.
   */
  registerAccountWithGoogle(languageCode: string, theme: string): Promise<TAccountRegisterResult>;

  /**
   * Sends a password reset request for the specified email address.
   *
   * @param {string} email - The email address associated with the user's account.
   * @return {Promise<void>} A promise that resolves when the password reset request is processed.
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Authenticates a user using their email address and password.
   *
   * @param {string} email - The email address of the user attempting to log in.
   * @param {string} password - The password associated with the provided email address.
   * @return {Promise<void>} A promise that resolves once the login operation is successfully completed or
   * rejects with an error if the login fails.
   */
  loginWithEmailAndPassword(email: string, password: string): Promise<void>;

  /**
   * Authenticates the user using their Google account.
   *
   * This method initiates the OAuth 2.0 process to allow users to log in
   * with their Google credentials. It handles the authentication flow
   * and retrieves any necessary tokens or user information provided by
   * Google's authentication service.
   *
   * @return {Promise<void>} A promise that resolves with the email address of the user when the
   * login process is completed. The promise is rejected if the authentication fails or is canceled
   * by the user.
   */
  loginWithGoogle(): Promise<string>;

  /**
   * Registers a callback function to be invoked whenever the account state changes.
   * This can be used to listen to changes in the currently active account or when the user logs out.
   *
   * @param {function} callback - A function that will be called with the current account information.
   *                              If no account is active, the callback will receive `null`.
   * @return {void} Does not return a value.
   */
  onAccountStateChanged(callback: (account: Account | null) => void): void;
}

/**
 * Retrieves the document provider instance being used.
 *
 * @return {IDocumentProvider} The document provider instance.
 */
export function getDocumentProvider(): IDocumentProvider {
  return new FirebaseDocumentProvider();
}
