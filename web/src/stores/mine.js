import { defineStore } from 'pinia'

export const useGameStore = defineStore({
  id: 'mine',
  state: () => ({
    type: '1'
  }),
  getters: {
    gameType: (state) => state.type
  },
  actions: {
    changeGameType(type) {
      this.type = type
    }
  }
})
