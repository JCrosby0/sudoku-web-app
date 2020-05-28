<template>
  <div>
    <el-drawer
      :visible.sync="showDrawer"
      :before-close="handleClose"
      title="Settings"
      direction="ltr"
    >
      <span>Alt-Click Highlighting:</span>
      <el-form v-model="form">
        <el-checkbox-group v-model="form.highlightOptions">
          <el-checkbox
            v-for="opt in form.highlightOptions"
            :key="'hlOpt-' + opt"
            :label="opt"
            :value="opt"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SettingsDrawer",
  props: {
    showDrawer: {
      required: true,
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      form: {
        highlightOptions: ["Row", "Column", "Box", "Number", "King", "Knight"]
      }
    };
  },
  methods: {
    handleClose() {
      this.$emit("updateSettings", this.form);
    }
  }
};
</script>

<style></style>
