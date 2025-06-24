import type * as dp from 'src/scripts/documents/DocumentProvider';
import * as ac from 'src/scripts/documents/model/Account';
import * as dc from 'src/scripts/documents/Document';
import * as fs from 'firebase/firestore';
import * as au from 'firebase/auth';
import { fbAuth, fbFirestore } from 'src/scripts/documents/firebase/Firebase';
import { FirestoreDocument } from 'src/scripts/documents/firebase/FirestoreDocument';
import { FirebaseError } from 'firebase/app';
import { DocumentError } from 'src/scripts/documents/DocumentError';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';

/**
 * Provides an implementation for interacting with Firebase Firestore documents and managing
 * accounts, such as registering new accounts, authenticating, and performing CRUD operations
 * on documents. Implements the `dp.IDocumentProvider` interface.
 */
export class FirebaseDocumentProvider implements dp.IDocumentProvider {
  /**
   * Registers a callback to be invoked whenever the authentication state of the account changes.
   *
   * @param {function(ac.Account | null): void} callback - The function to be called with the
   *        updated account information or null if no account is authenticated.
   * @return {void} This method does not return a value.
   */
  onAccountStateChanged(callback: (account: ac.Account | null) => void): void {
    au.onAuthStateChanged(fbAuth, (user) => {
      if (user != null) {
        // Get the account document
        this.getDocument<ac.IAccountData>(dc.EDocumentType.Account, user.uid)
          .then((document) => {
            // Check if the document exists and has an active account state
            if (document && document.data.state.active) {
              // Create the account object
              const account = new ac.Account(document);
              // Invoke callback function
              callback(account);
            } else {
              // No account document
              callback(null);
            }
          })
          .catch((error: unknown) => {
            // Unexpected error, no account document
            console.error(error);
            callback(null);
          });
      } else {
        // No authenticated user
        callback(null);
      }
    });
  }

