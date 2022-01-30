type NotificationLevel = "warning" | "danger" | "success" | "info";

export type Notification = {
  message: string;
  level: NotificationLevel
}

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
  }
}

export default {
  defaultNotifications
}
