import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    currentState: state => {
      return Object.assign({}, ...state.actionStack);
    }
  },
  state: {
    /**
     * the action stack should be an array of objects,
     * with the most recently added taking precedent over the rest
     *  */
    actionStack: [], // ie current action stack
    redoStack: [], // populated if user undoes something
    initialState: [], // ie from puzzle setter
    savedState: [] // ie from user
  },
  mutations: {
    NEWACTION(state, payload) {
      state.actionStack.push(payload);
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
    SETSAVEDSTATE(state, getters) {
      state.savedState = [getters.currentState];
    },
    // to reset the puzzle
    GETINITIALSTATE(state) {
      state.actionState = [...state.initialState];
    },
    // avaialable only to the puzzle setter
    SETINITIALSTATE(state, getters) {
      state.initialState = [getters.currentState];
    }
  },

  actions: {
    newAction: context => payload => {
      context.commit("NEWACTION", payload);
    },
    undoAction: context => {
      context.commit("UNDOACTION");
    },
    redoAction: context => {
      context.commit("REDOACTION");
    },
    saveProgress: context => {
      context.commit("SETSAVEDSTATE");
    },
    restoreProgress: context => {
      context.commit("GETSAVEDSTATE");
    },
    setPuzzle: context => {
      context.commit("SETINITIALSTATE");
    },
    resetPuzzle: context => {
      context.commit("GETINITIALSTATE");
    }
  },
  modules: {}
});
