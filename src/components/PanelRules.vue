<template>
  <div id="rules-container" class="left panel" :style="stylePanel">
    <el-tabs type="border-card" tab-position="top">
      <!-- RULES -->
      <el-tab-pane label="Rules" class="panel panel-rules">
        <div class="rules">
          <h2 v-if="puzzleTitle !== ''">{{ puzzleTitle }}</h2>
          <ul class="left">
            <li v-for="(rule, i) in settings.rules" :key="'rule' + i">{{ rule }}</li>
          </ul>
        </div>
      </el-tab-pane>
      <!-- CONTROLS -->
      <el-tab-pane label="Input" class="panel panel-controls">
        <div class="rules-controls">
          <div class="controls-orientation" :style="styleOrientation">
            <div class="button-array-toggles" :style="styleButtonArrayToggles">
              <!-- <el-button-group class="toggles"> -->
              <el-button
                v-for="toggle in toggles"
                :key="toggle"
                :type="currentToggle === toggle ? 'primary' : 'default'"
                :data-cy="toggle"
                size="small"
                class="button-toggle"
                width="100px"
                @click="handleToggle(toggle)"
                >{{ toggle }}</el-button
              >
              <!-- </el-button-group> -->
            </div>
            <div class="button-array-digits" :style="styleButtonArrayDigits">
              <div v-for="digit in 9"
                :key="digit"
                class="button-spacing">
                <el-button
                  class="button"
                  type="primary"
                  size="small"
                  plain
                  :data-cy="digit"
                  @click="simKeyDown(digit)"
                  >{{ digit }}</el-button
                >
              </div>
            </div>
            <div class="button-array-other" :style="styleButtonArrayToggles">
              <el-button
                class="button-other"
                size="small"
                data-cy="Delete"
                @click="simKeyDown('Delete')"
                >Delete</el-button
              >
              <el-button size="small" class="button-other">Color</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- NOTES -->
      <el-tab-pane label="Notes" class="panel panel-notes">
        <textarea rows="8" cols="34" class="input-notes"/>
      </el-tab-pane>
      <!-- OTHER FUNCTIONALITY -->
      <el-tab-pane label="Other" clas="panel panel-other">
        <!-- UNDO AND REDO BUTTONS -->
        <div class="other-buttons-array">
          <el-button-group type="primary">
            <el-tooltip class="item" effect="dark" content="Undo" data-cy="undo" placement="top">
              <el-button :disabled="!undoStackSize" type="info" plain icon="el-icon-back" @click="undoAction">
              <!-- {{ undoStackSize && "(" + undoStackSize + ")" }} -->Undo
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Redo" data-cy="redo" placement="top">
              <el-button :disabled="!redoStackSize" type="info" plain icon="el-icon-right" @click="redoAction">
              <!-- {{ redoStackSize && "(" + redoStackSize + ")" }} -->Redo
              </el-button>
              </el-tooltip>
          </el-button-group>
          <el-button-group type="primary">
            <el-tooltip class="item" effect="dark" content="Check Puzzle" data-cy="check" placement="top">
              <el-button type="success" plain icon="el-icon-circle-check" @click="checkPuzzle">Check</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Reset Puzzle" data-cy="reset" placement="top">
              <el-button
                type="danger"
                plain
                data-cy="Reset"
                icon="el-icon-circle-close" 
                @click="confirmResetPuzzle">Reset</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </el-tab-pane>
    </el-tabs>
    <CheckPuzzle
      :show="showTestResults"
      :test-config="testConfig"
      @hide="hideTestResults"
      />
  </div>
</template>

<script>
import * as chk from "../plugins/sudokuCheck.js";
import CheckPuzzle from "./CheckPuzzle.vue"
import { mapActions, mapGetters } from "vuex";

const testConfig = [
  { active: true, test: chk.complete, description: "Values in every cell", result: null },
  { active: true, test: chk.rows, description: "Unique values in Rows", result: null },
  { active: true, test: chk.cols, description: "Unique values in Columns", result: null },
  { active: true, test: chk.boxes, description: "Unique values in Boxes", result: null },
  { active: false, test: chk.diagonals, description: "Unique values on diagonals", result: null }
];

