export interface Scene {
  tick: () => void;
  isOver: () => boolean;
}
