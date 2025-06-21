import type * as dc from 'src/scripts/documents/Document';
import type { Account } from 'src/scripts/documents/model/Account';
import { FirebaseDocumentProvider } from 'src/scripts/documents/firebase/FirebaseDocumentProvider';

export interface IDocumentProvider {
  createDocument<D extends dc.IDocumentData>(
    type: dc.EDocumentType,
    id: string | undefined,
    data: D,
    parent?: dc.IDocument<dc.IDocumentData>,
  ): Promise<dc.IDocument<D>>;

  onAccountStateChanged(callback: (account: Account | null) => void): void;
}

export function getDocumentProvider(): IDocumentProvider {
  return new FirebaseDocumentProvider();
}
