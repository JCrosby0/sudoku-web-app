<template>
  <div id="rules-container" class="left">
    <div class="rules">
      <h2 v-if="puzzleTitle !== ''">{{ puzzleTitle }}</h2>
      <h4>Rules:</h4>
      <ul class="left">
        <li v-for="(rule, i) in settings.rules" :key="'rule' + i">{{ rule }}</li>
      </ul>
    </div>

    <!-- CONTROLS -->
    <div class="rules-controls">
      <h4 class="title">Controls:</h4>
      <div class="toggles-array">
      <el-button-group class="toggles">
        <el-button
          v-for="toggle in toggles"
          :key="toggle"
          :type="currentToggle === toggle ? 'primary' : 'default'"
          :data-cy="toggle"
          @click="handleToggle(toggle)"
          >{{ toggle }}</el-button
        >
      </el-button-group>
      </div>
      <div class="button-array">
        <div v-for="digit in 9" :key="digit" class="button-spacing">
          <el-button
            class="button"
            type="primary"
            plain
            :data-cy="digit"
            @click="simKeyDown(digit)"
            >{{ digit }}</el-button
          >
        </div>
        </div>
        <div class="button-bottom">
          <el-button
            class="button"
            data-cy="Delete"
            @click="simKeyDown('Delete')"
            >Delete</el-button
          >
          <el-button class="button">[NYI]Color</el-button>
      </div>
      <!-- <ul>
        <li v-for="(control, i) in controls" :key="'control' + i">
          {{ control }}
        </li>
      </ul> -->
      <!-- UNDO AND REDO BUTTONS -->
      <div class="toggles-array">

        <el-button-group type="primary">
          <el-tooltip class="item" effect="dark" content="Undo" data-cy="undo" placement="top">
            <el-button :disabled="!undoStackSize" type="info" plain icon="el-icon-back" @click="undoAction">
            <!-- {{ undoStackSize && "(" + undoStackSize + ")" }} -->
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Redo" data-cy="redo" placement="top">
            <el-button :disabled="!redoStackSize" type="info" plain icon="el-icon-right" @click="redoAction">
            <!-- {{ redoStackSize && "(" + redoStackSize + ")" }} -->
            </el-button>
            </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Check Puzzle" data-cy="check" placement="top">
            <el-button type="success" plain icon="el-icon-circle-check" @click="checkPuzzle"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="Reset Puzzle" data-cy="reset" placement="top">
            <el-button
              type="danger"
              plain
              data-cy="Reset"
              icon="el-icon-circle-close" 
              @click="confirmResetPuzzle"></el-button>
          </el-tooltip>
        </el-button-group>
      </div>

      <!-- SAVE & RESTORE PUZZLE -->
      <!-- <el-button-group>
        <el-button type="primary" plain data-cy="Save" @click="savePuzzle"
          >Save</el-button
        >
        <el-button type="primary" plain data-cy="Load" @click="loadPuzzle"
          >Load</el-button
        >
      </el-button-group> -->
    
    </div>
  </div>
</template>

<script>
import * as chk from "../plugins/sudokuCheck.js";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Rules",
  props: {
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
      ]
    };
  },
  computed: {
    ...mapGetters(["redoStackSize", "undoStackSize", "currentState"]),
    puzzleTitle () {
      return this.settings.title || this.title || ''
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
    checkPuzzle() {
      const testConfig = [
        { active: true, test: chk.rows },
        { active: true, test: chk.cols },
        { active: true, test: chk.boxes },
        { active: false, test: chk.diagonals }
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
#rules-container .rules,
#rules-container .rules-controls {
  text-align: left;
  flex: 1 1 auto;
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
.button-array {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.button-spacing {
  flex: 1 1 auto;
  text-align: center;
  padding: 9px;
}
.button-bottom {
  flex: 1 1 75%;
  text-align: center;
  padding: 6px;
}
.toggles-array {
  width: 100%;
  text-align: center;
  padding-bottom: 9px;
}
.toggles {
  /* padding-bottom: 6px; */
  text-align: center;
}
.controls {
  text-align: center;
}
</style>
