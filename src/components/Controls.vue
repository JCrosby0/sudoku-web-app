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
      Add button based controls here :)
    </div>
  </div>
</template>

<script>
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
      controls: [
        "Value: Click cell & type",
        "Top Notes: Click cell, hold Shift and type",
        "Central Notes: Click cell, hold Ctrl and type",
        "Highlighting: Hold Alt and click cell"
      ]
    };
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
