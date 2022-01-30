export type Notification = {
  message: string;
  level: "warning" | "error" | "success" | "info";
}

const defaultNotifications: { [name: string]: Notification } = {
  "not-enough-money": {
    message: "You don't have enough money to buy that item!",
    level: "warning",
  }
}

export default {
  defaultNotifications
}
