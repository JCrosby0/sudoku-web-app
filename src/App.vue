<template>
  <div id="app" class="fullscreen">
    <SettingsDrawer
      class="settings"
      :show-drawer="showSettings"
      :settings="settings"
      :orientation="orientation"
      @updateSettings="handleSettings"
    />
    <NavBar :collapsed="collapsed" @toggle="handleToggle" />
    <el-container class="container" :style="containerStyle">
      <Grid :settings="settings"/>
      <Panel
        :settings="settings"
        :panel="panel"
        @updateSettings="handleSettingsFromSet"></Panel>
      <!-- <el-aside v-show="panel === 'navRules'">
        <Rules :settings="settings" />
      </el-aside>
      <el-aside v-show="panel === 'navLibrary'">
        <Library 
        @updateSettings="handleSettingsFromSet"/>
      </el-aside>
      <el-aside v-show="panel === 'navSet'">
        <PuzzleSet
          :settings="settings"
          @updateSettings="handleSettingsFromSet"
        />
      </el-aside> -->
    </el-container>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Grid from "./components/Grid.vue";
import Panel from "./components/Panel.vue";
// import Controls from "./components/PanelControls.vue";
// import Rules from "./components/PanelRules.vue";
// import PuzzleSet from "./components/PanelSet.vue";
// import Library from "./components/PanelLibrary.vue"
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
    Panel,
    SettingsDrawer,
    // Controls,
    // Rules,
    // PuzzleSet,
    // Library
  },
  data() {
    return {
      settings: {},
      panel: 'navRules',
      showSettings: false,
      orientation: 'vertical',
      collapsed: false,
    };
  },
  computed:{ 
    containerStyle () {
      const style = {
        flexDirection: (this.orientation === 'horizontal') ? 'row' : 'column'
      }
      return style
    }
  },
  mounted() {
    this.settings = Object.assign({}, defaultSettings);
    this.$nextTick(function() {
      this.updateWindowOrientation();
      // resize for sizing the grid
      window.addEventListener("resize", this.updateWindowOrientation);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowOrientation);
  },
  methods: {
    updateWindowOrientation() {
      // const headerHeight = 60; // px
      // const containerWidth = 300; // [x]
      const height = window.innerHeight;
      const width = window.innerWidth;
      const orientation = (width > height) ? 'horizontal' : 'vertical'
      this.orientation = orientation
      this.collapsed = width < 800;
      // if window.innerWidth < 800 ? verticalorientation : horizontal orientation
    //   const availHeight = height - headerHeight;
    //   const availWidth = width - (width > 800 && containerWidth);
    },
    handleSettings(obj) {
      // don't update settings if drawer was closed / cancelled
      if (obj.action) {
        this.settings = Object.assign({}, obj);
      }
      this.handleToggle("navSettings");
    },
    handleSettingsFromSet(obj) {
      this.settings = Object.assign({}, this.settings, obj);
    },
    handleToggle(type) {
      if (type === 'navSettings') {
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
  display: flex;
  justify-content: space-between;
}
.header {
  width: 100vw;
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
