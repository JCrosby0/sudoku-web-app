<template>
  <div class="outerRow">
    <Cell
      v-for="(cell, i) in settings.puzzleSize"
      :key="'compRow' + rowId + 'cell' + i"
      :row-id="rowId"
      :cell-id="i"
      class="cell"
      :settings="settings"
      @emitCellClicked="handleCellClicked"
      @emitDragAdd="handleDragAdd"
      @emitDragEnd="handleDragEnd"
    />
    <!-- :cell-obj="cell" -->
  </div>
</template>

<script>
import Cell from "./Cell.vue";

export default {
  name: "Row",
  components: { Cell },
  props: {
    rowId: {
      required: true,
      type: Number
    },
    settings: {
      required: true,
      type: Object
    }
  },
  methods: {
    handleCellClicked(obj) {
      this.$emit("emitCellClicked", obj);
    },
    handleDragAdd(obj) {
      this.$emit("emitDragAdd", obj);
    },
    handleDragEnd(obj) {
      this.$emit("emitDragEnd", obj);
    }
  }
};
</script>

<style>
.outerRow {
  border: 2px grey solid;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.cell {
  flex: 1 1 auto;
  height: 100%;
  width: 11%;
  /* border: 1px green solid;
  box-sizing: border-box; */
}
</style>
