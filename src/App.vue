<template>
  <div id="app">
    <SettingsDrawer
      class="settings"
      :show-drawer="showDrawer"
      @click="toggleDrawer"
      @updateSettings="handleSettings"
    />
    <el-header class="header">
      <h2 class="title">JC's Sudoku Grid</h2>
      <!-- prettier-ignore -->
      <div class="menu">
        <el-button
          type="primary"
          plain
          round
          icon="el-icon-menu"
          @click="toggleDrawer"
        >Show Settings</el-button>
      </div>
    </el-header>
    <Grid />
  </div>
</template>

<script>
import Grid from "./components/Grid.vue";
import SettingsDrawer from "./components/SettingsDrawer.vue";

export default {
  name: "App",
  components: {
    Grid,
    SettingsDrawer
  },
  data() {
    return {
      settings: {},
      showDrawer: false
    };
  },
  methods: {
    handleSettings(obj) {
      this.settings = Object.assign({}, obj);
    },
    toggleDrawer() {
      console.log("toggling show drawer", this.showDrawer);
      this.showDrawer = !this.showDrawer;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
  width: 100vh;
  height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  background: grey;
  color: lightgreen;
}
.title {
  padding-left: 24px;
}
</style>
