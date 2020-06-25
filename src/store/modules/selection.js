export default {
  namespaced: true,
  getters: {},
  state: {
    selectedCells: [],
    highlightedCells: []
  },
  mutations: {
    UPDATE_HIGHLIGHTED_CELLS(state, payload) {
      state.highlightedCells.push(...payload);
    },
    CLEAR_HIGHLIGHTED_CELLS(state) {
      state.highlightedCells = [];
    },
    UPDATE_SELECTED_CELLS(state, payload) {
      state.selectedCells.push(...payload);
    },
    CLEAR_SELECTED_CELLS(state) {
      state.selectedCells = [];
    }
  },
  actions: {
    highlightCell({ commit }, payload) {
      commit("UPDATE_HIGHLIGHTED_CELLS", payload);
    },
    selectCell({ commit }, payload) {
      commit("UPDATE_HIGHLIGHTED_CELLS", payload);
    },
    clearSelection({ commit }, payload) {
      commit("UPDATE_HIGHLIGHTED_CELLS", payload);
    },
    clearHighlights({ commit }, payload) {
      commit("UPDATE_HIGHLIGHTED_CELLS", payload);
    }
  }
};
