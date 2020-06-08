<template>
  <div
    :class="cellClassObj"
    @keyup="handleKeyPress"
    @dragstart="handleDrag"
    @mousedown="handleEvent"
    @dragleave="handleDrag"
  >
    <!-- @click="handleEvent" -->
    <!-- @dragover="handleDrag" -->
    <!-- @mousedown="handleEvent" -->
    <span :class="valueClassObj">
      {{ cellObj.value }}
    </span>
    <span v-show="[null, '', ' '].includes(cellObj.value)" class="notesTop">
      {{ notesTop }}
    </span>
    <span v-show="[null, '', ' '].includes(cellObj.value)" class="notesMid">
      {{ notesMid }}
    </span>
    <span v-show="[null, '', ' '].includes(cellObj.value)" class="notesBot">
      {{ notesBot }}
    </span>
  </div>
</template>

<script>
export default {
  name: "Cell",
  props: {
    rowId: {
      required: true,
      type: Number
    },
    cellId: {
      required: true,
      type: Number
    },
    cellObj: {
      required: false,
      type: Object,
      default: () => {
        return {
          value: null,
          notesTop: [],
          notesMid: [],
          bgColor: null,
          bgImg: null,
          selected: false,
          fixed: false,
          error: false
        };
      }
    }
  },
  computed: {
    notes() {
      return this.stringFromArray(this.cellObj.notesTop);
    },
    notesTop() {
      return this.notes.slice(0, 5);
    },
    notesMid() {
      return this.stringFromArray(this.cellObj.notesMid);
    },
    notesBot() {
      return this.notes.length > 5 ? this.notes.slice(5) : null;
      // return this.stringFromArray(this.cellObj.notesTop).slice(3, 3);
    },
    valueColor() {
      if (this.cellObj.fixed) return "blue";
      else if (this.cellObj.error) return "red";
      else return "black";
    },
    valueClassObj() {
      return {
        value: true,
        fixed: this.cellObj.fixed,
        error: this.cellObj.error
      };
    },
    cellClassObj() {
      return {
        outerCell: true,
        selected: this.cellObj.selected,
        cursor: this.cellObj.cursor,
        topBorder: this.rowId % 3 == 0,
        bottomBorder: this.rowId % 3 == 2,
        leftBorder: this.cellId % 3 == 0,
        rightBorder: this.cellId % 3 == 2
      };
    }
  },
  methods: {
    handleEvent(e) {
      console.log("event registered: ", e.type, e, this.rowId, this.cellId);
      this.handleCellClicked(e);
    },
    handleDrag(e) {
      console.log("event registered: ", e.type, e, this.rowId, this.cellId);
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.dropEffect = "none";
      if (e.shiftKey || e.ctrlKey) {
        this.handleCellClicked(e);
      }
      // how to stop visible drag on the screen but still register drag events
    },
    handleCellClicked(e, qualifier = "none") {
      const outObj = {
        rowId: this.rowId,
        cellId: this.cellId,
        value: this.cellObj.value,
        qualifier: qualifier, // not needed?
        event: e
      };
      this.$emit("cellClicked", outObj);
    },
    handleKeyPress(e) {
      // console.log("e: ", e);
      e.dummy = 42;
    },
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
  width: 100%;
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
  transform: translate(-50%, -50%);
}
.value {
  font-size: 2.2rem;
  text-align: center;
  top: 50%;
  width: 100%;
  user-select: none;
}
.notesTop,
.notesBot {
  font-size: 0.8rem;
  font-stretch: expanded;
  text-align: left;
  user-select: none;
}
.notesMid {
  top: 50%;
  width: 100%;
  font-size: 1.2rem;
  text-align: center;
  user-select: none;
}
.notesTop {
  top: 15%;
}
.notesBot {
  bottom: -15%;
}
.selected {
  background-color: #ffddbb;
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
