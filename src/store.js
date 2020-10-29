import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
 
export default new Vuex.Store({
    state: {
        savedLetters: []
      }, 
      mutations: {
       saveLetter: (state, letters) =>
           {state.savedLetters = letters;}
      }
});