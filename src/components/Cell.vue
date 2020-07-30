<template>
  <div
    :id="'r' + rowId + 'c' + cellId"
    :class="cellClassObj"
    @dragstart="handleDrag"
    @dragend="handleDrag"
    @mousedown="handleEvent"
    @mouseenter="handleMouseEnter"
    @dragover="handleDrag"
    @dragenter="handleDrag"
    @dragleave="handleDrag"
  >
    <span :class="valueClassObj">
      {{ cellObj.value }}
    </span>
    <span v-show="cellObj.value === null" class="notesTop">
      {{ notesTop }}
    </span>
    <span v-show="cellObj.value === null" class="notesMid">
      {{ notesMid }}
    </span>
    <span v-show="cellObj.value === null" class="notesBot">
      {{ notesBot }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Cell",
  props: {
    rowId: {
      required: true,
      type: Number,
      String
    },
    cellId: {
      required: true,
      type: Number,
      String
    },
    settings: {
      required: true,
      type: Object
    }
  },
  computed: {
    ...mapGetters([
      "cellDescription",
      "selectedCells",
      "highlightedCells",
      "cursorIndex"
    ]),
    cellIndex() {
      return this.rowId * this.settings.puzzleSize + this.cellId;
    },
    cellObj() {
      // const desc = this.cellDescription(this.cellIndex);
      return this.cellDescription(this.cellIndex);
    },
    // cellHeight() {
    //   const cell = document.querySelector('.cell')
    //   console.log('cell: ', cell)
    //   if (!cell) return 10
    //   const computed = getComputedStyle(cell)
    //   console.log('computed: ', computed)
    //   const height = computed["height"];
    //   return height
    // },
    notesMid() {
      return this.stringFromArray(this.cellObj.notesMid);
    },
    notesTop() {
      return this.stringFromArray(this.cellObj.notesTop).slice(0, 5);
    },
    notesBot() {
      const notes = this.stringFromArray(this.cellObj.notesTop);
      return notes.length > 5 ? notes.slice(5) : null;
    },
    valueColor() {
      if (this.cellObj.fixed) return "blue";
      else if (this.cellObj.error) return "red";
      else return "black";
    },
    valueClassObj() {
      const outer = (this.cellIndex >= this.settings.puzzleSize) ^ 2;
      return {
        value: true,
        fixed: outer ? true : this.cellObj.fixed,
        error: outer ? false : this.cellObj.error
      };
    },
    cellClassObj() {
      /**
       * class based formatting of the cell
       */
      if (this.cellIndex >= this.settings.puzzleSize ** 2) return {};
      return {
        lastOutObj: {},
        outerCell: true,
        selected: this.selectedCells.includes(this.cellIndex),
        highlighted: this.highlightedCells.includes(this.cellIndex),
        cursor: this.cursorIndex.includes(this.cellIndex),
        topBorder: this.rowId % this.settings.boxSizeVer == 0,
        bottomBorder:
          this.rowId % this.settings.boxSizeVer == this.settings.boxSizeVer - 1,
        leftBorder: this.cellId % this.settings.boxSizeHor == 0,
        rightBorder:
          this.cellId % this.settings.boxSizeHor == this.settings.boxSizeHor - 1
      };
    }
  },
  methods: {
    handleMouseEnter(e) {
      if (e.buttons) {
        this.handleDrag(e);
      }
    },
    handleEvent(e) {
      this.handleCellClicked(e);
    },
    handleDrag(e) {
      const outObj = {
        rowId: this.rowId,
        cellId: this.cellId,
        index: this.cellIndex,
        value: this.cellObj.value,
        event: e
      };
      switch (e.type) {
        case "dragstart":
          e.dataTransfer.effectAllowed = "none";
          e.dataTransfer.dropEffect = "none";
        case "dragenter":
        case "mouseenter":
          if (!this.cellClassObj.highlighted) {
            this.$emit("emitDragAdd", outObj);
          }
          break;
        case "dragleave":
        case "dragover":
          return;
          break;
        case "dragend":
          this.$emit("emitDragEnd", outObj);
          break;
        default:
          console.log("what is this drag event: ", e.type);
      }

      if (e.shiftKey || e.ctrlKey) {
        this.handleCellClicked(e);
      }
      // how to stop visible drag on the screen but still register drag events
    },
    handleCellClicked(e, qualifier = "none") {
      const outObj = {
        rowId: this.rowId,
        cellId: this.cellId,
        index: this.cellIndex,
        value: this.cellObj.value,
        qualifier: qualifier, // not needed?
        event: e
      };
      this.$emit("emitCellClicked", outObj);
    },
    // cellFontSize(spanType) {
    //   console.log('cellFontSize called', spanType)
    //   console.log('this.cellHeight', this.cellHeight)
    //   switch(spanType) {
    //     case 'notesTop':
    //       return {fontSize: this.cellHeight/2.5 + 'px'};
    //     case 'notesMid':
    //       return {fontSize: this.cellHeight/2 + 'px'};
    //     case 'value':
    //       return {fontSize: this.cellHeight/1.5 + 'px' };
    //     default:
    //       return {fontSize: this.cellHeight/2 + 'px'};

    //   }
    // },
    stringFromArray(arr) {
      let output = "";
      arr.forEach(a => (output += a));
      if (output == "") output = "";
      return output;
    }
  }
};
</script>

<style>
.outerCell {
  font-family: Questrial, Arial, Helvetica, sans-serif;
  color: blue;
  background-color: #fefefe;
  height: 100%;
  border: 1px black solid;
  box-sizing: border-box;
  position: relative;
}
.value,
.notesTop,
.notesMid,
.notesBot {
  cursor: default;
  position: absolute;
}
.value {
  transform: translate(-50%, -50%);
  /* font-size: 2.2rem; */
  text-align: center;
  top: 50%;
  width: 100%;
  user-select: none;
}
.notesTop,
.notesBot {
  font-size: 0.4em;
  font-stretch: expanded;
  text-align: left;
  user-select: none;
  text-anchor: middle;
  left: 5%;
  letter-spacing: 3px;
}
.notesMid {
  top: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
  font-size: 0.5em;
  text-anchor: middle;
  text-align: center;
  user-select: none;
}
.notesTop {
  top: 5%;
}
.notesBot {
  bottom: 5%;
}
.highlighted {
  background-color: rgb(221, 255, 187);
}
.selected {
  background-color: rgb(255, 221, 187);
}
.cursor {
  background-color: lightsalmon;
}
.topBorder {
  border-top: 2px black solid;
  box-sizing: border-box;
}
.bottomBorder {
  border-bottom: 2px black solid;
}
.leftBorder {
  border-left: 2px black solid;
}
.rightBorder {
  border-right: 2px black solid;
}
.fixed {
  color: black;
}
.error {
  color: red;
}
</style>
