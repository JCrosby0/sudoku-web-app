<template>
  <div class="panel-main">
    <Rules
      v-show="panel === 'navRules'"
      :settings="settings"
      :orientation="orientation"
    />
    <Library v-show="panel === 'navLibrary'" @updateSettings="updateSettings" />
    <!-- <PuzzleSet
       v-show="panel === 'navSet'"
      :settings="settings"
      @updateSettings="updateSettings"
    /> -->
  </div>
</template>

<script>
import Rules from "./PanelRules.vue";
// import PuzzleSet from "./PanelSet.vue";
import Library from "./PanelLibrary.vue";
export default {
  name: "Panel",
  props: {
    orientation: {
      required: true,
      type: String
    },
    settings: {
      required: true,
      type: Object
    },
    panel: {
      required: false,
      type: String,
      default: () => "hidden"
    }
  },
  components: {
    Rules,
    // PuzzleSet,
    Library
  },
  methods: {
    updateSettings(payload) {
      this.$emit("updateSettings", payload);
    }
  }
};
</script>

<style>
.panel-main {
  width: 100%;
}
</style>
