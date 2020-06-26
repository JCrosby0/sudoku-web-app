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
      <!-- <el-button-group> -->
      <el-button type="primary" plain data-cy="Test" @click="DEVdummyData"
        >Test Data</el-button
      >
      <!-- </el-button-group> -->
      <!-- SAVE & RESTORE PUZZLE -->
      <el-button-group>
        <el-button type="primary" plain data-cy="Save" @click="savePuzzle"
          >Save</el-button
        >
        <el-button type="primary" plain data-cy="Load" @click="loadPuzzle"
          >Load</el-button
        >
      </el-button-group>
      <!-- CHECK, SET AND RESET PUZZLE -->
      <el-button-group>
        <el-button type="success" plain @click="checkPuzzle">Check</el-button>
        <el-button v-if="setMode" type="warning" plain @click="setPuzzle"
          >[NYI]Set</el-button
        >
        <el-button
          type="danger"
          :plain="!showWarning"
          data-cy="Reset"
          @click="confirmResetPuzzle"
          >{{ warningText }}</el-button
        >
      </el-button-group>
    </div>
  </div>
</template>

<script>
const dummyCellArray = require("../assets/dummyData");
import * as chk from "../plugins/sudokuCheck.js";
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
      dummyCellArray: dummyCellArray,
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
  computed: {
    ...mapGetters(["redoStackSize", "undoStackSize", "currentState"])
  },
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
      const payload = this.dummyCellArray;
      console.log("payload: ", payload);
      this.newAction(payload);
    },
    checkPuzzle() {
      const testConfig = [
        { active: true, test: chk.rows },
        { active: true, test: chk.cols },
        { active: true, test: chk.boxes },
        { active: true, test: chk.diagonals }
      ];
      const tests = [];
      const vals = this.currentState.map(c => Number.parseInt(c.value));
      testConfig.forEach(testCase => {
        if (testCase.active) {
          const result = testCase.test(vals);
          if (result) {
            const valid = result.every(r => chk.testUniqueLength(r));
            tests.push(valid);
          } else {
            tests.push(result);
          }
        }
      });
      if (tests.length == 0) {
        this.$message({
          message: "No tests are selected...",
          type: "warning"
        });
      } else if (tests.every(t => t)) {
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
      this.$message("Puzzle saved");
    },
    loadPuzzle() {
      this.restoreProgress();
    },
    setPuzzle() {
      this.$confirm("Is the puzzle ready to go?", "Warning").then(() => {
        this.setMode = false;
        // fire action to initialise puzzle
        this.setPuzzle();
        this.$message("Puzzle set");
      });
    },
    confirmResetPuzzle() {
      const toggleWarning = (force = null) => {
        this.showWarning = force !== null ? force : !this.showWarning;
        this.warningText = this.showWarning ? "Confirm?" : "Reset";
      };
      let warningTimeOut;
      if (!this.showWarning) {
        // provide confirmation click
        toggleWarning(true);
        warningTimeOut = setTimeout(toggleWarning, 3000);
      } else {
        // fire action to reset puzzle
        this.resetPuzzle();
        clearTimeout(warningTimeOut);
        this.$message("Puzzle reset");
        // toggleWarning(false);
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
