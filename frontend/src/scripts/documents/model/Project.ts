import * as dc from 'src/scripts/documents/Document';
import { EDocumentType, IDocument } from 'src/scripts/documents/Document';
import { IAccountData } from 'src/scripts/documents/model/Account';
import { ModelObject } from 'src/scripts/documents/ModelObject';
import { getDocumentProvider } from 'src/scripts/documents/DocumentProvider';

/**
 * Enumeration representing roles within a project.
 *
 * TProjectRole defines the list of roles that can be associated with
 * participants in a project, helping to determine their permissions
 * and responsibilities.
 */
export enum EProjectRole {
  // Project Owner
  Owner = 'owner',
  // Project Manager
  Manager = 'manager',
  // Maintainer
  Maintainer = 'maintainer',
  // Deployer
  Deployer = 'deployer',
  // Developer
  Developer = 'developer',
  // Visitor
  Visitor = 'visitor',
}

/**
 * Represents a project member with specific attributes and their role within the project.
 */
export type TProjectMember = {
  // Role within a project
  role: EProjectRole;
  // ID of the account
  id: string;
  // Name of the member
  name: string;
  // Profile picture of the member
  picture: string | null;
  // Optional description
  description: string | null;
  // Member is active or not
  active: boolean;
};

/**
 * IProjectData represents the structure for project-related data within the application,
 * extending the properties and methods defined in dc.IProjectDocumentData.
 */
export interface IProjectData extends dc.IProjectDocumentData {
  // Array of account IDs that can access this project (Needed for Firebase Rules)
  access: string[];
  // Array of project members
  members: TProjectMember[];
}

/**
 * Represents a project within a system, extending the functionality of ModelObject.
 * Provides methods to access specific project information.
 */
export class Project extends ModelObject<IProjectData> {
  /**
   * Retrieves the owner of the project from the project's member list.
   *
   * @return {TProjectMember} The member object representing the project owner.
   */
  getProjectOwner(): TProjectMember {
    return this.document.data.members.find(
      (mbr) => mbr.role === EProjectRole.Owner,
    ) as TProjectMember;
  }

  /**
   * Retrieves the project manager from the list of project members.
   *
   * @return {TProjectMember} The member object who holds the role of Manager in the project.
   */
  getProjectManager(): TProjectMember {
    return this.document.data.members.find(
      (mbr) => mbr.role === EProjectRole.Manager,
    ) as TProjectMember;
  }

  /**
   * Retrieves the current role of the user within the project.
   *
   * This method determines the role of the currently logged-in user based on the document's membership data.
   *
   * @return {EProjectRole} The role of the current user in the project.
   */
  getCurrentRole(): EProjectRole {
    // Get document provider
    const provider = getDocumentProvider();
    // Get current user ID
    const userId = provider.getCurrentUserId();
    // Get roles of the user ID
    const roles = this.document.data.members
      .filter((mbr) => mbr.id === userId)
      .map((mbr) => mbr.role);
    // Return first project tole
    return roles[0] as EProjectRole;
  }

  /**
   * Loads and retrieves all project documents that the current user has access to.
   *
   * @return {Promise<IDocument<IProjectData>[]>} A promise that resolves to an array of project documents.
   */
  static async loadProjects(): Promise<IDocument<IProjectData>[]> {
    // Get document provider
    const provider = getDocumentProvider();
    // Return all project documents with access
    return await provider.findDocuments<IProjectData>(EDocumentType.Project, undefined, {
      attribute: 'access',
      operation: 'array-contains',
      value: provider.getCurrentUserId(),
    });
  }
}

/**
 * Represents the data structure and operations for editing a project in the application.
 * This class extends the base `EditorData` class and encapsulates logic specific
 * to maintaining and managing project-related information, such as members and access permissions.
 */
export class ProjectEditorData extends dc.EditorData<IProjectData> {
  /**
   * The project owner.
   */
  projectOwner: TProjectMember;
  /**
   * The project manager.
   */
  projectManager: TProjectMember;

  /**
   * Creates a new instance of this class.
   * @param currentAccount The current account.
   * @param type The type of the document.
   * @param document The document itself or null, if it is a new document.
   * @param parent The parent document.
   */
  constructor(
    currentAccount: dc.IDocument<IAccountData>,
    type: dc.EDocumentType,
    document: dc.IDocument<IProjectData> | null,
    parent?: dc.IDocument<dc.IProjectDocumentData>,
  ) {
    super(currentAccount, type, document, parent);
    // Initialize the project owner
    this.projectOwner = {
      role: EProjectRole.Owner,
      id: this.currentAccount.id,
      name: this.currentAccount.data.user.name,
      description: null,
      picture: this.currentAccount.data.user.picture,
      active: true,
    };
    // Initialize the project manager
    this.projectManager = { ...this.projectOwner };
    this.projectManager.role = EProjectRole.Manager;
  }

  /**
   * Initializes the project data by extracting information from the current document
   * and populating the provided `data` object with access and members details.
   * If the document does not exist, it initializes `data` with empty values.
   *
   * @param {IProjectData} data - The project data object to be initialized.
   * @return {void} No return value.
   */
  override initData(data: IProjectData): void {
    if (this.document) {
      // Initialize editor data from the project document
      const project = new Project(this.document);
      this.projectOwner = project.getProjectOwner();
      this.projectManager = project.getProjectManager();
      data.access = [...this.document.data.access];
      data.members = [...this.document.data.members.map((mbr) => ({ ...mbr }))];
    } else {
      // Initialize editor data with default values
      data.access = [];
      data.members = [];
    }
  }

  /**
   * Updates the document data with new members and access list.
   *
   * @param {IProjectData} documentData - The project document data object to be updated. It contains information about
   *        project members and access.
   * @return {void} The function does not return a value.
   */
  override updateDocumentData(documentData: IProjectData): void {
    // Update the project member list
    documentData.members = [this.projectOwner, this.projectManager, ...this.data.members];
    // Update access list
    documentData.access = [...new Set(documentData.members.map((mbr) => mbr.id))];
  }
}
