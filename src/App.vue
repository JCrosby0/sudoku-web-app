<template>
  <div id="app" class="fullscreen">
    <SettingsDrawer
      class="settings"
      :show-drawer="showSettings"
      :settings="settings"
      @updateSettings="handleSettings"
    />
    <NavBar @toggle="handleToggle" />
    <el-container class="container">
      <Grid :settings="settings" />
      <el-aside v-show="showRules">
        <Rules title="My First Sudoku" />
      </el-aside>
      <el-aside v-show="showControls">
        <Controls />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Grid from "./components/Grid.vue";
import Controls from "./components/Controls.vue";
import Rules from "./components/Rules.vue";
import SettingsDrawer from "./components/SettingsDrawer.vue";

const defaultSettings = {
  selectOptions: [],
  highlightOptions: ["Row", "Column", "Box", "Number"]
};

export default {
  name: "App",
  components: {
    NavBar,
    Grid,
    SettingsDrawer,
    Controls,
    Rules
  },
  mounted() {
    this.settings = Object.assign({}, defaultSettings);
  },
  data() {
    return {
      settings: {},
      showSettings: false,
      showRules: true,
      showControls: false
    };
  },
  methods: {
    handleSettings(obj) {
      // don't update settings if drawer was closed / cancelled
      if (obj.action) {
        this.settings = Object.assign({}, obj);
      }
      this.handleToggle("settings");
    },
    handleToggle(type) {
      switch (type) {
        case "controls":
          this.showControls = !this.showControls;
          this.showRules = false;
          break;
        case "settings":
          this.showSettings = !this.showSettings;
          break;
        case "rules":
          this.showRules = !this.showRules;
          this.showControls = false;
          break;
        default:
      }
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
  width: 100vw;
  height: 100vh;
}
.fullscreen {
  width: 100%;
  height: 100%;
}
.container {
  height: calc(100% - 60px);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: grey;
  color: lightgreen;
}
.title {
  padding-left: 24px;
}
</style>