  /**
   * Registers a new account using an email and password and sets up the account with additional configurations.
   *
   * @param {string} name - The display name of the user to be set on the new account.
   * @param {string} email - The email address to be associated with the new account.
   * @param {string} password - The password to secure the new account.
   * @param {string} languageCode - The preferred language code for the account (e.g., "en", "de").
   * @param {string} theme - The theme preference for the account (e.g., "light", "dark").
   * @return {Promise<dp.TAccountRegisterResult>} A Promise that resolves to an object containing the registered
   *         account and a creation status.
   * @throws {Error} Throw an error if account registration fails or the process encounters an unexpected issue.
   */
  async registerAccountWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
    languageCode: string,
    theme: string,
  ): Promise<dp.TAccountRegisterResult> {
    try {
      const credentials = await au.createUserWithEmailAndPassword(fbAuth, email, password);
      await au.updateProfile(credentials.user, { displayName: name });
      const data = createAccountData(credentials, languageCode, theme);
      const document = await this.createDocument(
        dc.EDocumentType.Account,
        credentials.user.uid,
        data,
      );
      return { account: new ac.Account(document), created: true };
    } catch (error: unknown) {
      throw processError(error);
    }
  }

  /**
   * Registers an account using Google authentication. If an account does not exist for the user,
   * a new account is created with the provided `languageCode` and `theme`. If the account already exists,
   * it is updated with the Google display name.
   *
   * @param {string} languageCode - The preferred language code for the account (e.g., "en", "es").
   * @param {string} theme - The visual theme preference for the account (e.g., "dark", "light").
   * @return {Promise<dp.TAccountRegisterResult>} A promise that resolves with the account registration result,
   * including whether the account was newly created or already existed.
   * @throws {Error} Throws an error if there is an issue during authentication or account processing.
   */
  async registerAccountWithGoogle(
    languageCode: string,
    theme: string,
  ): Promise<dp.TAccountRegisterResult> {
    try {
      const authProvider = new au.GoogleAuthProvider();
      const credentials = await au.signInWithPopup(fbAuth, authProvider);
      const userId = credentials.user.uid;
      const accountDocument = await this.getDocument<ac.IAccountData>(
        dc.EDocumentType.Account,
        userId,
      );
      const data = createAccountData(credentials, languageCode, theme);
      if (accountDocument === null) {
        const document = await this.createDocument(dc.EDocumentType.Account, userId, data);
        return { account: new ac.Account(document), created: true };
      } else {
        accountDocument.data.user.name = credentials.user.displayName as string;
        await accountDocument.update();
        return { account: new ac.Account(accountDocument), created: false };
      }
    } catch (error: unknown) {
      throw processError(error);
    }
  }

  /**
   * Sends a password-reset email to the specified user.
   *
   * @param {string} email - The email address of the user requesting a password reset.
   * @return {Promise<void>} A promise that resolves when the password-reset email has been successfully sent.
   */
  async resetPassword(email: string): Promise<void> {
    await au.sendPasswordResetEmail(fbAuth, email);
  }

  /**
   * Authenticates a user using their email and password and validates the user's account status.
   *
   * @param {string} email - The email address of the user attempting to log in.
   * @param {string} password - The password associated with the provided email address.
   * @return {Promise<void>} A promise that resolves if the login is successful and the account is active or rejects
   *         with an error if the login fails or the account is inactive.
   * @throws {DocumentError} If the account document does not exist or if the account is not active.
   */
  async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
    try {
      // Sign in on Firebase
      const credentials = await au.signInWithEmailAndPassword(fbAuth, email, password);
      // Check credentials
      await processLogin(credentials.user.uid);
    } catch (error: unknown) {
      throw processError(error);
    }
  }

  /**
   * Authenticates a user using their Google account.
   * Opens a Google sign-in popup, retrieves user credentials, and processes the login.
   * Throws an error if the login process fails.
   *
   * @return {Promise<string>} A promise that resolves with the email address of the user when the
   *         login process is successfully completed.
   */
  async loginWithGoogle(): Promise<string> {
    try {
      // Authenticate with Google
      const authProvider = new au.GoogleAuthProvider();
      const credentials = await au.signInWithPopup(fbAuth, authProvider);
      // Check credentials
      await processLogin(credentials.user.uid);
      // Return email address
      return credentials.user.email as string;
    } catch (error: unknown) {
      throw processError(error);
    }
  }

  /**
   * Fetches and returns a document from Firestore based on the specified type, ID, and optional
   * parent document.
   *
   * @param {dc.EDocumentType} type - The type of document to retrieve.
   * @param {string} id - The unique identifier of the document to retrieve.
   * @param {dc.IDocument<dc.IDocumentData>} [parent] - An optional parent document to determine the
   *        context for retrieval.
   * @return {Promise<dc.IDocument<D> | null>} A promise that resolves to the fetched document of
   *         the specified type, or null if the document does not exist.
   */
  async getDocument<D extends dc.IDocumentData>(
    type: dc.EDocumentType,
    id: string,
    parent?: dc.IDocument<dc.IDocumentData>,
  ): Promise<dc.IDocument<D> | null> {
    const path = getFirestorePath(type, parent);
    const reference = fs.doc(fbFirestore, path, id);
    const snapshot = await fs.getDoc(reference);
    if (snapshot.exists()) {
      return new FirestoreDocument<D>({ snapshot: snapshot }, parent);
    }
    return null;
  }

  /**
   * Creates a new document of the specified type with the given data. If `id` is provided,
   * the document is created with the specified `id`. Otherwise, a new document ID is generated.
   * Optionally associates the document with a parent document.
   *
   * @param {dc.EDocumentType} type - The type of the document being created.
   * @param {string | undefined} id - The identifier for the document. If undefined, an ID is generated.
   * @param {D} data - The data to be stored in the document.
   * @param {dc.IDocument<dc.IDocumentData>} [parent] - Optional parent document to associate the created document with.
   * @return {Promise<dc.IDocument<D>>} A promise that resolves to the newly created document instance.
   * @throws {Error} If no authenticated user is found.
   */
  async createDocument<D extends dc.IDocumentData>(
    type: dc.EDocumentType,
    id: string | undefined,
    data: D,
    parent?: dc.IDocument<dc.IDocumentData>,
  ): Promise<dc.IDocument<D>> {
    const user = fbAuth.currentUser;
    if (!user) {
      throw new Error('No authenticated user.');
    }
    data.meta = {
      created: {
        uid: user.uid,
        name: user.displayName ?? user.uid,
        time: new Date(),
      },
    };
    const path = getFirestorePath(type, parent);
    if (id) {
      const reference = fs.doc(fbFirestore, path, id);
      await fs.setDoc(reference, data);
    } else {
      const reference = fs.collection(fbFirestore, path);
      await fs.addDoc(reference, data);
      id = reference.id;
    }
    return new FirestoreDocument(
      {
        path: path,
        id: id,
        data: data,
      },
      parent,
    );
  }
}

