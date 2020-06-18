<template>
  <div>
    <el-drawer
      id="settings-container"
      :visible.sync="showDrawer"
      :before-close="handleClose"
      direction="rtl"
      size="300px"
    >
      <!-- title="Settings" -->
      <h4 slot="title" class="left">Settings</h4>
      <el-form ref="form" :model="form" label-width="125px">
        <el-form-item label="Select:" class="left">
          <el-checkbox-group v-model="form.selectOptions">
            <el-checkbox
              v-for="opt in selectOptions"
              :key="'slOpt-' + opt.value"
              :label="opt.label"
              :value="opt.value"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Highlight:" class="left">
          <el-checkbox-group v-model="form.highlightOptions">
            <el-checkbox
              v-for="opt in highlightOptions"
              :key="'hlOpt-' + opt.value"
              :label="opt.label"
              :value="opt.value"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="e => handleClose(e, true)"
              >OK</el-button
            >
            <el-button @click="handleClose">Cancel</el-button>
          </el-button-group>
        </el-form-item>
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
    },
    settings: {
      required: true,
      type: Object,
      default: () => {
        return { selectOptions: [], highlightOptions: [] };
      }
    }
  },
  data() {
    return {
      form: {
        selectOptions: [],
        highlightOptions: []
      },
      highlightOptions: [
        { label: "Row", value: "Row" },
        { label: "Column", value: "Column" },
        { label: "Box", value: "Box" },
        { label: "Number", value: "Number" },
        { label: "Number + Seen", value: "NumberSeen" },
        { label: "Chess: King", value: "King" },
        { label: "Chess: Queen", value: "Queen" },
        { label: "Chess: Knight", value: "Knight" }
      ],
      selectOptions: [
        { label: "Row", value: "Row" },
        { label: "Column", value: "Column" },
        { label: "Box", value: "Box" }
      ]
    };
  },
  watch: {
    showDrawer(n, o) {
      if (n !== o && n) {
        // if drawer opens, update this.form from this.settings
        this.form = Object.assign({}, this.form, this.settings);
      }
    }
  },
  methods: {
    handleClose(e, type = false) {
      const output = Object.assign({}, this.form, { action: type, event: e });
      this.$emit("updateSettings", output);
    }
  }
};
</script>

<style>
label {
  display: block;
  text-align: left;
}
.left {
  text-align: left;
}
</style>