export default {
  name: "Rules",
  components: { CheckPuzzle },
  props: {
    orientation: {
      required: false,
      type: String,
      default: () => 'horizontal',
    },
    settings: {
      required: true,
      type: Object
    },
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
      // input toggles
      toggles: ["Normal", "Top", "Mid"],
      currentToggle: "Normal",
      lastToggle: "Normal",
      // input explanation / help
      controls: [
        "Value: No modifier",
        "Top Notes: hold Shift",
        "Central Notes: hold Control",
        "Highlighting: hold Alt and click"
      ],
      testConfig: testConfig,
      showTestResults: false,
    };
  },
  computed: {
    ...mapGetters(["redoStackSize", "undoStackSize", "currentState"]),
    puzzleTitle () {
      return this.settings.title || this.title || ''
    },
    styleOrientation () {
      return {
        flexDirection: (this.orientation === 'horizontal') ? 'column' : 'row',
      }
    },
    styleButtonArrayToggles () {
      return {
        flexDirection: (this.orientation === 'horizontal') ? 'row' : 'column',
        justifyContent: 'space-between'
      }
    },
    styleButtonArrayDigits () {
      return {
        flex: (this.orientation === 'horizontal') ? '0 1 auto' : '0 1 120px;'
      }
    },
    stylePanel () {
      return {
        height: (this.orientation === 'horizontal') ? '100%' : '226px'
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      // keyup/down listeners to make the toggles respond to ctrl/shift
      window.addEventListener("keydown", this.handleKeyDown, false);
      window.addEventListener("keyup", this.handleKeyUp, false);
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown, false);
    window.removeEventListener("keydown", this.handleKeyUp, false);
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
    hideTestResults() {
      this.showTestResults = false
    },
    checkPuzzle() {
      const testConfig = this.testConfig
      const tests = [];
      const vals = this.currentState.map(c => Number.parseInt(c.value));
      console.log('vals: ', vals)
      testConfig.forEach(testCase => {
        if (testCase.active) {
          const result = testCase.test(vals);
          console.log('result: ', result)
          if (result) {
            if (Array.isArray(result)) {
              const valid = result.every(r => chk.testUniqueLength(r));
              tests.push(valid);
              testCase.result = true
            } else {
              tests.push(result) // if the test resturns truthy
              testCase.result= result
            }
          } else {
            tests.push(result);
            testCase.result = false
          }
        }
      });
       if (tests.length == 0) {
        this.$message({
          message: "No tests are selected...",
          type: "warning"
        });
      } else if (tests.every(t => t)) {
        console.log('tests: ', tests)
        this.showTestResults = true
        // this.$message({
        //   message: "Looks good to me!",
        //   type: "success"
        // });
      } else {
        this.showTestResults = true
        // this.$message({
        //   message: "Something's not quite right...",
        //   type: "error"
        // });
      }
    },
    savePuzzle() {
      this.saveProgress();
      this.$message("Puzzle saved");
    },
    loadPuzzle() {
      this.restoreProgress();
    },
    confirmResetPuzzle() {
      this.$confirm('This will reset the puzzle. Progress will be lost. ', 'Warning', {
          confirmButtonText: 'Reset',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'Reset completed'
          });
          this.resetPuzzle();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Reset canceled'
          });          
        });
    },
    handleToggle(t) {
      if (t === "down") {
        this.lastToggle = JSON.parse(JSON.stringify(this.currentToggle));
      } else if (t === "up") {
        this.currentToggle = JSON.parse(JSON.stringify(this.lastToggle));
      } else {
        this.currentToggle = t;
      }
    },
    incrementToggle() {
      const index = this.toggles.indexOf(this.currentToggle);
      const newIndex = (index + 1) % this.toggles.length;
      this.currentToggle = this.toggles[newIndex];
      this.lastToggle = this.toggles[newIndex];
    },
    handleKeyDown(e) {
      if (e.path.length > 4) return
      switch (e.code) {
        case "ShiftLeft":
        case "ShiftRight":
          this.handleToggle("down");
          this.currentToggle = "Top";
          break;
        case "ControlLeft":
        case "ControlRight":
          this.handleToggle("down");
          this.currentToggle = "Mid";
          break;
        case "Space":
          this.incrementToggle();
          e.preventDefault();
          break;
        default:
          return;
      }
    },
    handleKeyUp(e) {
      switch (e.code) {
        case "ShiftLeft":
        case "ShiftRight":
        case "ControlLeft":
        case "ControlRigth":
          this.handleToggle("up");
          break;
        default:
          return;
      }
    },
    simKeyDown(digit) {
      const keyCode = isNaN(digit) ? digit : "Digit" + digit;
      const keyTable = {
        Backspace: 8,
        Delete: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57
      };
      const KeyboardEventInit = {
        key: digit, // type: DOMString, key
        code: keyCode, // type: DOMString, code
        location: 0, // type: unsigned long, location
        ctrlKey: this.currentToggle === "Mid",
        altKey: false,
        shiftKey: this.currentToggle === "Top",
        metaKey: false,
        repeat: false,
        isComposing: false,
        charCode: 0, // type: unsigned long, charCode
        keyCode: keyTable[digit], // type: unsigned long, keyCode,
        which: keyTable[digit]
      };
      const kbEvent = new KeyboardEvent("keydown", KeyboardEventInit);
      window.dispatchEvent(kbEvent);
    }
  }
};
</script>

<style>
#rules-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
#rules-container .rules {
  text-align: left;
  flex: 1 1 100%;
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
.controls-orientation {
  display: flex;
  justify-content: center;
  overflow: auto;
}
.button-array-toggles,
.button-array-other {
  /* text-align: center; */
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
}
.button-array-toggles > .button-toggle,
.button-array-other > .button-other {
  margin: 10px 0 !important;
  /* overwrite element adding margin to two consecutive buttons */
  flex: 1 1 20%;
}
.toggles {
  text-align: center;
}
.button-array-digits {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
  /* flex: 0 0 120px; */
}
.button-spacing {
  flex: 1 1 33%;
  text-align: center;
  margin: 0.5em 0;
 }
.controls {
  text-align: center;
}
.other-buttons-array,
.input-notes {
  height: 150px;
  width: 100%;
  box-sizing: border-box;
}
.panel-notes {
  text-align: center;
}
.panel-notes, 
.panel-rules,
.panel-other,
.panel-controls {
  height: 100%;
}
/* .panel {
  height: 226px;
} */
</style>
