import { defineStore } from "pinia";
import Notifications, { Notification } from "./notification";

// Actually I'm just using pinia to have this globally accessible,
// which I'm not sure whether it's a morally good use-case

type NotificationStoreState = {
  notification?: Notification;
  timer?: ReturnType<typeof setTimeout>;
}

const NOTIFICATION_DURATION = 3000;

export const useNotificationStore = defineStore("notification", {
  state: ():NotificationStoreState => ({
    notification: undefined,
    timer: undefined,
  }),
  actions: {
    setNotification(name: keyof typeof Notifications.defaultNotifications): void {
      clearTimeout(this.timer);
      this.notification = Notifications.defaultNotifications[name];
      this.timer = setTimeout(() => {
        this.notification = undefined;
      }, NOTIFICATION_DURATION);
    }
  }
});
