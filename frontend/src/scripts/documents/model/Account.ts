import type { IDocumentData } from 'src/scripts/documents/Document';
import { ModelObject } from 'src/scripts/documents/ModelObject';

export interface IAccountData extends IDocumentData {
  user: {
    id: string;
    email: string;
    name: string;
    picture: string | null;
  };
  preferences: {
    language: string;
    theme: string;
  };
  state: {
    active: boolean;
    lastLogin: Date | null;
  };
}

export class Account extends ModelObject<IAccountData> {}

