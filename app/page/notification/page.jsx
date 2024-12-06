"use client";
import { useEffect } from "react";
import styles from "@/app/styles/notification.module.css";
import { GoClockFill as ClockIcon } from "react-icons/go";
import { useNotificationStore } from "@/app/store/Notification";
import { RiNotificationBadgeFill as NotificationIcon } from "react-icons/ri";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const NOTIFICATION_API_URL = "/api/notifications/subscribe";

export class NotificationService {
  static async requestPermission() {
    if (!("Notification" in window)) {
      console.warn("Notifications are not supported by this browser.");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  static async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Workers are not supported by this browser.");
      return null;
    }

    try {
      return await navigator.serviceWorker.register("/sw.js");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }

  static async subscribeToPushNotifications(registration) {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });

      await fetch(NOTIFICATION_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      return subscription;
    } catch (error) {
      console.error("Push subscription failed:", error);
      return null;
    }
  }

  static async showNotification(title, options) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
    } else if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification(title, options);
    }
  }
}

const schedules = [
  { id: 1, title: "Team Meeting", time: "16:59", description: "Weekly team sync" },
  { id: 2, title: "Lunch Break", time: "12:30", description: "Lunch with colleagues" },
  { id: 3, title: "Project Deadline", time: "17:00", description: "Submit final report" },
];

export default function NotificationPage() {
  const { isAllowed, toggleAllow } = useNotificationStore();
  const notificationEnabled = isAllowed;

  useEffect(() => {
    const interval = setInterval(checkUpcomingSchedules, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [notificationEnabled, schedules]);

  const checkUpcomingSchedules = () => {
    if (!notificationEnabled) return;

    const now = new Date();
    schedules.forEach((schedule) => {
      const scheduleTime = new Date();
      const [hours, minutes] = schedule.time.split(":").map(Number);
      scheduleTime.setHours(hours, minutes, 0, 0);

      const timeDiff = scheduleTime - now;
      if (timeDiff > 0 && timeDiff <= 900000) {
        sendNotification(schedule);
      }
    });
  };

  const sendNotification = async ({ title, description }) => {
    if (!notificationEnabled) return;

    try {
      const options = {
        body: description,
        icon: "/icon.png",
        vibrate: [200, 100, 200],
      };
      await NotificationService.showNotification(title, options);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const enableNotifications = async () => {
    try {
      const permissionGranted = await NotificationService.requestPermission();
      if (permissionGranted) {
        const registration = await NotificationService.registerServiceWorker();
        if (registration) {
          await NotificationService.subscribeToPushNotifications(registration);
          toggleAllow();
        }
      }
    } catch (error) {
      console.error("Failed to enable notifications. Please try again.");
    }
  };

  return (
    <div className={styles.notificationPage}>
      <div className={styles.sectionTitle}>
        <NotificationIcon className={styles.overviewIcon} aria-label="Information icon" />
        <h3>Scheduled Notifications</h3>
      </div>

      {!notificationEnabled && (
        <div className={styles.enableNotifications}>
          <button onClick={enableNotifications} className={styles.enableButton}>
            Enable Notifications
          </button>
        </div>
      )}

      <div className={styles.scheduleList}>
        {schedules.map(({ id, title, time, description }) => (
          <div key={id} className={styles.scheduleItem}>
            <div className={styles.scheduleItemHeader}>
              <h3>{title}</h3>
              <div className={styles.scheduleItemInner}>
                <ClockIcon className={styles.scheduleIcon} aria-label="Clock icon" />
                <p>{time}</p>
              </div>
            </div>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
