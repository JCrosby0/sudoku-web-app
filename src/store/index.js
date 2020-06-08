import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let emptyCellArray = new Array(81).fill({});
emptyCellArray.forEach((_, i) => {
  emptyCellArray[i] = {
    value: null,
    notesTop: [],
    notesMid: [],
    bgColor: null,
    bgImg: null,
    cursor: false,
    selected: false,
    fixed: false,
    error: false
  };
});

export default new Vuex.Store({
  getters: {
    currentState: state => {
      return state.actionStack; // dev testing prior to changing data structure
      // return Object.assign({}, ...state.actionStack);
    }
  },
  state: {
    /**
     * the action stack should be an array of objects,
     * with the most recently added taking precedent over the rest
     *  */
    // actionStack: [], // ie current action stack
    actionStack: emptyCellArray, // ie current action stack
    redoStack: [], // populated if user undoes something
    initialState: [], // ie from puzzle setter
    savedState: [] // ie from user
  },
  mutations: {
    NEWACTION(state, payload) {
      state.actionStack = payload; // dev testing prior to changing data structure
      // state.actionStack.push(payload);
      state.redoStack = [];
    },
    UNDOACTION(state) {
      const last = state.actionStack.pop();
      state.redoStack.push(last);
    },
    REDOACTION(state) {
      if (state.redoStack.length) {
        const last = this.redoStack.pop();
        state.actionStack.push(last);
      }
    },
    // this is available to the user
    GETSAVEDSTATE(state) {
      state.actionState = [...state.savedState];
    },
    SETSAVEDSTATE(state, payload) {
      state.savedState = [payload];
    },
    // to reset the puzzle
    GETINITIALSTATE(state) {
      state.actionState = [...state.initialState];
    },
    // avaialable only to the puzzle setter
    SETINITIALSTATE(state, payload) {
      state.initialState = [payload];
    }
  },

  actions: {
    newAction({ commit }, payload) {
      commit("NEWACTION", payload);
    },
    undoAction({ commit }) {
      commit("UNDOACTION");
    },
    redoAction({ commit }) {
      commit("REDOACTION");
    },
    saveProgress({ commit, getters }) {
      const payload = getters.currentState;
      commit("SETSAVEDSTATE", payload);
    },
    restoreProgress({ commit }) {
      commit("GETSAVEDSTATE");
    },
    setPuzzle({ commit, getters }) {
      const payload = getters.currentState;
      payload.forEach(cell => {
        if (cell.value) {
          cell.fixed = true;
        }
      });
      commit("SETINITIALSTATE", payload);
    },
    resetPuzzle({ commit }) {
      commit("GETINITIALSTATE");
    }
  },
  modules: {}
});
