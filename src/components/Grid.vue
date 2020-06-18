<template>
  <div class="grid-main">
    <div
      :style="{
        height: cellLength * 13 + 'px',
        width: cellLength * 13 + 'px'
      }"
      class="grid-outer"
      @click.self="handleClickOuter"
    >
      <!-- left: outerMargin.left + 'px',
      top: outerMargin.top + 'px'-->
      <div
        :style="{
          height: cellLength * 9 + 'px',
          width: cellLength * 9 + 'px',
          top: cellLength * 2 + 'px',
          left: cellLength * 2 + 'px'
        }"
        class="grid-inner"
      >
        <Row
          v-for="(row, i) in rows"
          :key="'compRow' + i"
          :row-id="i"
          :style="{
            height: cellLength * 1 + 'px',
            width: cellLength * 9 + 'px'
          }"
          class="grid-row"
          @emitCellClicked="handleCellClicked"
          @emitDragAdd="handleDragAdd"
          @emitDragEnd="handleDragEnd"
        ></Row>
        <!-- :cells="currentState.slice(9 * i, 9 * i + 9)" -->
        <!-- :cells="cells.slice(9 * i, 9 * i + 9)" -->
      </div>
    </div>
  </div>
</template>

<script>
import Row from "./Row.vue";
import { mapGetters } from "vuex";
// generate empty cell data
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
// shared maths helper functions
const rowFromIndex = index => Math.floor(index / 9);
const colFromIndex = index => index % 9;
const boxFromIndex = index =>
  Math.floor(colFromIndex(index) / 3) + 3 * Math.floor(rowFromIndex(index) / 3);

const indexFromCoords = cell => cell.rowId * 9 + cell.cellId;
// Chess Constraints
const testKnightCondition = (index, row, col) => {
  // row abs.difference of two and col abs.difference of 1 of vice versa
  return (
    (Math.abs(rowFromIndex(index) - row) == 1 &&
      Math.abs(colFromIndex(index) - col) == 2) ||
    (Math.abs(rowFromIndex(index) - row) == 2 &&
      Math.abs(colFromIndex(index) - col) == 1)
  );
};
const testQueenCondition = (index, row, col) => {
  // a diagonal will have:
  // - the same difference between row and col of two points,
  // - the same sum between row and col of two points
  const col_ind = colFromIndex(index);
  const row_ind = rowFromIndex(index);
  // shared column
  if (col_ind === col) return true;
  // shared row
  if (row_ind === row) return true;
  // shared NW-SE diagonal
  if (col_ind - row_ind === col - row) return true;
  // shared NE-SW diagonal
  if (col_ind + row_ind === col + row) return true;
  return false;
};
const testKingCondition = (index, row, col) => {
  // both row and column must have abs(difference <=1
  return (
    Math.abs(rowFromIndex(index) - row) <= 1 &&
    Math.abs(colFromIndex(index) - col) <= 1
  );
};

const toggleKey = (array, key) => {
  const keyNum = Number.parseInt(key);
  if (isNaN(keyNum)) return array;
  const index = array.indexOf(keyNum);
  if (index >= 0) {
    array.splice(index, 1);
  } else {
    array.push(keyNum);
  }
  return array.sort();
};

