import type * as dc from 'src/scripts/documents/Document';
import * as fs from 'firebase/firestore';
import { fbAuth, fbFirestore } from 'src/scripts/documents/firebase/Firebase';

export type TFirestoreDocumentConfig<D extends dc.IDocumentData> = {
  id?: string;
  path?: string;
  data?: D;
  reference?: fs.DocumentReference;
  snapshot?: fs.DocumentSnapshot;
  document?: FirestoreDocument<D>;
};

export class FirestoreDocument<D extends dc.IDocumentData> implements dc.IDocument<D> {
  type: dc.EDocumentType;
  id: string;
  path: string;
  data: D;
  parent?: dc.IDocument<dc.IDocumentData> | undefined;
  documents: Map<dc.EDocumentType, Map<string, dc.IDocument<dc.IDocumentData>>>;

  constructor(config: TFirestoreDocumentConfig<D>, parent?: dc.IDocument<dc.IDocumentData>) {
    if (config.id && config.path && config.data) {
      this.id = config.id;
      this.path = config.path;
      this.data = config.data;
      this.type = getTypeFromPath(this.path);
      this.documents = new Map();
    } else if (config.reference && config.data) {
      this.id = config.reference.id;
      this.path = getPathFromReference(config.reference);
      this.data = config.data;
      this.type = getTypeFromPath(this.path);
      this.documents = new Map();
    } else if (config.snapshot) {
      this.id = config.snapshot.id;
      this.path = getPathFromReference(config.snapshot.ref);
      this.data = config.snapshot.data() as D;
      this.type = getTypeFromPath(this.path);
      this.documents = new Map();
    } else if (config.document) {
      this.id = config.document.id;
      this.path = config.document.path;
      this.data = config.document.data;
      this.type = config.document.type;
      this.documents = config.document.documents;
    } else {
      throw new Error('Invalid firestore document configuration object.');
    }
    this.parent = parent;
    if (this.data.meta?.created) {
      const timestamp  = this.data.meta.created.time as unknown as fs.Timestamp;
      this.data.meta.created.time = timestamp.toDate();
    }
    if (this.data.meta?.altered) {
      const timestamp  = this.data.meta.altered.time as unknown as fs.Timestamp;
      this.data.meta.altered.time = timestamp.toDate();
    }
  }

  addDocument(document: dc.IDocument<dc.IDocumentData>) {
    let typeMap = this.documents.get(document.type);
    if (!typeMap) {
      typeMap = new Map();
      this.documents.set(document.type, typeMap);
    }
    typeMap.set(document.id, document);
    document.parent = this as unknown as dc.IDocument<dc.IDocumentData>;
  }

  findDocument(
    id: string,
    deepSearch: boolean = false,
  ): dc.IDocument<dc.IDocumentData> | undefined {
    for (const typeMap of this.documents.values()) {
      for (const document of typeMap.values()) {
        if (document.id === id) {
          return document;
        } else if (deepSearch) {
          const found = document.findDocument(id, deepSearch);
          if (found) {
            return found;
          }
        }
      }
    }
    return undefined;
  }

  getDocument(type: dc.EDocumentType, id: string): dc.IDocument<dc.IDocumentData> | undefined {
    const typeMap = this.documents.get(type);
    if (typeMap) {
      return typeMap.get(id);
    }
    return undefined;
  }

  getDocuments(type: dc.EDocumentType): dc.IDocument<dc.IDocumentData>[] {
    const typeMap = this.documents.get(type);
    if (typeMap) {
      return Array.from(typeMap.values());
    }
    return [];
  }

  removeDocument(type: dc.EDocumentType, id: string) {
    const typeMap = this.documents.get(type);
    if (typeMap) {
      const document = typeMap.get(id);
      if (document) {
        document.parent = undefined;
        typeMap.delete(id);
      }
    }
  }

  async delete(): Promise<void> {
    if (await this.onBeforeDelete()) {
      const reference = fs.doc(fbFirestore, this.path, this.id);
      await fs.deleteDoc(reference);
    }
  }

  onBeforeDelete(): boolean | Promise<boolean> {
    return true;
  }

  async update(): Promise<void> {
    if (this.onBeforeUpdate()) {
      if (this.data.meta) {
        this.data.meta.altered = {
          uid: fbAuth.currentUser?.uid as string,
          name: fbAuth.currentUser?.displayName as string,
          time: new Date(),
        };
      }
      const reference = fs.doc(fbFirestore, this.path, this.id);
      await fs.updateDoc(reference, this.data as never);
    }
  }

  onBeforeUpdate(): boolean | Promise<boolean> {
    return true;
  }
}

function getPathFromReference(reference: fs.DocumentReference): string {
  const segments = reference.path.split('/');
  return segments.splice(0, segments.length - 1).join('/');
}

function getTypeFromPath(path: string): dc.EDocumentType {
  const segments = path.split('/');
  const typeName = segments[segments.length - 1];
  return typeName as unknown as dc.EDocumentType;
}
