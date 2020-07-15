<template>
  <div class="footer-bar">
    <el-button 
      v-for="o in options" 
      :key="'button'+o"
      type="info"
      class="button"
      >
      {{o}}
    </el-button>
  </div> 
</template>

<script>
export default {
  name: "FooterBar",
  data () {
    return {
      options: ['Rules', 'Controls', 'Check', 'Restart', "Set", "About" ]
    }
  }
}
</script>

<style>
.footer-bar {
  background: #808080;
  display: flex;
  direction: row;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow: auto;
  padding: 6px;
}
.button {
  margin: 6px;
}
</style>
