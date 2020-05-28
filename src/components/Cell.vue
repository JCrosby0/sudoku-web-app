<template>
  <div
    :class="cellClassObj"
    :style="`{ background-color: ${cellObj.selected} }`"
    @click.capture="handleCellClicked"
    @keyup="handleKeyPress"
    @dragstart.prevent="handleDragStart"
    @dragover.capture="handleCellClicked('dragover')"
    @dragenter.capture="handleCellClicked('dragenter')"
  >
    <div :class="valueClassObj">
      {{ cellObj.value }}
    </div>
    <div v-show="!cellObj.value && !cellObj.value === 0" class="notesTop">
      {{ notesTop }}
    </div>
    <div v-show="!cellObj.value && !cellObj.value === 0" class="notesMid">
      {{ notesMid }}
    </div>
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
    notesTop() {
      return this.stringFromArray(this.cellObj.notesTop);
    },
    notesMid() {
      return this.stringFromArray(this.cellObj.notesMid);
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
        topBorder: this.rowId % 3 == 0,
        bottomBorder: this.rowId % 3 == 2,
        leftBorder: this.cellId % 3 == 0,
        rightBorder: this.cellId % 3 == 2
      };
    }
  },
  methods: {
    handleCellClicked(e, qualifier) {
      console.log("qualifier: ", qualifier);
      console.log("e: ", e);
      const outObj = {
        rowId: this.rowId,
        cellId: this.cellId,
        value: this.cellObj.value,
        event: e
      };
      this.$emit("cellClicked", outObj);
    },
    handleKeyPress(e) {
      console.log("e: ", e);
    },
    handleDragStart(e) {
      e.preventDefault();
    },
    stringFromArray(arr) {
      let output = "";
      arr.forEach(a => (output += a));
      return output;
    }
  }
};
</script>

<style>
.outerCell {
  border: 1px blue solid;
  box-sizing: border-box;
  background-color: #fefefe;
  height: 100%;
  width: 100%;
  border: 1px black solid;
  box-sizing: border-box;
}
.value,
.notesTop,
.notesMid {
  cursor: default;
}
.value {
  font-size: 2.2rem;
  text-align: center;
  position: relative;
  top: 22%;
}
.notesTop {
  font-size: 1rem;
  text-align: left;
}
.notesMid {
  position: relative;
  top: 14%;
  text-anchor: middle;
  font-size: 1rem;
  text-align: center;
}
.selected {
  background-color: yellow;
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
  color: blue;
}
.error {
  color: red;
}
</style>
