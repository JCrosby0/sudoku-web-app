<template>
  <el-header class="header">
    <h2 class="title">JC's Sudoku Grid</h2>
    <!-- prettier-ignore -->
    <div class="menu">
            <el-button
        type="primary"
        plain
        round
        icon="el-icon-edit"
        @click="toggle('controls')"
      >Input</el-button>
      <el-button
        type="primary"
        plain
        round
        icon="el-icon-collection"
        @click="toggle('rules')"
      >Rules</el-button>
      <el-button
        type="primary"
        plain
        round
        icon="el-icon-menu"
        @click="toggle('settings')"
      >Settings</el-button>
    </div>
  </el-header>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    toggle(panel = "settings") {
      this.$emit("toggle", panel);
    }
  }
};
</script>

<style></style>
