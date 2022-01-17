export interface Tickable {
  firstTick?: () => void;
  tick: () => void;
  lastTick?: () => void;
  isOver: () => boolean;
}
