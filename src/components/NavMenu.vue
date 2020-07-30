<template>
  <el-menu
    ref="menu"
    :default-active="'navRules'"
    mode="horizontal"
    background-color="#808080"
    text-color="#2c3f50"
    active-text-color="#90ee90"
    @select="handleMenu"
  >
    <el-menu-item
      v-for="menu in menuArray"
      :key="menu.id"
      :index="menu.id"
      class="icon-color"
    >
      <template slot="title">
        <i :class="`${menu.icon} icon-color`"></i>
        <span class="icon-color">{{ menu.label }}</span>
      </template>
    </el-menu-item>
    <el-submenu
      v-if="collapsed"
      index="0"
      class="icon-color"
      @select="handleMenu"
    >
      <template slot="title">
        <i :class="`el-icon-menu icon-color`"></i>
        <span class="icon-color"></span>
      </template>
      <el-menu-item
        v-for="menu in collapsedMenuArray"
        :key="menu.id"
        :index="menu.id"
      >
        <template slot="title">
          <i :class="`${menu.icon} icon-color`"></i>
          <span class="icon-color">{{ menu.label }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
const menuArray = [
  {
    id: "navLibrary",
    icon: "el-icon-collection",
    toggle: "library",
    label: "Library"
  },
  {
    id: "navSet",
    icon: "el-icon-edit-outline",
    toggle: "set",
    label: "Create"
  },
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
  name: "NavMenu",
  props: {
    collapsed: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      collapsedMenuArray: menuArray
    };
  },
  computed: {
    menuArray() {
      return this.collapsed ? [] : menuArray;
    }
  },
  methods: {
    handleMenu(menu) {
      console.log("menu: ", menu);
      const menuObj = this.menuArray.find(m => m.id === menu);
      this.$emit("menuClick", menu);
      this.$refs["menu"].closeMenu();
      this.$refs["menu"].close();
      console.log("this.$refs: ", this.$refs);
    }
  }
};
</script>

<style>
/* .icon-color, */
.el-menu-item i:before,
.el-icon-menu:before {
  color: #ddd;
}
</style>
