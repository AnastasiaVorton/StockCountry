import { createRouter, createWebHashHistory } from "vue-router";
import Default from "./pages/Default.vue";
import Search from "./pages/Search.vue";
import MyAssets from "./pages/MyAssets.vue";

export enum ERouterPaths {
  DEFAULT = "/",
  SEARCH = "/search",
  MY_ASSETS = "/my-assets",
}

const routes = [
  { path: ERouterPaths.DEFAULT, component: Default },
  { path: ERouterPaths.SEARCH, component: Search },
  { path: ERouterPaths.MY_ASSETS, component: MyAssets },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