/**
 * Constructs the Firestore path for a given document type and optional parent document.
 *
 * @param {dc.EDocumentType} type - The type of the document.
 * @param {dc.IDocument<dc.IDocumentData>} [parent] - The optional parent document, if the document is nested.
 * @return {string} The Firestore path as a string.
 */
function getFirestorePath(type: dc.EDocumentType, parent?: dc.IDocument<dc.IDocumentData>): string {
  const fsParent = parent as FirestoreDocument<dc.IDocumentData>;
  return fsParent ? `${fsParent.path}/${type}` : `${type}`;
}

/**
 * Creates account data based on user credentials, language code, and theme.
 *
 * @param {au.UserCredential} credentials - User authentication credentials containing user information.
 * @param {string} languageCode - Preferred language code for the account.
 * @param {string} theme - Selected theme preference for the account.
 * @return {ac.IAccountData} An object containing user information, preferences, and initial account state.
 */
function createAccountData(
  credentials: au.UserCredential,
  languageCode: string,
  theme: string,
): ac.IAccountData {
  return {
    user: {
      id: credentials.user.uid,
      name: credentials.user.displayName as string,
      email: credentials.user.email as string,
    },
    preferences: {
      language: languageCode,
      theme: theme,
    },
    state: {
      active: false,
    },
  };
}

/**
 * Processes and normalizes an unknown error into a `DocumentError` object.
 *
 * @param {unknown} error - The error to process. It can be of any type, such as `DocumentError`,
 *                          `FirebaseError`, `Error`, `string`, or other unknown values.
 * @return {DocumentError} A `DocumentError` instance containing a standardized representation
 *                         of the error.
 */
function processError(error: unknown): DocumentError {
  if (error instanceof DocumentError) {
    return error;
  } else if (error instanceof FirebaseError) {
    return new DocumentError(error.code, error.message);
  } else if (error instanceof Error) {
    return new DocumentError('unexpected', error.message);
  } else if (typeof error === 'string') {
    return new DocumentError('unexpected', error);
  } else {
    return new DocumentError('unexpected', error?.toString() ?? 'Unknown error.');
  }
}

/**
 * Processes the login for a user by checking their account document and its status.
 *
 * @param {string} uid - The unique identifier of the user whose login is being processed.
 * @return {Promise<void>} A promise that resolves if the user account is active, or rejects with an error if the
 *         account is inactive or does not exist.
 */
async function processLogin(uid: string): Promise<void> {
  // Get provider
  const provider = getDocumentProvider();
  // Get the account document
  const document = await provider.getDocument<ac.IAccountData>(dc.EDocumentType.Account, uid);
  // Check if the account document exists
  if (document) {
    // Check if the account is unlocked
    if (document.data.state.active) {
      // Everything is okay
      return;
    }
    // Account is not active yet
    throw new DocumentError('auth/account-not-active', 'Account is not active yet.');
  }
  // No account document found
  throw new DocumentError('auth/no-account-document', 'No account document found for user.');
}
