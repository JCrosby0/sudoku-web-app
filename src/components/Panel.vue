<template>
  <div class="panel-main">
    <el-aside v-show="panel === 'navRules'">
      <Rules :settings="settings" />
    </el-aside>
    <el-aside v-show="panel === 'navLibrary'">
      <Library 
      @updateSettings="updateSettings"/>
    </el-aside>
    <el-aside v-show="panel === 'navSet'">
      <PuzzleSet
        :settings="settings"
        @updateSettings="updateSettings"
      />
    </el-aside>
  </div> 
</template>

<script>
import Rules from "./PanelRules.vue";
import PuzzleSet from "./PanelSet.vue";
import Library from "./PanelLibrary.vue"
export default {
  name: "Panel",
  props: {
    settings: {
      required: true,
      type: Object,
    },
    panel: {
      required: false,
      type: String,
      default: () => 'hidden'
    }
  },
   components: {
    Rules,
    PuzzleSet,
    Library
  },
  methods: {
    updateSettings (payload) {
      this.$emit('updateSettings', payload)
    }
  }
}
</script>

<style>
/* .panel-main {
} */

</style>
