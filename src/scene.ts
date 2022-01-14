import { VNode } from "vue";

export interface Scene {
  tick: () => void;
  isOver: () => boolean;
  mainView: () => VNode;
}
