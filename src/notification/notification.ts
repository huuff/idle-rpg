type NotificationLevel = "warning" | "danger" | "success" | "info";

export type Notification = {
  message: string;
  level: NotificationLevel
}

// XXX: Casting all literals is a bit tiresome, find a way to type
// this so that keyof typeof this autocompletes the messages
const defaultNotifications = {
  "not-enough-money": {
    message: "You don't have enough money to buy that item!",
    level: "warning" as NotificationLevel,
  },
  "saved": {
    message: "Game saved",
    level: "success" as NotificationLevel,
  },
  "deleted": {
    message: "Saved game deleted!",
    level: "danger" as NotificationLevel,
  },
  "loaded": {
    message: "Loaded a saved game",
    level: "info" as NotificationLevel,
  },
  "overload": {
    message: "You're carrying too much weight to equip that item",
    level: "warning" as NotificationLevel,
  }
}

export default {
  defaultNotifications
}
