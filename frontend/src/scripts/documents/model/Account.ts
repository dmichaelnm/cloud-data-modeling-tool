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
  };
}

export class Account extends ModelObject<IAccountData> {

  /**
   * Extracts and returns the initials of the account name from the user data.
   * The initials are derived from the first letters of the name parts, split by spaces,
   * and are converted to uppercase. The method returns up to two initials.
   *
   * @return {string} The initials of the account name, up to two characters long.
   */
  getAccountInitials(): string {
    // Get account name
    const name = this.document.data.user.name;
    // Splitting the name by spaces
    const nameParts = name.trim().split(/\s+/);
    // Get the first letter from each part and combine them
    const initials = nameParts.map((part) => part[0]?.toUpperCase()).join('');
    // Return the first to letters
    return initials.substring(0, Math.min(2, initials.length));
  }
}
