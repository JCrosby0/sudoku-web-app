<template>
  <div class="grid-main">
    <div
      id="gridOuter"
      key="gridOuter"
      :style="styleGridOuter"
      class="grid-outer"
      @click.self="handleClickOuter"
    >
      <div :style="styleGridInner" class="grid-inner">
        <Row
          v-for="(_, i) in settings.puzzleSize"
          :key="'compRow' + i"
          :row-id="i"
          :style="styleGridRow"
          :settings="settings"
          class="grid-row"
          @emitCellClicked="handleCellClicked"
          @emitDragAdd="handleDragAdd"
          @emitDragEnd="handleDragEnd"
        ></Row>
      </div>
    </div>
  </div>
</template>

<script>
import Row from "./Row.vue";
import { mapGetters, mapActions } from "vuex";
import * as fn from "../plugins/sudokuFunctions";
export default {
  name: "Grid",
  components: { Row },
  props: {
    settings: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      cellLength: null,
      cursorCell: { rowId: null, cellId: null },
      outerMargin: {
        left: null,
        top: null
      },
      dragSelectionObj: {},
      orientation: 'horizontal'
    };
  },
  computed: {
    ...mapGetters([
      "currentState",
      "selectedCells",
      "highlightedCells",
      "cursorIndex"
    ]),
    fontSize() {
      const size = window.innerWidth / parseFloat(getComputedStyle(document.querySelector('html'))['font-size']);
      console.log('size: ', size)
      return size;
    },
    dragSelection() {
      return Object.keys(this.dragSelectionObj);
    },
    gridSize() {
      return this.settings.puzzleSize + this.settings.borderRows * 2;
    },
    styleGridOuter() {
      return {
        height: this.cellLength * this.gridSize + "px",
        width: this.cellLength * this.gridSize + "px",
        fontSize: this.cellLength * 0.6 + "px"
      };
    },
    styleGridInner() {

      return {
        height: this.cellLength * this.settings.puzzleSize + "px",
        width: this.cellLength * this.settings.puzzleSize + "px",
        top: this.cellLength * this.settings.borderRows + "px",
        left: this.cellLength * this.settings.borderRows + "px"
      };
    },
    styleGridRow() {
      return {
        height: this.cellLength * 1 + "px",
        width: this.cellLength * this.settings.puzzleSize + "px"
      };
    }
  },
  watch: {
    gridSize() {
      this.updateWindowSize();
      this.setPuzzleSize(this.settings.puzzleSize);
    }
  },
  mounted() {
    this.setPuzzleSize(9);
    this.$nextTick(function() {
      this.updateWindowSize();
      // resize for sizing the grid
      window.addEventListener("resize", this.updateWindowSize);
      window.addEventListener("keydown", this.handleKeyDown, false);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowSize);
    window.removeEventListener("keydown", this.handleKeyDown, false);
  },
  methods: {
    ...mapActions([
      "newAction",
      "undoAction",
      "redoAction",
      "setPuzzleSize",
      "highlightCell",
      "clearHighlights",
      "selectCell",
      "deselectCell",
      "clearSelection",
      "setCursorIndex",
      "clearCursorIndex"
    ]),
    updateWindowSize() {
      const headerHeight = 60; // px
      const containerWidth = 300; // [x]
      const height = window.innerHeight;
      const width = window.innerWidth;
      const orientation = (width > height) ? 'horizontal' : 'vertical'
      this.orientation = orientation
      // if window.innerWidth < 800 ? verticalorientation : horizontal orientation
      const availHeight = height - headerHeight;
      const availWidth = width - (width > 800 && containerWidth);
      this.cellLength = Math.min(availWidth, availHeight) / (this.gridSize + 1);
      this.outerMargin.left =
        (availWidth - this.cellLength * this.gridSize) / 2;
      this.outerMargin.top =
        (availHeight - this.cellLength * this.gridSize) / 2;
    },
    styleObject(grid = "inner") {
      const len = grid === "inner" ? this.settings.puzzleSize : this.gridSize;
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
            const index = fn.indexFromCoords(
              { rowId: row, cellId: cell },
              this.settings.puzzleSize
            );
            this.selectCell(index);
          }
        }
      }
      // get the cell Index, does this need to be any higher?
      // note: this.settings is not passing into the function properly here
      const index = fn.indexFromCoords(obj, this.settings.puzzleSize);
      // alt key only, do highlight per settings
      if (obj.event.altKey && !obj.event.shiftKey && !obj.event.ctrlKey) {
        const size = this.settings.puzzleSize;
        // prep before looping through the grid
        this.clearHighlights();
        const clickedRow = obj.rowId;
        const clickedCol = obj.cellId;
        const clickedBox =
          Math.floor(clickedCol / 3) + 3 * Math.floor(clickedRow / 3);
        // only prep for handling highlighting from all cells if needed
        let cellsWithValue = [];
        let rowsWithValue = [];
        let colsWithValue = [];
        let boxesWithValue = [];
        if (this.settings.highlightOptions.includes("Number + Seen")) {
          cellsWithValue = this.currentState.filter(
            c => c.value == Number.parseInt(obj.value)
          );
          rowsWithValue = cellsWithValue.map(c =>
            fn.rowFromIndex(c.index, size)
          );
          colsWithValue = cellsWithValue.map(c =>
            fn.colFromIndex(c.index, size)
          );
          boxesWithValue = cellsWithValue.map(c =>
            fn.boxFromIndex(c.index, size)
          );
        }
        // apply highlight conditions to each cell in the grid
        this.currentState.forEach((cell, index) => {
          // row
          if (
            this.settings.highlightOptions.includes("Row") &&
            fn.rowFromIndex(index, size) == clickedRow
          ) {
            this.highlightCell(index);
          }
          // col
          else if (
            this.settings.highlightOptions.includes("Column") &&
            fn.colFromIndex(index, size) == clickedCol
          ) {
            this.highlightCell(index);
          }
          // box
          else if (
            this.settings.highlightOptions.includes("Box") &&
            fn.boxFromIndex(index, size) == clickedBox
          ) {
            this.highlightCell(index);
          }
          // king
          else if (
            this.settings.highlightOptions.includes("Chess: King") &&
            fn.testKingCondition(index, clickedRow, clickedCol, size)
          ) {
            this.highlightCell(index);
          } // queen
          else if (
            this.settings.highlightOptions.includes("Chess: Queen") &&
            fn.testQueenCondition(index, clickedRow, clickedCol, size)
          ) {
            this.highlightCell(index);
          }
          // knight
          else if (
            this.settings.highlightOptions.includes("Chess: Knight") &&
            fn.testKnightCondition(index, clickedRow, clickedCol, size)
          ) {
            this.highlightCell(index);
          }
          // value
          else if (
            this.settings.highlightOptions.includes("Number") &&
            (obj.value || obj.value === 0) &&
            cell.value === obj.value
          ) {
            this.highlightCell(index);
          }
          // value + seen
          else if (
            this.settings.highlightOptions.includes("Number + Seen") &&
            (obj.value || obj.value === 0)
          ) {
            if (
              rowsWithValue.includes(fn.rowFromIndex(index, size)) ||
              colsWithValue.includes(fn.colFromIndex(index, size)) ||
              boxesWithValue.includes(fn.boxFromIndex(index, size))
            ) {
              this.highlightCell(index);
            }
          }
          // filled
          else if (
            this.settings.highlightOptions.includes("Filled") &&
            (cell.value)
          ) {
            console.log(cell.value)
            this.highlightCell(index);
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
          this.deselectCell(index);
        } else if (!this.selectedCells.includes(index)) {
          this.selectCell(index);
        }
      }
      // done with functionality, prepare for next time
      // store cursor cell and set highlighting
      if (!obj.event.shiftKey) {
        this.cursorCell = { rowId: obj.rowId, cellId: obj.cellId };
        this.setCursorIndex(index);
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
      if (e.path.length > 4) return // ignore typing in puzzle set box
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
          newCursorCell.cellId = Math.min(
            this.cursorCell.cellId + 1,
            this.settings.puzzleSize - 1
          );
          e.preventDefault();
          break;
        case "ArrowUp":
          newCursorCell.rowId = Math.max(this.cursorCell.rowId - 1, 0);
          e.preventDefault();
          break;
        case "ArrowDown":
          newCursorCell.rowId = Math.min(
            this.cursorCell.rowId + 1,
            this.settings.puzzleSize - 1
          );
          e.preventDefault();
          break;
        default:
          // handle functionality for key input (numbers, letters)
          this.handleKeyPress(e);
          return;
      }
      const index = fn.indexFromCoords(newCursorCell, this.settings.puzzleSize);
      if (!e.shiftKey && !e.ctrlKey) {
        // if no modifier, remove all selections
        this.clearAllSelections("selected");
      }
      this.selectCell(index);
      // remove the old cursor
      this.clearAllSelections("cursor");
      // set the new cursor highlighting
      // store for next use
      this.cursorCell = newCursorCell;
      this.setCursorIndex(index)
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
      // console.log("keypress caught: ", e);

      // collate useful information
      const output = {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        key: String.fromCharCode(e.keyCode),
        value: null,
        event: e
      };
      const code = e.code || e.keyCodeVal;
      // get the intended digit
      // eg shift + 2 => @
      switch (code) {
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
          output.value = code.slice(5);
          break;
        case "KeyY":
          if (output.ctrl && code == "KeyY") {
            this.redoAction();
            return;
          }
          break;
        case "KeyZ":
          if (output.ctrl && code == "KeyZ") {
            //undo function
            this.undoAction();
            return;
          }
          break;

        default:
          if (code.slice(0, 3) === "Key") {
            // letter key?
            output.value = code.slice(3);
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
          c.notesTop = fn.toggleKey(c.notesTop, output.value);
        } else if (output.ctrl && !output.shift) {
          // Add/remove keystroke to notesMid: -shift, +ctrl
          c.notesMid = fn.toggleKey(c.notesMid, output.value);
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
        this.selectCell(Number.parseInt(obj.index));
        // this.selectedCells.push(Number.parseInt(obj.index));
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
          // this.selectedCells = [];
          this.clearSelection();
          break;
        case "highlighted":
          // this.highlightedCells = [];
          this.clearHighlights();
          break;
        case "cursor":
          this.clearCursorIndex();
          // this.cursorIndexArray = [];
          break;
        case "all":
          this.clearSelection();
          this.clearHighlights();
          this.clearCursorIndex();
          // this.selectedCells = [];
          // this.highlightedCells = [];
          // this.cursorIndexArray = [];
          break;
        default:
          return;
      }
    },
    clearAllErrors() {
      this.currentState.forEach(cell => {
        cell.error = false;
      });
    },
    resetGrid() {
      this.currentState.forEach(cell => {
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
  display: flex;
  justify-content: center;
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
