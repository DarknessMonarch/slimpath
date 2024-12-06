"use client";

import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/navbar.module.css";
import { useNotificationStore } from "@/app/store/Notification";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

import { RiMenu4Fill as MenuIcon } from "react-icons/ri";

import {
  IoNotificationsCircle as NotificationOnIcon,
  IoNotificationsOffCircle as NotificationOffIcon,
} from "react-icons/io5";
import { HiOutlineLogout as LogoutIcon } from "react-icons/hi";

export default function NavbarComponent() {
  const { isAuth, username, clearUser } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const { isAllowed } = useNotificationStore();
  const { toggleOpen } = useDrawerStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await clearUser();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  }, [clearUser]);

  const openNotification = () => {
    router.push("notification", { scroll: false });
  };

  return (
    <nav className={styles.navMain}>
      <div className={styles.navContainer}>
        <div className={styles.navContainerRight}>
          {isMobile ? (
            <h1>
              {" "}
              Hello <span>{username || "guest"}</span>
            </h1>
          ) : (
            <>
              <h1>
                Hello <span>{username || "guest"}</span>
              </h1>
              <p>You&apos;re doing great, keep up the good work!</p>
            </>
          )}
        </div>
        <div className={styles.navContainerLeft}>
          {isAllowed ? (
            <NotificationOnIcon
              height={30}
              width={30}
              onClick={openNotification}
              className={`${styles.navIcon} ${
                pathname === "/page/notification" ||
                pathname.startsWith("/page/notification/")
                  ? styles.activeNotification
                  : ""
              }`}
              aria-label="notification icon"
              alt="notification icon"
            />
          ) : (
            <NotificationOffIcon
              height={30}
              width={30}
              onClick={openNotification}
              className={`${styles.navIcon} ${
                pathname === "/page/notification" ||
                pathname.startsWith("/page/notification/")
                  ? styles.activeNotification
                  : ""
              }`}
              aria-label="notification icon"
              alt="notification icon"
            />
          )}

          <MenuIcon
            onClick={toggleOpen}
            className={styles.menuIcon}
            aria-label="Toggle menu"
            alt="toggle menu icon"
          />
          {isAuth && (
            <LogoutIcon
              onClick={handleLogout}
              className={styles.navIcon}
              aria-label="logout icon"
              alt="logout icon"
            />
          )}
        </div>
      </div>
    </nav>
  );
}
