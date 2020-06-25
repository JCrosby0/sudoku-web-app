import Vue from "vue";
import Vuex from "vuex";
import selection from "./modules/selection";
import actionStack from "./modules/actionStack";
import regions from "./modules/regions";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    selection,
    actionStack,
    regions
  },
  getters: {},
  state: {},
  mutations: {},
  actions: {}
});
