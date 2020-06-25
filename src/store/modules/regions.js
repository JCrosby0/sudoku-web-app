export default {
  namespaced: true,
  getters: {},
  state: {
    regions: []
  },
  mutations: {
    ADD_REGION(state, payload) {
      state.regions.push(...payload);
    },
    UPDATE_REGION(state, payload) {
      state.regions = payload;
    },
    DELETE_REGION(state, payload) {
      if (typeof payload === "number" && state.region.length > payload - 1) {
        state.region.slice(payload, 1);
      }
      const index = state.region.indexOf(payload);
      if (index != -1) {
        state.region.slice(index, 1);
      }
    }
  },
  actions: {
    createRegion({ commit }, payload) {
      commit("ADD_REGION", payload);
    },
    updateRegion({ commit }, payload) {
      commit("UPDATE_REGION", payload);
    },
    deleteRegion({ commit }, payload) {
      commit("DELETE_REGION", payload);
    }
  }
};
