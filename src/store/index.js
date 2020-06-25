import Vue from "vue";
import Vuex from "vuex";
import vuexSelection from "./modules/selection";
import actionStack from "./modules/actionStack";
import regions from "./modules/regions";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    vuexSelection,
    actionStack,
    regions
  },
  getters: {},
  state: {},
  mutations: {},
  actions: {}
});
