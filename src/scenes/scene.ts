import { VNode } from "vue";

export interface Scene {
  mainView: () => VNode,
  sideView: () => VNode,
}
