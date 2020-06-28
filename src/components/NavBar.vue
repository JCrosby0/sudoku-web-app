<template>
  <el-header class="header">
    <div class="logo-title-container">
      <div class="logo">
        <div class="c"></div>
        <div class="j"></div>
      </div>
      <h2 class="title">JC's Sudoku Grid</h2>
    </div>
    <div class="menu">
      <el-button
        v-for="menu in menuArray"
        :id="menu.id"
        :key="menu.id"
        :type="activeTab === menu.toggle ? 'primary' : 'info'"
        round
        :data-cy="menu.id"
        :icon="menu.icon"
        @click="toggle(menu.toggle)"
      >
        {{ menu.label }}
      </el-button>
    </div>
  </el-header>
</template>

<script>
const menuArray = [
  { id: "navLibrary", icon: "el-icon-collection", toggle: "library", label: "Library" },
  { id: "navSet", icon: "el-icon-edit-outline", toggle: "set", label: "Set" },
  // { id: "navInput", icon: "el-icon-edit", toggle: "controls", label: "Solve" },
  {
    id: "navRules",
    icon: "el-icon-chat-square",
    toggle: "rules",
    label: "Rules"
  },
  {
    id: "navSettings",
    icon: "el-icon-set-up",
    toggle: "settings",
    label: "Settings"
  }
];
export default {
  name: "NavBar",
  data() {
    return {
      activeTab: null,
      menuArray: menuArray
    };
  },
  methods: {
    toggle(panel = "settings") {
      // set active tab for button highlighting
      if (panel !== "settings") {
        this.activeTab = panel === this.activeTab ? "none" : panel;
      }
      this.$emit("toggle", panel);
    }
  }
};
</script>

<style>
.logo-title-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.logo {
  width: 40px;
  height: 40px;
  position: relative;
}
.j {
  position: absolute;
  top: 0px;
  left: 6px;
  border: 6px solid #90EE90;
  border-left: 0px;
  border-top: 0px;
  width: 34px;
  height: 34px;
  border-radius: 6px 6px 9px 6px;
  box-sizing: border-box;

}
.c {
  position: absolute;
  border: 6px solid #30AA30;
  /* border-right: 0px; */
  width: 40px;
  height: 40px;
  border-radius: 12px 6px 9px 12px;
box-sizing: border-box;
}
</style>
