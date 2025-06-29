import type { Account, IAccountData } from 'src/scripts/documents/model/Account';
import type { IDocument } from 'src/scripts/documents/Document';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { IProjectData } from 'src/scripts/documents/model/Project';

export const useSessionStore = defineStore('session-store', {
  state: () => ({
    account: null as Account | null,
    projects: [] as IDocument<IProjectData>[],
  }),

  getters: {
    accountDocument(): IDocument<IAccountData> | null {
      return this.account ? (this.account.document as IDocument<IAccountData>) : null;
    },
  },

  actions: {
    clear(): void {
      this.account = null;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot));
}
