import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./plugins/element.js";

Vue.config.productionTip = false;

new Vue({
  name: "SudokuApp",
  render: h => h(App)
}).$mount("#app");
