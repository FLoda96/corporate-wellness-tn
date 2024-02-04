// NotificationService.ts

import { Notifications, Notification } from 'react-native-notifications';

class NotificationService {
  static configured = false;

  static configure() {
    if (this.configured) {
      return;
    }

    Notifications.registerRemoteNotifications();
    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      console.log('Device Token Received:', event.deviceToken);
    });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log('Notification Received:', notification);
      completion({ alert: true, sound: true, badge: true });
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log('Notification Opened:', notification);
      completion();
    });

    this.configured = true;
  }

  static postPersistentNotification(title: string, body: string, sound: string = 'default') {
    const identifier = 1; // Unique identifier for this notification

    const persistentNotification: Notification = {
      title,
      body,
      sound,
      identifier: '1',
      payload: {},
      badge: 0,
      type: 'local',
      thread: 'DEFAULT_THREAD',
    };

    Notifications.postLocalNotification(persistentNotification);

    return identifier;
  }

  static clearNotification(identifier: number) {
    Notifications.cancelLocalNotification(identifier);
  }
}

export default NotificationService;
