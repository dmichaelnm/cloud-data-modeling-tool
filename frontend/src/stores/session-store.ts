import type { Account, IAccountData } from 'src/scripts/documents/model/Account';
import type { IDocument } from 'src/scripts/documents/Document';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { IProjectData } from 'src/scripts/documents/model/Project';

export const useSessionStore = defineStore('session-store', {
  state: () => ({
    account: null as Account | null,
    projects: [] as IDocument<IProjectData>[],
    activeProject: null as string | null,
  }),

  getters: {
    accountDocument(): IDocument<IAccountData> | null {
      return this.account ? (this.account.document as IDocument<IAccountData>) : null;
    },
    projectDocument(): IDocument<IProjectData> | null {
      return this.projects.find((project) => project.id === this.activeProject) ?? null;
    },
  },

  actions: {
    clear(): void {
      this.account = null;
    },
    sortProjects(): void {
      this.projects.sort((a, b) => a.data.common.name.localeCompare(b.data.common.name));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot));
}
