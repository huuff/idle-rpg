import { VNode } from "vue";

export interface Scene {
  readonly mainView: () => VNode,
  readonly sideView?: () => VNode,
}