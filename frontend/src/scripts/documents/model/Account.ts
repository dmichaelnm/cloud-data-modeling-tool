import type { IDocumentData } from 'src/scripts/documents/Document';
import { ModelObject } from 'src/scripts/documents/ModelObject';

/**
 * Represents account data associated with a user, extending the properties of IDocumentData.
 */
export interface IAccountData extends IDocumentData {
  // User properties
  user: {
    // ID of the user
    id: string;
    // Email address of the user
    email: string;
    // Name of the user
    name: string;
    // Optional profile picture of the user
    picture: string | null;
  };
  // User preferences
  preferences: {
    // User language
    language: string;
    // Theme
    theme: string;
  };
  // State of the account
  state: {
    // Account is active or not
    active: boolean;
    // Timestamp of the last login
    lastLogin: Date | null;
    // ID of the last active project
    lastActiveProject: string | null;
  };
}

export class Account extends ModelObject<IAccountData> {

  /**
   * Generates the initials for a given account name by extracting the first letter of each word.
   * It combines the initials into a string and truncates to a maximum of two characters.
   *
   * @param accountName The full name of the account as a string.
   * @return A string containing up to two uppercase initials derived from the account name.
   */
  static getAccountInitials(accountName: string): string {
    // Splitting the name by spaces
    const nameParts = accountName.trim().split(/\s+/);
    // Get the first letter from each part and combine them
    const initials = nameParts.map((part) => part[0]?.toUpperCase()).join('');
    // Return the first to letters
    return initials.substring(0, Math.min(2, initials.length));
  }
}
