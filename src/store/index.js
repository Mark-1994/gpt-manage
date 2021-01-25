import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    from_path_details: false
  },
  mutations: {
    from_path_change (state) {
      state.from_path_details = true
    }
  },
  actions: {
  },
  modules: {
  }
})
