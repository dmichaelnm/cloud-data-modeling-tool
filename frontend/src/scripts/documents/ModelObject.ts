import type { IDocument, IDocumentData } from 'src/scripts/documents/Document';

export class ModelObject<D extends IDocumentData> {
  document: IDocument<D>;

  constructor(document: IDocument<D>) {
    this.document = document;
  }
}
