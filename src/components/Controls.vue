<template>
  <div class="left rules-container">
    <div class="rules">
      <h4>Rules:</h4>
      <ul class="left">
        <li v-for="(rule, i) in rules" :key="'rule' + i">{{ rule }}</li>
      </ul>
    </div>
    <div class="controls">
      <h4>Controls:</h4>
      <ul>
        <li v-for="(control, i) in controls" :key="'control' + i">
          {{ control }}
        </li>
      </ul>
      <el-button-group>
        <el-button type="primary" plain @click="DEVdummyData"
          >[Dev] Test Data</el-button
        >
      </el-button-group>
      <el-button-group>
        <el-button type="primary" plain @click="savePuzzle"
          >Save State</el-button
        >
        <el-button type="primary" plain @click="loadPuzzle"
          >Load State</el-button
        >
      </el-button-group>
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
import { mapActions } from "vuex";
export default {
  name: "Controls",
  props: {
    rules: {
      required: false,
      type: Array,
      default: () => {
        return ["Normal Sudoku rules apply"];
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
        "Value: Click cell & type",
        "Top Notes: Click cell, hold Shift and type",
        "Central Notes: Click cell, hold Ctrl and type",
        "Highlighting: Hold Alt and click cell"
      ]
    };
  },
  methods: {
    ...mapActions([
      "newAction",
      "saveProgress",
      "restoreProgress",
      "setPuzzle",
      "resetPuzzle"
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
.rules-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.rules-container .rules,
.rules-container .controls {
  flex: 1 1 50%;
  border: 1px solid #eee;
  padding: 0 12px;
  margin: 12px;
}
.left {
  text-align: left;
}
li {
  list-style: none;
}
ul {
  padding-left: 0;
}
</style>
