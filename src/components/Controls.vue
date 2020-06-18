<template>
  <div class="left rules-container">
    <div class="controls">
      <h4 class="title">Controls:</h4>
      <div class="button-array">
        <div v-for="digit in 9" :key="digit" class="button-spacing">
          <el-button class="button" type="primary">{{ digit }}</el-button>
        </div>
        <div class="button-bottom">
          <el-button class="button">Delete</el-button>
          <el-button class="button">Color</el-button>
        </div>
      </div>
      <el-button-group class="toggles">
        <el-button
          v-for="toggle in toggles"
          :key="toggle"
          :type="currentToggle === toggle && 'primary'"
          @click="handleToggle(toggle)"
          >{{ toggle }}</el-button
        >
      </el-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "Controls",
  data() {
    return {
      toggles: ["Normal", "Top", "Mid"],
      currentToggle: "Normal"
    };
  },
  methods: {
    handleToggle(t) {
      this.currentToggle = t;
    }
  }
};
</script>

<style>
.title {
  text-align: left;
}
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
  padding: 12px;
}
.button-bottom {
  flex: 1 1 75%;
  text-align: center;
  padding: 12px;
}
.toggles {
  padding-top: 12px;
}
.controls {
  text-align: center;
}
</style>
