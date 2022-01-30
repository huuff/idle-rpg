import { defineStore } from "pinia";
import Notifications, { Notification } from "./notification";

// Actually I'm just using pinia to have this globally accessible,
// which I'm not sure whether it's a morally good use-case

type NotificationStoreState = {
  notification?: Notification;
}

const NOTIFICATION_DURATION = 2500;

export const useNotificationStore = defineStore("notification", {
  state: ():NotificationStoreState => ({
    notification: undefined,
  }),
  actions: {
    setNotification(name: keyof typeof Notifications.defaultNotifications): void {
      console.log(`Setting notification ${name}`);
      this.notification = Notifications.defaultNotifications[name];
      setTimeout(() => {
        this.notification = undefined;
      }, NOTIFICATION_DURATION);
    }
  }
});
