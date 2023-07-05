import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify, {
    iconfont: "mdi",
  })
  .use(antd)
  .mount("#app");
