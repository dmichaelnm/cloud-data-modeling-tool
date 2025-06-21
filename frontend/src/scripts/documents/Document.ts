export enum EDocumentType {}

export type TDocumentInfo = {
  uid: string;
  name: string;
  time: Date;
};

export type TMetaData = {
  created: TDocumentInfo;
  altered?: TDocumentInfo;
};

export interface IDocumentData {
  meta?: TMetaData;
}

export interface IDocument<D extends IDocumentData> {
  type: EDocumentType;
  id: string;
  data: D;
  parent?: IDocument<IDocumentData> | undefined;

  addDocument(document: IDocument<IDocumentData>): void;

  delete(): Promise<void>;

  findDocument(id: string, deepSearch: boolean): IDocument<IDocumentData> | undefined;

  getDocument(type: EDocumentType, id: string): IDocument<IDocumentData> | undefined;

  getDocuments(type: EDocumentType): IDocument<IDocumentData>[];

  onBeforeDelete(): boolean | Promise<boolean>;

  onBeforeUpdate(): boolean | Promise<boolean>;

  removeDocument(type: EDocumentType, id: string): void;

  update(): Promise<void>;
}
