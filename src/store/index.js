import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let emptyCellArray = new Array(81).fill({});
emptyCellArray.forEach((cell, i) => {
  emptyCellArray[i] = {
    value: null,
    notesTop: [],
    notesMid: [],
    bgColor: null,
    bgImg: null,
    fixed: false,
    error: false,
    index: i
  };
});

export default new Vuex.Store({
  getters: {
    undoStackSize: state => {
      return state.actionStack.length;
    },
    redoStackSize: state => {
      return state.redoStack.length;
    },
    /**
     * take the action stack and turn it into a puzzle state
     * action stack is an array of arrays,
     * each element array describes only the puzzle changes at that step
     * full array needs to be parsed to get to final state
     * returns a non-sparse array of cell state
     */
    // currentStateBACKUP: state => {
    //   return state.actionStack; // dev testing prior to changing data structure
    //   // return Object.assign({}, ...state.actionStack);
    // },
    cellDescription: (state, getters) => {
      return index => {
        return getters.currentState[index];
      };
    },
    currentState: state => {
      /**
       * Goal: provide a puzzle state
       * Form: single array ordered in rows, cells
       * Needs to provide emptycells for anything not defined
       * start with empty cell array, look up position of everything in actionStack and place in appropriate index?
       *
       */
      console.log("currentState fired");
      let current = [...emptyCellArray];
      if (state.actionStack.length == 0) return current;
      console.log(
        "recomputing with action stack length: ",
        state.actionStack.length
      );
      state.actionStack.forEach(action => {
        // an action will be an array of cell modifications
        if (!action) {
          console.log("action -- action is falsey", action, action == false);
        }
        action && // action in the list, if there, consists of multiple cells being cahnged
          action.forEach(cellDescription => {
            // for each cell being changed
            let index; // test we have an index
            if (cellDescription.index || cellDescription.index === 0) {
              index = cellDescription.index;
            } else if (
              !cellDescription.index &&
              cellDescription.rowId &&
              cellDescription.cellId
            ) {
              index = cellDescription.rowId * 9 + cellDescription.cellId; // TODO flexible grid size
              cellDescription.index = index; // store it in the stack
              console.log("cell didnt have index: ", index);
            } else {
              console.log("No index avaialble");
              return;
            }
            current[index] = cellDescription;
          });
      });
      return current; // dev testing prior to changing data structure
      // return Object.assign({}, ...state.actionStack);
    }
  },
  state: {
    /**
     * the action stack should be an array of arrays,
     * with the most recently added taking precedent over the rest
     * each element in the array describes all actions in that event, not the entire grid
     * action stack can start empty, the getter can ensure array is not sparse
     * */
    actionStack: [], // ie current action stack
    // actionStackBACKUP: emptyCellArray, // ie current action stack
    redoStack: [], // populated if user undoes something
    initialState: [], // ie from puzzle setter
    savedState: [] // ie from user
  },
  mutations: {
    NEWACTION(state, payload) {
      // state.actionStackBACKUP = payload; // dev testing prior to changing data structure
      state.actionStack.push(payload);
      state.redoStack = [];
    },
    UNDOACTION(state) {
      if (state.actionStack.length) {
        const last = [...state.actionStack.pop()];
        state.redoStack.push([...last]);
        console.log(
          "state.actionStack: ",
          state.actionStack,
          state.actionStack.length
        );
        console.log("undo last: ", last);
        console.log(
          "state.redoStack: ",
          state.redoStack,
          state.redoStack.length
        );
      }
      return;
      // const last = state.actionStack.pop();
      // state.redoStack.push(state.actionStack.pop());
    },
    REDOACTION(state) {
      if (state.redoStack.length) {
        const last = [...state.redoStack.pop()];
        state.actionStack.push([...last]);
        console.log(
          "state.actionStack: ",
          state.actionStack,
          state.actionStack.length
        );
        console.log("redo last: ", last);
        console.log(
          "state.redoStack: ",
          state.redoStack,
          state.redoStack.length
        );
      }
      return;
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
      console.log(this);
      this._vm.$message("Undo Fired");
      commit("UNDOACTION");
    },
    redoAction({ commit }) {
      this._vm.$message("Redo Fired");
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
