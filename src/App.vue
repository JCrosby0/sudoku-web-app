<template>
  <div id="app" class="fullscreen">
    <SettingsDrawer
      class="settings"
      :show-drawer="showSettings"
      :settings="settings"
      :orientation="orientation"
      @updateSettings="handleSettings"
    />
    <PuzzleSetDrawer
      :show-drawer="showSet"
      :settings="settings"
      :orientation="orientation"
      @updateSettings="handleSettings"
    />    
    <PuzzleLibraryDrawer
      :show-drawer="showLibrary"
      :settings="settings"
      :orientation="orientation"
      @updateSettings="handleSettings"
    />
    <NavBar :collapsed="collapsed" @toggle="handleToggle" />
    <div class="container" :style="containerStyle">
      <Grid class="grid" :settings="settings" />
      <Panel
        :settings="settings"
        :panel="panel"
        :orientation="orientation"
        class="panel"
        :style="stylePanel"
        @updateSettings="handleSettingsFromSet"
      ></Panel>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Grid from "./components/Grid.vue";
import Panel from "./components/Panel.vue";
import PuzzleSetDrawer from "./components/DrawerSet.vue";
import SettingsDrawer from "./components/DrawerSettings.vue";
import PuzzleLibraryDrawer from "./components/DrawerLibrary";

const defaultSettings = {
  puzzleSize: 9,
  borderRows: 1,
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
    PuzzleSetDrawer,
    SettingsDrawer,
    PuzzleLibraryDrawer
  },
  data() {
    return {
      settings: {},
      panel: "navRules",
      showSettings: false,
      showSet: false,
      showLibrary: false,
      orientation: "vertical",
      collapsed: false
    };
  },
  computed: {
    containerStyle() {
      return {
        flexDirection: this.orientation === "horizontal" ? "row" : "column"
      };
    },
    stylePanel() {
      return {
        flex: this.orientation === "horizontal" ? "1 0 260px" : "1 0 20 0px"
      };
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
      const orientation = width > height ? "horizontal" : "vertical";
      this.orientation = orientation;
      this.collapsed = width < 800;
      // if window.innerWidth < 800 ? verticalorientation : horizontal orientation
      //   const availHeight = height - headerHeight;
      //   const availWidth = width - (width > 800 && containerWidth);
    },
    handleSettings(obj) {
      // don't update settings if drawer was closed / cancelled
      if (obj.action) {
        this.settings = Object.assign({}, this.settings, obj);
      }
      this.showSettings = false;
      this.showSet = false;
      this.showLibrary = false;
    },
    handleSettingsFromSet(obj) {
      this.settings = Object.assign({}, this.settings, obj);
    },
    handleToggle(type) {
      if (type === "navSettings") {
        this.showSettings = !this.showSettings;
        return;
      } else if (type === "navSet") {
        this.showSet = !this.showSet;
        return;
      } else if (type === "navLibrary") {
        this.showLibrary = !this.showLibrary;
      }
      // this.panel = this.panel === type ? null : type;
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
  overflow: hidden;
}
.container {
  height: calc(100% - 60px);
  display: flex;
  justify-content: space-between;
  max-height: 100%;
}
.footer-bar {
  flex: 0 0 auto;
}
.grid {
  flex: 1 1 auto;
}
.panel {
  flex: 1 0 230px;
  overflow: auto;
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
