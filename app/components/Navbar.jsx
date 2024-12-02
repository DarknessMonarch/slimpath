"use client";

import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/navbar.module.css";
import { useNotificationStore } from "@/app/store/Notification";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  RiMenu4Fill as MenuIcon,
  RiSearch2Line as SearchIcon,
} from "react-icons/ri";

import {
  IoNotificationsCircle as NotificationOnIcon,
  IoNotificationsOffCircle as NotificationOffIcon,
} from "react-icons/io5";
import { HiOutlineLogout as LogoutIcon } from "react-icons/hi";

const SearchBar = ({ value, onChange, className }) => (
  <div className={`${styles.searchContainer} ${className}`}>
    <SearchIcon
      alt="search icon"
      className={styles.searchIcon}
      aria-label="Search"
    />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search ..."
      className={styles.searchInput}
      aria-label="Search input"
    />
  </div>
);

export default function NavbarComponent() {
  const { isAuth, toggleAuth } = useAuthStore();
  const [username, setUsername] = useState("penguin");
  const { isOpen, toggleOpen } = useDrawerStore();
  const [isMobile, setIsMobile] = useState(false);
  const { isAllowed } = useNotificationStore();
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
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

  const handleLogout = useCallback(() => {
    try {
      toggleAuth(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  }, [toggleAuth]);

  const isSearchablePage = pathname === "/page/home";

  const performSearch = useMemo(
    () =>
      debounce((searchValue) => {
        const params = new URLSearchParams(searchParams);
        if (searchValue) {
          params.set("q", searchValue);
        } else {
          params.delete("q");
        }
        router.replace(`${pathname}?${params}`);
      }, 300),
    [searchParams, router, pathname]
  );

  useEffect(() => {
    performSearch(search.trim());

    return () => performSearch.cancel();
  }, [search, performSearch, isSearchablePage]);

  const handleInputChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);
  const openNotification = () => {
    router.push("notification", { scroll: false });
  };

  return (
    <nav className={styles.navMain}>
      <div className={styles.navContainer}>
        <div className={styles.navContainerRight}>
          {isMobile ? (
            <h1>Hello,</h1>
          ) : (
            <>
              <h1>
                Hello <span>{username}</span>
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
                  : styles.activeNotification
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
              height={40}
              width={40}
            />
          )}
        </div>
      </div>


    </nav>
  );
}
