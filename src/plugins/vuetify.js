import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
// import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);
const opts = {
  theme: {
    themes: {
      light: {
        // grey: colors.grey.lighten3, // #E53935
        primary: "#1f99bf"
      }
    }
  },
  options: {
    customProperties: true
  },
  icons: {
    iconfont: "mdi"
  }
};

export default new Vuetify(opts);
