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
    <el-submenu index="0">
      <template slot="title">
        <i :class="`el-icon-menu icon-color`"></i>
        <span>Menu</span>
      </template>
      <el-menu-item v-for="menu in menuArray"
      :key="menu.id"
      :index="menu.id"
      >
        <template slot="title">
          <i :class="`${menu.icon} icon-color`"></i>
          <span>{{menu.label}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
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
  name: "NavMenu",
  data() {
    return {
      menuArray: menuArray
    }
  },
  computed: {
    screenWidth () {
      return window.innerWidth
    },
    portrait () {
      return (this.screenWidth < 750)
    }

  },
  methods: {
    handleMenu(menu) {
      const menuObj = this.menuArray.find(m => m.id === menu)
      this.$emit('menuClick', menu)
      this.$refs['menu'].close('0')
    }
  }
}
</script>

<style>
.icon-color {
  color: #ffffff;
}

</style>