import { mapActions } from "vuex";
export default {
  name: "Grid",
  components: { Row },
  props: {
    settings: {
      required: true,
      type: Object
    }
  },
  // settings: {
  //   highlightOptions: ["Row", "Column", "Box", "Number", "King", "Knight"]
  // },
  data() {
    return {
      cellLength: null,
      cursorCell: { rowId: null, cellId: null },
      outerMargin: {
        left: null,
        top: null
      },
      rows: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      cells: emptyCellArray,
      selectedCells: [],
      highlightedCells: [],
      cursorIndexArray: [],
      dragSelectionObj: {}
    };
  },
  computed: {
    ...mapGetters(["currentState"]),
    dragSelection() {
      return Object.keys(this.dragSelectionObj);
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.updateWindowSize();
      // resize for sizing the grid
      window.addEventListener("resize", this.updateWindowSize);
      // keypress for cell inputs - this is also registering through keydown
      // window.addEventListener("keypress", this.handleKeyPress, false);
      // keydown for arrow keys
      window.addEventListener("keydown", this.handleKeyDown, false);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowSize);
    // window.removeEventListener("keypress", this.handleKeyPress, false);
    window.removeEventListener("keydown", this.handleKeyDown, false);
  },
  methods: {
    ...mapActions(["newAction", "undoAction", "redoAction"]),
    updateWindowSize() {
      const headerHeight = 60; // px
      const availHeight = window.innerHeight - headerHeight;
      const availWidth = window.innerWidth;
      this.cellLength = Math.min(availWidth, availHeight) / 14;
      this.outerMargin.left = (availWidth - this.cellLength * 13) / 2;
      this.outerMargin.top = (availHeight - this.cellLength * 13) / 2;
    },
    styleObject(grid = "inner") {
      const len = grid === "inner" ? 9 : 13;
      return `{
        width: ${this.cellLength * len},
        height: ${this.cellLength * len}
      }`;
    },
    /**
     * * handleClickOuter
     * Fires when user clicks outside the grid
     * Expected functionality:
     * - remove all cell selection
     * - remove cursor cell selection
     * - remove all highlights
     * */
    handleClickOuter() {
      this.cursorCell = { rowId: null, cellId: null };
      this.cursorIndexArray = [];
      this.clearAllSelections();
    },
    /**
     * * handleCellClicked
     * Fires when user clicks a cell (not types)
     * Expected functionality:
     * - clicked cell should update with cursor
     * - ctrl click should toggle selection of that cell
     * - shift click should select a rectangle of cells
     * - alt click should auto highlight cells per settings
     */
    handleCellClicked(obj) {
      if (obj.event.type.slice(0, 4) === "drag") {
        return;
      }
      // first priority - update cursor:
      // consider not doing this if shift?
      this.clearAllSelections("highlight");
      this.clearAllSelections("cursor");
      // first assuming no ctrl, clear selection
      if (!obj.event.ctrlKey && !obj.event.shiftKey) {
        this.clearAllSelections();
      }
      // if shift key, calculate the rectangle from last click to this click
      if (obj.event.shiftKey) {
        if (!obj.event.ctrlKey) {
          this.clearAllSelections();
        }
        /* TODO: map from one row/cell to the next,
         and get cells in a line */
        const minRow = Math.min(this.cursorCell.rowId, obj.rowId);
        const maxRow = Math.max(this.cursorCell.rowId, obj.rowId);
        const minCell = Math.min(this.cursorCell.cellId, obj.cellId);
        const maxCell = Math.max(this.cursorCell.cellId, obj.cellId);
        for (let row = minRow; row <= maxRow; row++) {
          for (let cell = minCell; cell <= maxCell; cell++) {
            const index = indexFromCoords({ rowId: row, cellId: cell });
            this.selectedCells.push(index);
          }
        }
      }
      // get the cell Index, does this need to be any higher?
      const index = indexFromCoords(obj);
      // alt key only, do highlight per settings
      if (obj.event.altKey && !obj.event.shiftKey && !obj.event.ctrlKey) {
        // TODO: Not working because index is not defined
        // select box + row + col
        this.highlightedCells = [];
        const clickedRow = obj.rowId;
        const clickedCol = obj.cellId;
        const clickedBox =
          Math.floor(clickedCol / 3) + 3 * Math.floor(clickedRow / 3);
        this.currentState.forEach((cell, index) => {
          // row
          if (
            this.settings.highlightOptions.includes("Row") &&
            rowFromIndex(index) == clickedRow
          ) {
            this.highlightedCells.push(index);
          }
          // col
          else if (
            this.settings.highlightOptions.includes("Column") &&
            colFromIndex(index) == clickedCol
          ) {
            this.highlightedCells.push(index);
          }
          // box
          else if (
            this.settings.highlightOptions.includes("Box") &&
            boxFromIndex(index) == clickedBox
          ) {
            this.highlightedCells.push(index);
          }
          // king
          else if (
            this.settings.highlightOptions.includes("Chess: King") &&
            testKingCondition(index, clickedRow, clickedCol)
          ) {
            this.highlightedCells.push(index);
          } // queen
          else if (
            this.settings.highlightOptions.includes("Chess: Queen") &&
            testQueenCondition(index, clickedRow, clickedCol)
          ) {
            this.highlightedCells.push(index);
          }
          // knight
          else if (
            this.settings.highlightOptions.includes("Chess: Knight") &&
            testKnightCondition(index, clickedRow, clickedCol)
          ) {
            this.highlightedCells.push(index);
          }
          // value
          else if (
            this.settings.highlightOptions.includes("Number") &&
            (obj.value || obj.value === 0) &&
            cell.value === obj.value
          ) {
            this.highlightedCells.push(index);
          }
        });
      }

      // SET CELL SELECTION
      // no alt / shift modifiers
      // ctrl should behave as toggle
      if (!obj.event.altKey && !obj.event.shiftKey) {
        // if this.selectedCells includes index && ctrl - remove
        // if this.selectedCells inlcudes index && !ctrl - add to selection
        // if this.selectedCells !include index && ctrl - add to selection
        // if this.selectedCells !include index && !ctrl - add to selection
        if (this.selectedCells.includes(index) && obj.event.ctrlKey) {
          this.selectedCells = this.selectedCells.filter(c => c !== index);
        } else if (!this.selectedCells.includes(index)) {
          this.selectedCells.push(index);
        }
      }
      // done with functionality, prepare for next time
      // store cursor cell and set highlighting
      if (!obj.event.shiftKey) {
        this.cursorCell = { rowId: obj.rowId, cellId: obj.cellId };
        this.cursorIndexArray = [index];
      }
    },
    /**
     * * handleKeyDown
     * Key down is catching arrow keys and modifiers
     * It is also the listener for all keystrokes
     * TODO: handle modifiers changing state of any on screen input
     * Expected functionality:
     * - arrow key should move cursor relative to current position
     * - existing selection should be removed
     */
    handleKeyDown(e) {
      // console.log("keyDownRegistered", e);
      let newCursorCell = {
        cellId: this.cursorCell.cellId,
        rowId: this.cursorCell.rowId
      };
      switch (e.key) {
        case "ControlLeft":
        case "ControlRight":
        case "ShiftLeft":
        case "ShiftRight":
        case "AltLeft":
        case "AltRight":
          // TODO: change on screen buttons based on modifier here
          // e.preventDefault();
          return;
        case "ArrowLeft":
          newCursorCell.cellId = Math.max(this.cursorCell.cellId - 1, 0);
          e.preventDefault();
          break;
        case "ArrowRight":
          newCursorCell.cellId = Math.min(this.cursorCell.cellId + 1, 8);
          e.preventDefault();
          break;
        case "ArrowUp":
          newCursorCell.rowId = Math.max(this.cursorCell.rowId - 1, 0);
          e.preventDefault();
          break;
        case "ArrowDown":
          newCursorCell.rowId = Math.min(this.cursorCell.rowId + 1, 8);
          e.preventDefault();
          break;
        default:
          // handle functionality for key input (numbers, letters)
          this.handleKeyPress(e);
          return;
      }
      const index = indexFromCoords(newCursorCell);
      if (!e.shiftKey && !e.ctrlKey) {
        // if no modifier, remove all selections
        this.clearAllSelections("selected");
      }
      this.selectedCells.push(index);
      // remove the old cursor
      this.clearAllSelections("cursor");
      // set the new cursor highlighting
      // store for next use
      this.cursorCell = newCursorCell;
      this.cursorIndexArray = [index];
    },
    /**
     * * handleKeyPress
     * Keypress is a number or letter -- user input
     * Expected functionality:
     * - it modifies the state of the grid
     * - new state is written to store
     * - no modifier is the value for the cell
     * - shift is topNotes
     * - ctrl is midNotes
     */
    handleKeyPress(e) {
      // e.preventDefault();
      console.log("keypress caught: ", e);

      // collate useful information
      const output = {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        key: String.fromCharCode(e.keyCode),
        value: null,
        event: e
      };
      // get the intended digit
      // eg shift + 2 => @
      switch (e.code) {
        case "Delete":
          output.value = null;
          break;
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
        case "Digit9":
        case "Digit0":
          output.value = e.code.slice(5);
          break;
        case "KeyY":
          if (output.ctrl && e.code == "KeyY") {
            this.redoAction();
          }
          break;
        case "KeyZ":
          if (output.ctrl && e.code == "KeyZ") {
            //undo function
            this.undoAction();
          }
          break;

        default:
          if (e.code.slice(0, 3) === "Key") {
            // letter key?
            output.value = e.code.slice(3);
            break;
          } else {
            // modifiers, function keys etc?
          }
          return;
      }
      /** if some cells are selected, enter value based on modifier */
      // sends the below array to the store as a user action
      let selected = this.currentState.filter(c =>
        this.selectedCells.includes(c.index)
      );
      selected.forEach(c => {
        if (isNaN(c.index)) {
          console.log("index error: ", c);
        }
        if (c.fixed) {
          // cell is fixed by puzzle, do nothing
          return;
        }
        if (e.code === "Delete") {
          // Delete contents of the cell
          c.value = null;
          c.notesTop = [];
          c.notesMid = [];
          c.bgColor = null;
          c.error = false;
        } else if (output.shift && !output.ctrl) {
          // Add/remove keystroke to notesTop: +shift, -ctrl
          c.notesTop = toggleKey(c.notesTop, output.value);
        } else if (output.ctrl && !output.shift) {
          // Add/remove keystroke to notesMid: -shift, +ctrl
          c.notesMid = toggleKey(c.notesMid, output.value);
          // !IMPORTANT: prevent default here to stop control changing tabs etc...
          e.preventDefault();
        } else if (!output.ctrl && !output.shift) {
          // Use keystroke for cell value: -shift, -ctrl
          c.value = output.key;
        } else {
          // this applies to every selected cell
          console.log("what is this key combination?", output, c);
        }
        // }
      });
      // send action containing array of modified cells
      this.newAction(selected);
    },
    handleDragAdd(obj) {
      this.cursorCell = obj;
      if (!Object.keys(this.dragSelectionObj).includes(obj.index)) {
        this.selectedCells.push(Number.parseInt(obj.index));
        this.$set(this.dragSelectionObj, obj.index, obj);
      }
    },
    handleDragEnd() {
      // console.log("drag ended", obj);
      this.dragSelectionObj = Object.assign({});
    },
    clearAllSelections(prop = "all") {
      // clear all selection highlighting from cells
      switch (prop) {
        case "selected":
          this.selectedCells = [];
          break;
        case "highlighted":
          this.highlightedCells = [];
          break;
        case "cursor":
          this.cursorIndexArray = [];
          break;
        case "all":
          this.selectedCells = [];
          this.highlightedCells = [];
          this.cursorIndexArray = [];
          break;
        default:
          return;
      }
    },
    clearAllErrors() {
      this.cells.forEach(cell => {
        cell.error = false;
      });
    },
    resetGrid() {
      this.cells.forEach(cell => {
        if (!cell.fixed) {
          cell.value = null;
          cell.notesTop = [];
          cell.notesMid = [];
          cell.bgColor = null;
          cell.error = false;
        }
      });
    }
  }
};
</script>

<style>
.grid-main {
  width: 100%;
  height: 100%;
  background: lightgrey;
}
.grid-outer {
  margin: auto;
  position: relative;
  background: lightgrey;
}
.grid-inner {
  background: grey;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: left;
  border: 2px black solid;
}
.grid-row {
  flex: 1 1 auto;
  border: 0;
  /* border: 1px red solid;
  box-sizing: border-box; */
}
</style>
