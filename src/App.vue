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
      <el-aside v-show="showSet">
        <PuzzleSet
          :settings="settings"
          @updateSettings="handleSettingsFromSet"
        />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Grid from "./components/Grid.vue";
import Controls from "./components/Controls.vue";
import Rules from "./components/Rules.vue";
import PuzzleSet from "./components/PuzzleSet.vue";
import SettingsDrawer from "./components/SettingsDrawer.vue";

const defaultSettings = {
  puzzleSize: 9,
  borderRows: 2,
  boxSizeHor: 3,
  boxSizeVer: 3,
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
    Rules,
    PuzzleSet
  },
  mounted() {
    this.settings = Object.assign({}, defaultSettings);
  },
  data() {
    return {
      settings: {},
      showSettings: false,
      showRules: true,
      showControls: false,
      showSet: false
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
    handleSettingsFromSet(obj) {
      this.settings = Object.assign({}, this.settings, obj);
    },
    handleToggle(type) {
      switch (type) {
        case "set":
          this.showSet = !this.showSet;
          this.showRules = false;
          this.showControls = false;
          break;
        case "controls":
          this.showControls = !this.showControls;
          this.showRules = false;
          this.showSet = false;
          break;
        case "settings":
          this.showSettings = !this.showSettings;
          break;
        case "rules":
          this.showRules = !this.showRules;
          this.showControls = false;
          this.showSet = false;
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
.left {
  text-align: left;
}
</style>
