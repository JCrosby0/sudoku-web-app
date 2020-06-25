<template>
  <el-header class="header">
    <h2 class="title">JC's Sudoku Grid</h2>
    <div class="menu">
      <el-button
        v-for="menu in menuArray"
        :id="menu.id"
        :key="menu.id"
        :type="activeTab === menu.toggle ? 'primary' : 'info'"
        round
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
  { id: "navSet", icon: "el-icon-edit-outline", toggle: "set", label: "Set" },
  { id: "navInput", icon: "el-icon-edit", toggle: "controls", label: "Solve" },
  {
    id: "navRules",
    icon: "el-icon-collection",
    toggle: "rules",
    label: "Rules"
  },
  {
    id: "navSettings",
    icon: "el-icon-menu",
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

<style></style>
