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
      <el-aside v-show="panel === 'rules'">
        <Rules :settings="settings" />
      </el-aside>
      <!-- <el-aside v-show="panel === 'controls'">
        <Controls />
      </el-aside> -->
      <el-aside v-show="panel === 'library'">
        <Library 
        @updateSettings="handleSettingsFromSet"/>
      </el-aside>
      <el-aside v-show="panel === 'set'">
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
// import Controls from "./components/PanelControls.vue";
import Rules from "./components/PanelRules.vue";
import PuzzleSet from "./components/PanelSet.vue";
import Library from "./components/PanelLibrary.vue"
import SettingsDrawer from "./components/DrawerSettings.vue";

const defaultSettings = {
  puzzleSize: 9,
  borderRows: 2,
  boxSizeHor: 3,
  boxSizeVer: 3,
  selectOptions: [],
  highlightOptions: ["Row", "Column", "Box", "Number"],
  title: "My First Sudoku",
  rules: ["Normal Sudoku rules apply"]
};

export default {
  name: "App",
  components: {
    NavBar,
    Grid,
    SettingsDrawer,
    // Controls,
    Rules,
    PuzzleSet,
    Library
  },
  mounted() {
    this.settings = Object.assign({}, defaultSettings);
  },
  data() {
    return {
      settings: {},
      panel: 'Rules',
      showSettings: false,
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
      if (type === 'settings') {
        this.showSettings = !this.showSettings;
        return
      }
      this.panel = (this.panel === type) ? null : type;
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
