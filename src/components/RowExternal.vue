<template>
  <div class="outerRow">
    <Cell
      v-for="(cell, i) in numCells"
      :key="'extRow' + rowId + 'cell' + i"
      :row-id="rowId"
      :cell-id="i"
      :settings="settings"
      :style="styleCell"
      class="cell"
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
  name: "ExternalRow",
  components: { Cell },
  props: {
    numCells: {
      required: true,
      type: Number,
    },
    rowId: {
      required: true,
      type: Number
    },
    direction: {
      required: true,
      type: String
    },
    settings: {
      required: true,
      type: Object
    }
  },
  computed: {
    styleCell() {
      return {
        width: 100 / this.settings.gridSize + "%"
      };
    },
    rowStyle() {
      return {
        flexDirection: (this.direction === 'horizontal') ? 'row' : 'column'
      }
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
  /* border: 2px grey solid; */
  width: 100%;
  height: 100%;
  display: flex;
  /* flex-direction: row; */
  flex-wrap: wrap;
}
.cell {
  flex: 1 1 auto;
  height: 100%;
}
</style>
