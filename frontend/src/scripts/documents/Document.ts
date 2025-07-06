import { IAccountData } from 'src/scripts/documents/model/Account';

/**
 * Enumeration representing different types of documents.
 *
 * This enum is used to define and standardize the types of documents that can be used
 * within the system. Each type is associated with a corresponding string value to provide
 * clear and descriptive identifiers.
 */
export enum EDocumentType {
  // Account document
  Account = 'account',
  // Project document
  Project = 'project',
  // Cloud Service Provider
  CloudServiceProvider = 'cloudServiceProvider',
}

/**
 * Enum representing possible operations on a document.
 *
 * This enum defines the various actions that can be performed on a document,
 * typically corresponding to basic CRUD (Create, Read, Update, Delete) operations.
 *
 * Enum values:
 * - `create`: Represents the creation of a new document.
 * - `update`: Represents modifications made to an existing document.
 * - `delete`: Represents the removal of an existing document.
 * - `read`: Represents retrieving or reading a document's content.
 */
export enum EDocumentOperation {
  // Create a document
  create = 'create',
  // Update a document
  update = 'update',
  // Delete a document
  delete = 'delete',
  // Read (only) a document
  read = 'read',
}

/**
 * Enumeration representing custom attribute types.
 *
 * This enumeration defines the types that custom attributes can have
 * within the system, facilitating the categorization and flexible handling
 * of user-defined attributes.
 *
 * Members:
 * - `String`: Denotes a custom attribute of a string type.
 * - `Number`: Denotes a custom attribute of a numerical type.
 * - `Boolean`: Denotes a custom attribute of a boolean type.
 */
export enum ECustomAttributeType {
  // String value type
  String = 'string',
  // Numeric value type
  Number = 'number',
  // Boolean value type
  Boolean = 'boolean',
}

/**
 * Represents the information about a document.
 */
export type TDocumentInfo = {
  // User ID
  uid: string;
  // The name of the user
  name: string;
  // Timestamp
  time: Date;
};

/**
 * Represents metadata information for a document or object. It includes details about its creation and any potential
 * alterations.
 */
export type TMetaData = {
  // Information about the creation of the document
  created: TDocumentInfo;
  // Information about the alteration of the document
  altered?: TDocumentInfo;
};

/**
 * Represents a custom attribute with a key, type, value, and a lock status.
 */
export type TCustomAttribute = {
  // Key of the attribute
  key: string;
  // Type of the attribute
  type: ECustomAttributeType;
  // Value of the attribute
  value: string | number | boolean | null;
  // Attribute is locked (Key and type cannot be changed)
  locked: boolean;
};

/**
 * IDocumentData is an interface that represents the structure of document-related data.
 * This interface includes an optional `meta` property which can hold metadata related to the document.
 */
export interface IDocumentData {
  // Meta-information about the document
  meta?: TMetaData;
}

/**
 * Interface representing the structure of project document data.
 * Extends the base IDocumentData interface to include additional attributes specific to a project document.
 */
export interface IProjectDocumentData extends IDocumentData {
  // Common properties
  common: {
    // Name of the document
    name: string;
    // An optional brief description
    description: string | null;
  };
  // Array of custom attributes
  customAttributes: TCustomAttribute[];
}

/**
 * Represents a generic document with associated data, type, and hierarchy.
 *
 * @template D - The type of data associated with the document. Must extend IDocumentData.
 */
export interface IDocument<D extends IDocumentData> {
  /**
   * Represents the type of a document. This enum defines possible classifications
   * for documents to specify their purpose or category within the system.
   */
  type: EDocumentType;
  /**
   * Represents a unique identifier.
   */
  id: string;
  /**
   * Represents the data of the document.
   */
  data: D;
  /**
   * Represents the parent document of the current document.
   *
   * This variable can either hold an instance of `IDocument` with a type `IDocumentData`
   * or be undefined if the document has no parent.
   *
   * It is typically used to establish hierarchical relationships
   * between documents in a structure.
   */
  parent?: IDocument<IDocumentData> | undefined;

  /**
   * Adds a new child document.
   *
   * @param {IDocument<IDocumentData>} document - The document object to be added, containing its data and
   *        relevant metadata.
   * @return {void} No value is returned.
   */
  addDocument(document: IDocument<IDocumentData>): void;

  /**
   * Removes all child documents from this document.
   *
   * @return {void} Does not return any value.
   */
  clearDocuments(): void;

  /**
   * Deletes this document.
   *
   * @return {Promise<void>} A promise that resolves once the deletion is completed successfully,
   *         or rejects if an error occurs during the operation.
   */
  delete(): Promise<void>;

  /**
   * Finds and retrieves a child document based on the provided identifier.
   *
   * @param {string} id - The unique identifier of the document to be retrieved.
   * @param {boolean} deepSearch - A flag indicating whether the search should be performed in depth.
   * @return {IDocument<IDocumentData> | undefined} The found document if it exists,
   *         or undefined if no matching document is found.
   */
  findDocument(id: string, deepSearch: boolean): IDocument<IDocumentData> | undefined;

