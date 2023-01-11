<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import TextField from "./components/TextField.vue";
import Card from "./components/Card.vue";
import Button from "./components/Button.vue";
import SideBar from "./components/SideBar.vue";

import Default from "./pages/Default.vue";

import "./index.css";
import { ERouterPaths } from "./routes";
export default defineComponent({
  components: {
    Header,
    TextField,
    Card,
    Button,
    SideBar,
    Default,
  },
  data() {
    return {
      tabs: [
        {
          name: "Default",
          routeLink: ERouterPaths.DEFAULT,
        },
        {
          name: "Search assets",
          routeLink: ERouterPaths.SEARCH,
        },
        {
          name: "My assets",
          routeLink: ERouterPaths.MY_ASSETS,
        },
      ],
    };
  },
});
</script>

<template>
  <Header />
  <main class="main">
    <SideBar :tabs="tabs" />
    <router-view></router-view>
  </main>
</template>

<style>
#app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  max-width: var(--max-width);
  margin: 0 auto;
}
</style>
