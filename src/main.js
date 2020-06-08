import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./plugins/element.js";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  name: "SudokuApp",
  store,
  render: h => h(App)
}).$mount("#app");
