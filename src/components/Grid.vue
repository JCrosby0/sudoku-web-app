<template>
  <div class="main">
    <div
      :style="{
        height: cellLength * 13 + 'px',
        width: cellLength * 13 + 'px'
      }"
      class="outer"
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
        class="inner"
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
          class="row"
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
    notesTop: [1, 2],
    notesMid: [3, 4],
    bgColor: null,
    bgImg: null,
    selected: false,
    fixed: Math.random() < 0.1 ? true : false,
    error: Math.random() < 0.1 ? true : false
  };
});

export default {
  name: "Grid",
  components: {
    Row
  },
  data() {
    return {
      cellLength: null,
      lastCellClicked: { rowId: null, cellId: null },
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
      window.addEventListener("resize", this.updateWindowSize);
      this.updateWindowSize();
    });
    window.addEventListener("keypress", this.handleKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowSize);
  },
  methods: {
    updateWindowSize() {
      this.cellLength = Math.min(window.innerWidth, window.innerHeight) / 14;
      this.outerMargin.left = (window.innerWidth - this.cellLength * 13) / 2;
      this.outerMargin.top = (window.innerHeight - this.cellLength * 13) / 2;
    },
    styleObject(grid = "inner") {
      const len = grid === "inner" ? 9 : 13;
      return `{
        width: ${this.cellLength * len},
        height: ${this.cellLength * len}
      }`;
    },
    handleClickOuter() {
      this.lastCellClicked = { rowId: null, cellId: null };
      this.clearAllSelections();
    },
    handleCellClicked(obj) {
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
        const rowFromIndex = index => Math.floor(index / 9);
        const colFromIndex = index => index % 9;
        const boxFromIndex = index =>
          Math.floor(colFromIndex(index) / 3) +
          3 * Math.floor(rowFromIndex(index) / 3);
        const clickedRow = obj.rowId;
        const clickedCol = obj.cellId;
        const clickedBox =
          Math.floor(clickedCol / 3) + 3 * Math.floor(clickedRow / 3);
        this.cells.forEach((cell, index) => {
          // row
          if (rowFromIndex(index) == clickedRow) {
            this.cells[index].selected = true;
          }
          // col
          else if (colFromIndex(index) == clickedCol) {
            this.cells[index].selected = true;
          }
          // box
          else if (boxFromIndex(index) == clickedBox) {
            this.cells[index].selected = true;
          }
          // king
          // else if (
          //   Math.abs(rowFromIndex(index) - clickedRow) <= 1 &&
          //   Math.abs(colFromIndex(index) - clickedCol) <= 1
          // ) {
          //   this.cells[index].selected = true;
          // }
          // knight
          // else if (
          //   (Math.abs(rowFromIndex(index) - clickedRow) == 1 &&
          //     Math.abs(colFromIndex(index) - clickedCol) == 2) ||
          //   (Math.abs(rowFromIndex(index) - clickedRow) == 2 &&
          //     Math.abs(colFromIndex(index) - clickedCol) == 1)
          // ) {
          //   this.cells[index].selected = true;
          // }
          // value
          else if (
            (obj.value || obj.value === 0) &&
            this.cells[index].value === obj.value
          ) {
            this.cells[index].selected = true;
          }
        });
      }
      this.cellLastClicked = { rowId: obj.rowId, cellId: obj.cellId };
      const index = obj.rowId * 9 + obj.cellId;
      this.cells[index].selected = true;
    },
    toggleKey(array, key) {
      const index = array.indexOf(key);
      if (~index) {
        array.slice(index);
      } else {
        array.push(index);
      }
    },
    handleKeyPress(e) {
      const output = {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        key: String.fromCharCode(e.keyCode),
        event: e
      };
      console.log("output: ", output);
      // if cells are selected, do stuff
      if (this.cells.some(c => c.selected)) {
        // for each cell
        this.cells.forEach(c => {
          // if the cell is selected, and shift was held
          if (c.selected && output.shift && !output.ctrl) {
            this.toggleKey(c.notesTop, output.key);
            // this needs to be toggle
          } else if (c.selected && output.ctrl && !output.shift) {
            this.toggleKey(c.notesMid, output.key);
          } else if (c.selected && !output.ctrl && !output.shift) {
            c.value = output.key;
          } else {
            console.log("Unhandled key combination: ", output);
          }
        });
      }
    },
    clearAllSelections() {
      // clear all selection highlighting from cells
      console.log("cell selection cleared");
      this.cells.forEach((_, i) => {
        this.cells[i].selected = false;
      });
    }
  }
};
</script>

<style>
.main {
  width: 100%;
  height: 100%;
}
.outer {
  position: relative;
  background: lightgrey;
}
.inner {
  background: grey;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: left;
  border: 2px black solid;
}
.row {
  flex: 1 1 auto;
  border: 0;
  /* border: 1px red solid;
  box-sizing: border-box; */
}
</style>
