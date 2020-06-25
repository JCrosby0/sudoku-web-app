<template>
  <div id="set-container" class="left">
    <div class="controls left">
      <h4>Puzzle Set Mode</h4>
      <ul>
        <li>Size of grid</li>
        <el-slider
          v-model="settings.puzzleSize"
          data-cy="puzzleSize"
          show-input
          show-steps
          :min="1"
          :max="15"
        ></el-slider>
        <li>Border cells</li>
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
        <li>Select Rules that apply</li>
        <li>Finish Setting</li>
      </ul>
    </div>
  </div>
</template>

<script>
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
  }
};
</script>

<style>
.title {
  text-align: left;
}
#set-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.controls {
  padding: 12px;
}
li {
  list-style: none;
}
</style>
