<template>
  <div id="library-container" class="left">
    <div class="library left">
      <h4>Puzzle Library</h4>
      <span>Select a puzzle to load:</span>
      <el-select
        v-model="puzzle"
        filterable
        data-cy="libraryInput"
        class="wide"
        @input="loadPuzzle"
      >
        <el-option
          v-for="(option, i) in puzzleList"
          :key="'puzzleOption-' + i"
          :value="option.value"
          :label="option.value"
        >
        </el-option>
      </el-select>
      <br />
      <el-button type="primary" @click="loadPuzzle">Load</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import * as data from "../assets/dummyData.js";
const puzzleList = [
  { value: "Dummy Data", data: () => data.dummyCellArray },
  { value: "Valid Rows", data: () => data.validRows },
  { value: "Valid Columns", data: () => data.validCols },
  { value: "Valid Boxes", data: () => data.validBoxes },
  { value: "Valid Grid", data: () => data.validGrid },
  { value: "NY Times Demo - Easy", data: () => data.demoEasy },
  { value: "NY Times Demo - Medium", data: () => data.demoMedium },
  { value: "NY Times Demo - Hard", data: () => data.demoHard }
];
export default {
  name: "PuzzleLibrary",
  data() {
    return {
      puzzle: null,
      puzzleList: puzzleList
    };
  },
  methods: {
    ...mapActions(["resetPuzzle", "newAction", "setPuzzle"]),
    loadPuzzle() {
      const puzzle = this.puzzle;
      const puzzleItem = this.puzzleList.find(c => c.value === puzzle);
      const puzzleData = puzzleItem.data();
      this.resetPuzzle()
        .then(() => {
          this.newAction(puzzleData);
        })
        .then(() => {
          this.setPuzzle();
          this.$emit("updateSettings", { title: this.puzzle });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style>
.title {
  text-align: left;
}
#library-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.library {
  padding: 12px;
  border: 1px solid #eee;
  margin: 12px;
}
li {
  list-style: none;
}
.wide {
  width: 100%;
  padding-bottom: 12px;
}
</style>
