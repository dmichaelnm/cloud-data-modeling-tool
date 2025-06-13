import {defineStore, acceptHMRUpdate} from 'pinia';

export const useSessionStore = defineStore('session-store', {
  state: () => ({}),

  getters: {},

  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot));
}