  /**
   * Retrieves a child document of the specified type and identifier.
   *
   * @param {EDocumentType} type - The type of the document to retrieve.
   * @param {string} id - The unique identifier of the document.
   * @return {IDocument<IDocumentData> | undefined} Returns the document if found, otherwise undefined.
   */
  getDocument(type: EDocumentType, id: string): IDocument<IDocumentData> | undefined;

  /**
   * Retrieves a list of documents filtered by the specified document type.
   *
   * @param {EDocumentType} type - The type of documents to retrieve.
   * @return {IDocument<IDocumentData>[]} An array of documents matching the specified type.
   */
  getDocuments<T extends IProjectDocumentData>(type: EDocumentType): IDocument<T>[];

  /**
   * This method is triggered before a delete operation is carried out.
   * It can be used to perform checks or execute logic to determine
   * whether the delete operation should proceed.
   *
   * @return {boolean | Promise<boolean>} Returns a boolean value or a Promise resolving to a boolean.
   *         If the return value is `true`, the delete operation will proceed. If `false`, the delete operation
   *         will be halted.
   */
  onBeforeDelete(): boolean | Promise<boolean>;

  /**
   * Hook method that gets executed before an update operation is performed.
   * This method can be used to perform pre-update validations, checks, or other logic.
   *
   * @return {boolean | Promise<boolean>} Returns a boolean or a Promise resolving to a boolean indicating
   * whether the update operation should proceed. Returning `false` or a Promise resolving to `false` will
   * cancel the update process.
   */
  onBeforeUpdate(): boolean | Promise<boolean>;

  /**
   * Removes a child document identified by its type and ID from the system.
   *
   * @param {EDocumentType} type - The type of the document to be removed.
   * @param {string} id - The unique identifier of the document to be removed.
   * @return {void} This method does not return a value.
   */
  removeDocument(type: EDocumentType, id: string): void;

  /**
   * Updates the data of this document.
   *
   * @return {Promise<void>} A promise that resolves when the update operation is completed.
   */
  update(): Promise<void>;
}

/**
 * Abstract class representing editor data for a project document. Provides a
 * structure for managing and manipulating document data specific to the editor.
 *
 * @template D Extends the `IProjectDocumentData` interface, representing the
 *           structure of the document data handled by the editor.
 */
export abstract class EditorData<D extends IProjectDocumentData> {
  /**
   * Represents the current account manipulating the editor data.
   */
  currentAccount: IDocument<IAccountData>;
  /**
   * Represents the type of the document that is manipulated in the editor.
   */
  type: EDocumentType;
  /**
   * Represents the data to be manipulated in the editor.
   */
  data: D;
  /**
   * Represents the document to be updated from the editor data or null, if a new document will be
   * created.
   */
  document: IDocument<D> | null;
  /**
   * The parent document of the new or updated document.
   */
  parent?: IDocument<IProjectDocumentData> | undefined;

  /**
   * Creates a new instance of the editor data.
   * @param currentAccount The current account manipulating the editor data.
   * @param type The type of the document that is manipulated in the editor.
   * @param document the document to be updated from the editor data or null if a new document will be
   *        created.
   * @param parent The parent document of the new or updated document.
   */
  constructor(
    currentAccount: IDocument<IAccountData>,
    type: EDocumentType,
    document: IDocument<D> | null,
    parent?: IDocument<IProjectDocumentData>,
  ) {
    this.currentAccount = currentAccount;
    this.type = type;
    this.document = document;
    this.parent = parent;
    this.data = this.createData();
  }

  /**
   * Creates and initializes a data object based on the current document or default values.
   *
   * @return {D} The newly created and initialized data object.
   */
  createData(): D {
    // Check if there is a document
    let data: D;
    if (this.document) {
      // Create the editor data object from the values of the document
      data = {
        common: {
          name: this.document.data.common.name,
          description: this.document.data.common.description,
        },
        customAttributes: [
          ...this.document.data.customAttributes.map((attr) => {
            return { ...attr };
          }),
        ],
        meta: {
          created: { ...this.document.data.meta?.created },
          altered: { ...this.document.data.meta?.altered },
        },
      } as D;
    } else {
      // Create the editor data for a new document with default values
      data = {
        common: {
          name: '',
          description: null,
        },
        customAttributes: [] as TCustomAttribute[],
      } as D;
    }
    // Apply document specific values
    this.initData(data);
    // Return the editor data object
    return data;
  }

  /**
   * Initializes the data. If the document of the editor data instance is not null, the values
   * should come from the document, otherwise default values should be applied for a new document.
   *
   * @param {D} data - The data to be initialized.
   * @return {void} This method does not return a value.
   */
  abstract initData(data: D): void;

  /**
   * Updates the provided document data with the editor data.
   *
   * @param {D} documentData - The document data object to be updated.
   * @return {void} - This method does not return a value.
   */
  abstract updateDocumentData(documentData: D): void;
}
