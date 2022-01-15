import { VNode } from "vue";

export interface Scene {
  firstTick?: () => void;
  tick: () => void;
  lastTick?: () => void;
  isOver: () => boolean;
  mainView: () => VNode;
  secondaryView?: () => VNode;
}
