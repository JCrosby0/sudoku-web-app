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
        top: outerMargin.top + 'px' -->
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
          :cells="cells.slice(9 * i, 9 * i + 9)"
          :style="{
            height: cellLength * 1 + 'px',
            width: cellLength * 9 + 'px'
          }"
          class="grid-row"
          @cellClicked="handleCellClicked"
        ></Row>
      </div>
    </div>
  </div>
</template>

<script>
import Row from "./Row.vue";
// generate empty cell data
let emptyCellArray = new Array(81).fill({});
emptyCellArray.forEach((_, i) => {
  emptyCellArray[i] = {
    value: Math.random() < 0.3 ? Math.floor(Math.random() * 10) : null,
    notesTop: Math.random() < 0.5 ? [1, 2, 3, 4, 5, 6, 7] : [],
    notesMid: Math.random() < 0.5 ? [3, 4] : [],
    bgColor: null,
    bgImg: null,
    cursor: false,
    selected: false,
    fixed: Math.random() < 0.1 ? true : false,
    error: Math.random() < 0.1 ? true : false
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
  return (
    (Math.abs(rowFromIndex(index) - row) == 1 &&
      Math.abs(colFromIndex(index) - col) == 2) ||
    (Math.abs(rowFromIndex(index) - row) == 2 &&
      Math.abs(colFromIndex(index) - col) == 1)
  );
};
const testKingCondition = (index, row, col) => {
  return (
    Math.abs(rowFromIndex(index) - row) <= 1 &&
    Math.abs(colFromIndex(index) - col) <= 1
  );
};

const toggleKey = (array, key) => {
  const keyNum = Number.parseInt(key);
  const index = array.indexOf(keyNum);
  if (index >= 0) {
    array.splice(index, 1);
  } else {
    array.push(keyNum);
  }
  return array.sort();
};

export default {
  name: "Grid",
  components: {
    Row
  },
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
      cells: emptyCellArray
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.updateWindowSize();
      // resize for sizing the grid
      window.addEventListener("resize", this.updateWindowSize);
      // keypress for cell inputs
      window.addEventListener("keypress", this.handleKeyPress, false);
      // keydown for arrow keys
      window.addEventListener("keydown", this.handleKeyDown, false);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowSize);
    window.removeEventListener("keypress", this.handleKeyPress, false);
    window.addEventListener("keydown", this.handleKeyDown, false);
  },
  methods: {
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
     * click outer should:
     * remove all cell selection
     * remove cursor cell selection
     * */
    handleClickOuter() {
      this.cursorCell = { rowId: null, cellId: null };
      this.clearAllSelections();
    },
    /**
     * clicked cell should
     * become the cursor
     * handle ctrl+click and shift+click as expected adding to selection
     * with alt, auto highlight cells
     */
    handleCellClicked(obj) {
      // first priority - update cursor:
      this.clearAllSelections("cursor");

      // first assuming no ctrl / shift
      if (!obj.event.shiftKey && !obj.event.ctrlKey) {
        this.clearAllSelections();
      }
      if (obj.event.shiftKey) {
        /* TODO: map from one row/cell to the next,
         and get cells in a line */
      }
      if (obj.event.altKey && !obj.event.shiftKey && !obj.event.ctrlKey) {
        // select box + row + col

        const clickedRow = obj.rowId;
        const clickedCol = obj.cellId;
        const clickedBox =
          Math.floor(clickedCol / 3) + 3 * Math.floor(clickedRow / 3);
        this.cells.forEach((cell, index) => {
          // row
          if (
            this.settings.highlightOptions.includes("Row") &&
            rowFromIndex(index) == clickedRow
          ) {
            this.cells[index].selected = true;
          }
          // col
          else if (
            this.settings.highlightOptions.includes("Column") &&
            colFromIndex(index) == clickedCol
          ) {
            this.cells[index].selected = true;
          }
          // box
          else if (
            this.settings.highlightOptions.includes("Box") &&
            boxFromIndex(index) == clickedBox
          ) {
            this.cells[index].selected = true;
          }
          // king
          else if (
            this.settings.highlightOptions.includes("Chess: King") &&
            testKingCondition(index, clickedRow, clickedCol)
          ) {
            this.cells[index].selected = true;
          }
          // knight
          else if (
            this.settings.highlightOptions.includes("Chess: Knight") &&
            testKnightCondition(index, clickedRow, clickedCol)
          ) {
            this.cells[index].selected = true;
          }
          // value
          else if (
            this.settings.highlightOptions.includes("Number") &&
            (obj.value || obj.value === 0) &&
            this.cells[index].value === obj.value
          ) {
            this.cells[index].selected = true;
          }
        });
      }
      // store cursor cell
      this.cursorCell = { rowId: obj.rowId, cellId: obj.cellId };
      // set cell highlighting / selection
      const index = indexFromCoords(obj);
      this.cells[index].selected = true;
      this.cells[index].cursor = true;
    },
    /**
     * keydown is an arrow key, of a modifier
     */
    handleKeyDown(e) {
      // e.preventDefault();
      // console.log("keydown caught: ", e);
      let newCursorCell = {
        cellId: this.cursorCell.cellId,
        rowId: this.cursorCell.rowId
      };
      switch (e.key) {
        case "ArrowLeft":
          newCursorCell.cellId = Math.max(this.cursorCell.cellId - 1, 0);
          break;
        case "ArrowRight":
          newCursorCell.cellId = Math.min(this.cursorCell.cellId + 1, 8);
          break;
        case "ArrowUp":
          newCursorCell.rowId = Math.max(this.cursorCell.rowId - 1, 0);
          break;
        case "ArrowDown":
          newCursorCell.rowId = Math.min(this.cursorCell.rowId + 1, 8);
          break;
        default:
          // this exits further functionality for modifiers
          return;
      }
      // if no modifier, remove selections
      if (!e.shiftKey && !e.ctrlKey) {
        this.clearAllSelections("selected");
      }
      // remove the old cursor
      this.clearAllSelections("cursor");
      // set the new cursor highlighting
      const cell = this.cells[indexFromCoords(newCursorCell)];
      cell.cursor = true;
      cell.selected = true;
      // store for next use
      this.cursorCell = newCursorCell;
    },
    /**
     * Keypress is a number or letter
     */
    handleKeyPress(e) {
      e.preventDefault();

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
        default:
      }
      /** if some cells are selected, enter value based on modifier */
      // if > 0 cells selected
      if (this.cells.some(c => c.selected)) {
        // for each cell
        this.cells.forEach(c => {
          if (c.selected) {
            if (e.code === "Delete") {
              c.value = null;
              c.notesTop = [];
              c.notesMid = [];
              c.bgColor = null;
              c.selected = false;
              c.error = false;
            } else if (output.shift && !output.ctrl) {
              // notesTop: +shift, -ctrl
              c.notesTop = toggleKey(c.notesTop, output.value);
            } else if (output.ctrl && !output.shift) {
              // notesMid: -shift, +ctrl
              c.notesMid = toggleKey(c.notesMid, output.value);
            } else if (!output.ctrl && !output.shift) {
              // value: -shift, -ctrl
              c.value = output.key;
            } else {
              // this applies to every cell
              console.log("what is this key combination?", output, c);
            }
          }
        });
      }
    },
    clearAllSelections(prop = "selected") {
      // clear all selection highlighting from cells
      this.cells.forEach(cell => {
        cell[prop] = false;
      });
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
          cell.selected = false;
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
