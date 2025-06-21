import type { IDocumentProvider } from 'src/scripts/documents/DocumentProvider';
import type { Account } from 'src/scripts/documents/model/Account';
import type * as dc from 'src/scripts/documents/Document';
import * as fs from 'firebase/firestore';
import * as au from 'firebase/auth';
import { fbAuth, fbFirestore } from 'src/scripts/documents/firebase/Firebase';
import { FirestoreDocument } from 'src/scripts/documents/firebase/FirestoreDocument';

export class FirebaseDocumentProvider implements IDocumentProvider {
  onAccountStateChanged(callback: (account: Account | null) => void) {
    au.onAuthStateChanged(fbAuth, (user) => {
      console.debug('FirebaseDocumentProvider.onAccountStateChanged', user);
      callback(null);
    });
  }

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
    const fsParent = parent as FirestoreDocument<D>;
    const path = fsParent ? `${fsParent.path}/${type}` : `${type}`;
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
