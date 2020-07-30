<template>
  <el-drawer
    id="settings-container"
    :visible.sync="showDrawer"
    :before-close="handleClose"
    :direction="direction"
    :size="size"
  >
  <h4 slot="title" class="left">Puzzle Set Mode</h4>
  <div id="set-container" class="left">
    <div class="controls left">
      <ul>
        <li>Puzzle Title</li>
        <el-input v-model="puzzleTitle" placeholder="My Puzzle"></el-input>
        <li>Select Rules that apply</li>
          <el-select v-model="rules" size="large" multiple placeholder="Select">
            <el-option
              v-for="item in rulesets"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        <li>Size of grid</li>
        <el-slider
          v-model="settings.puzzleSize"
          data-cy="puzzleSize"
          show-input
          show-steps
          :min="1"
          :max="15"
        ></el-slider>
        <li>External cells</li>
        <el-slider
          v-model="settings.borderRows"
          data-cy="borderRows"
          show-input
          show-steps
          :min="0"
          :max="2"
        ></el-slider>
        <li>Regions</li>
        Box Size - Horizontal
        <el-slider
          v-model="settings.boxSizeHor"
          data-cy="boxSizeHor"
          show-input
          show-steps
          :min="2"
          :max="4"
        ></el-slider>
        Box Size - Vertical
        <el-slider
          v-model="settings.boxSizeVer"
          data-cy="boxSizeVer"
          show-input
          show-steps
          :min="2"
          :max="4"
        ></el-slider>
        <li>Lock Puzzle
          <el-tooltip content="Locking puzzle will prevent user from modifying givens" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </li>
        <el-button type="warning" :disabled="!setMode" plain @click="lockPuzzle"
          >Lock</el-button>
        <el-button type="warning" :disabled="setMode" plain @click="unlockPuzzle"
          >Unlock</el-button>
        <li>

        <el-button-group>
          <el-button type="primary" @click="updateSettings"
            >OK</el-button
          >
          <el-button @click="handleClose">Cancel</el-button>
        </el-button-group>
        </li>
      </ul>
    </div>
  </div>
  </el-drawer>
</template>

<script>
import {mapActions} from "vuex"
const rulesets = [
  {name: "Normal", description: "Normal Sudoku rules apply."},
  {name: "Knight", description: "Cells connected by a Knight's move cannot contain the same digit."},
  {name: "Killer", description: "Cages contain unique digits summing to the indicated total."},
  {name: "Sandwich", description: "Clues outside the grid indicate the sum of digits between 1 and 9 in the indicated column/row."},
  {name: "Thermo", description: "Along a thermometer, digits must increase starting from the bulb."},
]
export default {
  name: "PuzzleSetDrawer",
    props: {
    orientation: {
      required: false,
      type: String,
      default: () => 'vertical'
    },
    showDrawer: {
      required: true,
      type: Boolean,
      default: () => false
    },
    settings: {
      required: true,
      type: Object,
      default: () => {
        return {
          puzzleSize: 9,
          borderRows: 2,
          boxSizeHor: 3,
          boxSizeVer: 3
        };
      }
    }
  },
  data () {
    return {
      setMode: true,
      puzzleTitle: "",
      rules: ['Normal'],  
      rulesets: rulesets,
    }
  },
  computed: {
    direction() {
      return (this.orientation === 'vertical') ? 'btt' : 'rtl'
    },
    size () {
      return (this.orientation === 'vertical') ? '500px' : '300px'
    }
  },
  watch: {
    showDrawer(n, o) {
      if (n !== o && n) {
        // if drawer opens, update this.form from this.settings
        this.form = Object.assign({}, this.form, this.settings);
      }
    }
  },
  methods: {
    ...mapActions(["setPuzzle"]),
    handleClose(e, type = false) {
      const output = Object.assign({}, this.form, { action: type, event: e });
      this.$emit("updateSettings", output);
    },
    unlockPuzzle () {
      this.setMode = true;
    },
    lockPuzzle() {
      this.setMode = false;
      this.setPuzzle();
      this.$message("Puzzle set");
    },
    updateSettings() {
      // this.$confirm("Is the puzzle ready to go?", "Warning").then(() => {
      //   this.setMode = false;
        // fire action to initialise puzzle
        // this.setPuzzle();
      this.settings.rules = this.rulesets
        .filter(r => this.rules.includes(r.name))
        .map(r => r.description);
      this.settings.title = this.puzzleTitle
      this.handleClose(e, true)
      // });
    },
  }
};
</script>
<style scoped> 
.controls > ul > li {
  list-style: none;
  padding-top: 12px;
  overflow: auto;
  height: 100%;
}

</style>
<style>
.title {
  text-align: left;
}
.wide {
  width: 100%;
}
#set-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.controls {
  padding: 12px;
  border: 1px solid #eee;
  margin: 12px;
}
</style>
