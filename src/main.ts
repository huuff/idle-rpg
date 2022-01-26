import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./styles.scss";
import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
library.add(faCoins);

createApp(App)
  .use(createPinia())
  .use(VueTippy, {
    directive: "tippy",
    component: "tippy",
    componentSingleton: "tippy-singleton",
    defaultProps: {
      placement: "auto-end",
      allowHTML: true,
    }
  })
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app')
