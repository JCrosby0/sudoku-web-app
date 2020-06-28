<template>
  <div id="set-container" class="left">
    <div class="controls left">
      <h4>Puzzle Set Mode</h4>
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
        <li>Finish Setting</li>
        <el-button v-if="setMode" type="warning" plain @click="confirmSetPuzzle"
          >Set</el-button>
      </ul>
    </div>
  </div>
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
  name: "PuzzleSet",
  props: {
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
  methods: {
    ...mapActions(["setPuzzle"]),
    confirmSetPuzzle() {
      this.$confirm("Is the puzzle ready to go?", "Warning").then(() => {
        this.setMode = false;
        // fire action to initialise puzzle
        this.setPuzzle();
        this.settings.rules = this.rulesets
          .filter(r => this.rules.includes(r.name))
          .map(r => r.description);
        this.settings.title = this.puzzleTitle
        this.$message("Puzzle set");
      });
    },
  }
};
</script>
<style scoped> 
.controls > ul > li {
  list-style: none;
  padding-top: 12px;
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
