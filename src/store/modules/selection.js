export default {
  getters: {
    selectedCells: state => {
      return state.selectedCells;
    },
    highlightedCells: state => {
      return state.highlightedCells;
    },
    cursorIndex: state => {
      return state.cursorIndex;
    }
  },
  state: {
    selectedCells: [],
    highlightedCells: [],
    cursorIndex: []
  },
  mutations: {
    // HIGHLIGHTS
    UPDATE_HIGHLIGHTED_CELLS(state, payload) {
      state.highlightedCells.push(...payload);
    },
    CLEAR_HIGHLIGHTED_CELLS(state) {
      state.highlightedCells = [];
    },
    // SELECTION
    UPDATE_SELECTED_CELLS(state, payload) {
      state.selectedCells = payload;
    },
    CLEAR_SELECTED_CELLS(state) {
      state.selectedCells = [];
    },
    // CURSOR
    UPDATE_CURSOR_INDEX(state, payload) {
      state.cursorIndex = payload;
    },
    CLEAR_CURSOR_INDEX(state) {
      state.cursorIndex = [];
    }
  },
  actions: {
    // CURSOR
    setCursorIndex({
      commit
    }, payload) {
      if (typeof payload !== Array) {
        payload = [payload];
      }
      commit("UPDATE_CURSOR_INDEX", payload);
    },
    clearCursorIndex({
      commit
    }) {
      commit("CLEAR_CURSOR_INDEX");
    },
    // HIGHLIGHTS
    highlightCell({
      commit
    }, payload) {
      if (typeof payload !== Array) {
        payload = [payload];
      }
      commit("UPDATE_HIGHLIGHTED_CELLS", payload);
    },
    clearHighlights({
      commit
    }, payload) {
      commit("CLEAR_HIGHLIGHTED_CELLS", payload);
    },
    // SELECTION
    selectCell({
      commit,
      getters
    }, payload) {
      if (typeof payload !== Array) {
        payload = [payload];
      }
      const out = [...getters.selectedCells, ...payload];
      commit("UPDATE_SELECTED_CELLS", out);
    },
    deselectCell({
      commit,
      getters
    }, payload) {
      if (typeof payload !== Array) {
        payload = [payload];
      }
      const out = getters.selectedCells.filter(c => !payload.includes(c));
      console.log('payload: ', payload)
      console.log('getters.selectedCells: ', getters.selectedCells)
      commit("UPDATE_SELECTED_CELLS", out);
    },
    clearSelection({
      commit
    }, payload) {
      commit("CLEAR_SELECTED_CELLS", payload);
    },
  }
};
