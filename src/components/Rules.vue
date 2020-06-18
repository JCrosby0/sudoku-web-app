<template>
  <div id="rules-container" class="left">
    <div class="rules">
      <h2 v-if="title !== ''">{{ title }}</h2>
      <h4>Rules:</h4>
      <ul class="left">
        <li v-for="(rule, i) in rules" :key="'rule' + i">{{ rule }}</li>
      </ul>
    </div>
    <div class="rules-controls">
      <h4>Controls:</h4>
      <ul>
        <li v-for="(control, i) in controls" :key="'control' + i">
          {{ control }}
        </li>
      </ul>
      <!-- UNDO AND REDO BUTTONS -->
      <el-button-group type="primary">
        <el-button :disabled="!undoStackSize" @click="undoAction"
          >Undo {{ undoStackSize && "(" + undoStackSize + ")" }}</el-button
        >
        <el-button :disabled="!redoStackSize" @click="redoAction"
          >Redo {{ redoStackSize && "(" + redoStackSize + ")" }}</el-button
        >
      </el-button-group>
      <!-- DEV INSERT DUMMY DATA -->
      <el-button-group>
        <el-button type="primary" plain @click="DEVdummyData"
          >[Dev] Test Data</el-button
        >
      </el-button-group>
      <!-- SAVE & RESTORE PUZZLE -->
      <el-button-group>
        <el-button type="primary" plain @click="savePuzzle"
          >Save State</el-button
        >
        <el-button type="primary" plain @click="loadPuzzle"
          >Load State</el-button
        >
      </el-button-group>
      <!-- CHECK, SET AND RESET PUZZLE -->
      <el-button-group>
        <el-button type="success" plain @click="checkPuzzle">Check</el-button>
        <el-button v-if="setMode" type="warning" plain @click="setPuzzle"
          >Set</el-button
        >
        <el-button type="danger" :plain="!showWarning" @click="resetPuzzle">{{
          warningText
        }}</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
const emptyCellArray = require("../assets/dummyData");
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Rules",
  props: {
    title: {
      required: false,
      type: String,
      default: () => ""
    },
    rules: {
      required: false,
      type: Array,
      default: () => {
        return [
          "Normal Sudoku rules apply",
          "Additionally, cells connected by a Knight's move cannot contain the same digit.",
          "Along each thermometer, digits must increase starting from the bulb.",
          "Cages contain unique numbers summing to the indicated total.",
          "Clues outside the grid indicate the sum of digits between the 1 and 9 in the indicated column/row."
        ];
      }
    }
  },
  data() {
    return {
      emptyCellArray: emptyCellArray,
      showWarning: false,
      warningText: "Reset",
      setMode: true,
      controls: [
        "Value: No modifier",
        "Top Notes: hold Shift",
        "Central Notes: hold Control",
        "Highlighting: hold Alt and click"
      ]
    };
  },
  computed: { ...mapGetters(["redoStackSize", "undoStackSize"]) },
  methods: {
    ...mapActions([
      "newAction",
      "saveProgress",
      "restoreProgress",
      "setPuzzle",
      "resetPuzzle",
      "undoAction",
      "redoAction"
    ]),
    DEVdummyData() {
      const payload = this.emptyCellArray;
      this.newAction(payload);
    },
    checkPuzzle() {
      // TODO: Puzzle check logic
      // test if puzzle is correct, then:
      const pass = false;
      if (pass) {
        this.$message({
          message: "Looks good to me!",
          type: "success"
        });
      } else {
        this.$message({
          message: "Something's not quite right...",
          type: "error"
        });
      }
    },
    savePuzzle() {
      this.saveProgress();
    },
    loadPuzzle() {
      this.restoreProgress();
    },
    setPuzzle() {
      this.$confirm("Is the puzzle ready to go?", "Warning").then(() => {
        this.setMode = false;
        // fire action to initialise puzzle
        this.setPuzzle;
      });
    },
    resetPuzzle() {
      const toggleWarning = (force = null) => {
        if (force !== null) {
          this.showWarning = force;
        } else {
          this.showWarning = !this.showWarning;
        }
        this.warningText = this.showWarning ? "Confirm?" : "Reset";
      };
      let warningTimeOut;
      if (!this.showWarning) {
        // provide confirmation click
        toggleWarning(true);
        warningTimeOut = setTimeout(toggleWarning, 3000);
      } else {
        // fire action to reset puzzle
        this.resetPuzzle;
        clearTimeout(warningTimeOut);
        this.$message("Puzzle reset").then(() => {
          toggleWarning(false);
        });
      }
    }
  }
};
</script>

<style>
#rules-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
#rules-container .rules,
#rules-container .rules-controls {
  text-align: left;
  flex: 1 1 50%;
  border: 1px solid #eee;
  padding: 0 12px;
  margin: 12px;
}
.left {
  text-align: left;
}
li {
  list-style: "-";
}
ul {
  padding-left: 0;
}
</style>
