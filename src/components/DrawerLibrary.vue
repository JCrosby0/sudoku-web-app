<template>
  <el-drawer
    id="drawer-library"
    :visible.sync="showDrawer"
    :before-close="handleClose"
    :direction="direction"
    :size="size"
  >
  <h4 slot="title" class="left">Puzzle Library</h4>
  <div id="library-container" class="left">
    <div class="library left">
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
      <div v-if="puzzle" class="selectedPuzzle">

      <p class="metadata-header">Puzzle Name:
      </p>
        <span class="metadata">{{ selectedPuzzle.value }}</span>
      <p class="metadata-header">Author:
      </p>
        <span class="metadata">{{ selectedPuzzle.author }}</span>
      <p class="metadata-header">Puzzle Rules:
      </p>
        <ul>
          <li
            v-for="(rule, i) in selectedPuzzle.rules"
            :key="'rule'+i"
             class="metadata">
            {{ rule }}</li>
        </ul>
      </div>
      <el-button type="primary" @click="e=>handleLoad(e)">Load</el-button>
    </div>
  </div>
  </el-drawer>
</template>

<script>
import { mapActions } from "vuex";
import * as data from "../assets/dummyData.js";
const puzzleList = [
  { value: "Dummy Data", data: () => data.dummyCellArray, rules: ['Standard'], author: 'Dummy'},
  { value: "Valid Rows", data: () => data.validRows, rules: ['Standard'], author: 'Dummy' },
  { value: "Valid Columns", data: () => data.validCols, rules: ['Standard'], author: 'Dummy' },
  { value: "Valid Boxes", data: () => data.validBoxes, rules: ['Standard'], author: 'Dummy' },
  { value: "Valid Grid", data: () => data.validGrid, rules: ['Standard'], author: 'Dummy' },
  { value: "NY Times Demo - Easy", data: () => data.demoEasy, rules: ['Standard'], author: 'New York Times' },
  { value: "NY Times Demo - Medium", data: () => data.demoMedium, rules: ['Standard'], author: 'New York Times' },
  { value: "NY Times Demo - Hard", data: () => data.demoHard, rules: ['Standard'], author: 'New York Times' }
];
export default {
  name: "PuzzleLibraryDrawer",
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
  data() {
    return {
      puzzle: null,
      puzzleList: puzzleList
    };
  },
  computed: {
    direction() {
      return (this.orientation === 'vertical') ? 'btt' : 'rtl'
    },
    size () {
      return (this.orientation === 'vertical') ? '500px' : '300px'
    },
    selectedPuzzle() {
      const none = {
        author: null,
        rules: [null],
        title: null
      }
      return this.puzzleList.find(a => a.value = this.puzzle) || none
    }
  },
  methods: {
    ...mapActions(["resetPuzzle", "newAction", "setPuzzle"]),
    handleClose(e, type = false) {
      const output = Object.assign({}, {title: this.puzzle}, { action: type, event: e });
      this.$emit("updateSettings", output);
    },
    handleLoad(e, type=true) {
      const output = Object.assign({}, { title: this.puzzle }, { action: type, event: e });
      this.$emit("updateSettings", output);
      this.setPuzzle();
    },
    loadPuzzle() {
      const puzzle = this.puzzle;
      const puzzleItem = this.puzzleList.find(c => c.value === puzzle);
      const puzzleData = puzzleItem.data();
      this.resetPuzzle()
        .then(() => {
          this.newAction(puzzleData);
        })
        .then(() => {
          // this.setPuzzle();
          // this.$emit("updateSettings", { title: this.puzzle });
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
.metadata-header {
  font-weight: bold;
}
.metadata {
  padding-left: 12px;
}
</style>
