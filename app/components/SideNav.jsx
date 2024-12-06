"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/app/store/Auth";
import ProfileImg from "@/public/assets/profile.jpg";
import LogoImg from "@/public/assets/logoColor.png";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/sideNav.module.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  RiDashboardHorizontalLine as DashboardIcon,
  RiUserLine as UserIcon,
} from "react-icons/ri";
import { MdOutlineSettings as SettingsIcon } from "react-icons/md";
import { IoReaderOutline as HealthTipsIcon } from "react-icons/io5";
import { FaCalculator as CalculatorIcon } from "react-icons/fa";
import { LuContact as ContactIcon } from "react-icons/lu";

export default function SideNav() {
  const router = useRouter();
  const { isOpen , toggleOpen} = useDrawerStore();
  const [isMobile, setIsMobile] = useState(false);
  const { isAuth, profileImage } = useAuthStore();
  const [profile, setProfile] = useState(ProfileImg);

  const pathname = usePathname();

  const handleLogin = () => {
    router.push("/authentication/login", { scroll: false });
  };




  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAuth && profileImage) {
      setProfile(profileImage);
    } else {
      setProfile(ProfileImg);
    }
  }, [isAuth, profileImage]);

  const sidebarClasses = `${styles.sideContainer} ${
    isMobile
      ? isOpen
        ? styles.showSideNav
        : styles.hideSideNav
      : styles.showSideNav
  }`;
  

  const closeDrawer = () => {
    if (isMobile && isOpen) {
      toggleOpen();
    }
  };

  return (
    <div className={sidebarClasses}>
      <div className={styles.sideWrapper}>
        <Image
          className={styles.logo}
          src={LogoImg}
          alt="logo"
          height={40}
          priority={true}
        />
        <div className={styles.sideMiddle}>
          <Link
            href="/page/home"
            onClick={closeDrawer}
            className={`${styles.sideLink} ${
              pathname === "/page/home" || pathname.startsWith("/page/home/")
                ? styles.activeLink
                : ""
            }`}
          >
            <DashboardIcon
              alt="dashboard icon"
              aria-label="dashboard icon"
              className={styles.linkIcon}
            />
          </Link>
          <div className={styles.pipeContainer}>
            <div className={`${styles.pipeCircle} ${styles.leftCircle}`}></div>
            <div
              className={`${styles.pipeLink} ${
                pathname === "/page/home" || pathname.startsWith("/page/home/")
                  ? styles.activePipe
                  : ""
              }`}
            ></div>
            <div className={`${styles.pipeCircle} ${styles.rightCircle}`}></div>
          </div>
          <Link
            href="/page/calculator"
            onClick={closeDrawer}
            className={`${styles.sideLink} ${
              pathname === "/page/calculator" ||
              pathname.startsWith("/page/calculator/")
                ? styles.activeLink
                : ""
            }`}
          >
            <CalculatorIcon
              alt="calculator icon"
              aria-label="calculator icon"
              className={styles.linkIcon}
            />
          </Link>
          <div className={styles.pipeContainer}>
            <div className={`${styles.pipeCircle} ${styles.leftCircle}`}></div>
            <div
              className={`${styles.pipeLink} ${
                pathname === "/page/calculator" || pathname.startsWith("/page/calculator/")
                  ? styles.activePipe
                  : ""
              }`}
            ></div>
            <div className={`${styles.pipeCircle} ${styles.rightCircle}`}></div>
          </div>
          <Link
            href="/page/contact"
            onClick={closeDrawer}
            className={`${styles.sideLink} ${
              pathname === "/page/contact" ||
              pathname.startsWith("/page/contact/")
                ? styles.activeLink
                : ""
            }`}
          >
            <ContactIcon
              alt="contact icon"
              aria-label="contact icon"
              className={styles.linkIcon}
            />
          </Link>
          <div className={styles.pipeContainer}>
            <div className={`${styles.pipeCircle} ${styles.leftCircle}`}></div>
            <div
              className={`${styles.pipeLink} ${
                pathname === "/page/contact" || pathname.startsWith("/page/contact/")
                  ? styles.activePipe
                  : ""
              }`}
            ></div>
            <div className={`${styles.pipeCircle} ${styles.rightCircle}`}></div>
          </div>
          <Link
            href="/page/healthTips"
            onClick={closeDrawer}
            className={`${styles.sideLink} ${
              pathname === "/page/healthTips" ||
              pathname.startsWith("/page/healthTips/")
                ? styles.activeLink
                : ""
            }`}
          >
            <HealthTipsIcon
              alt="healthTips icon"
              aria-label="healthTips icon"
              className={styles.linkIcon}
            />
          </Link>

          {isAuth && (
            <>
              <div className={styles.pipeContainer}>
                <div
                  className={`${styles.pipeCircle} ${styles.leftCircle}`}
                ></div>
                <div
                  className={`${styles.pipeLink} ${
                    pathname === "/page/settings" ||
                    pathname.startsWith("/page/settings/")
                      ? styles.activePipe
                      : ""
                  }`}
                ></div>
                <div
                  className={`${styles.pipeCircle} ${styles.rightCircle}`}
                ></div>
              </div>
              <Link
                href="/page/settings"
                onClick={closeDrawer}
                className={`${styles.sideLink} ${
                  pathname === "/page/settings" ||
                  pathname.startsWith("/page/settings/")
                    ? styles.activeLink
                    : ""
                }`}
              >
                <SettingsIcon
                  alt="settings icon"
                  aria-label="settings icon"
                  className={styles.linkIcon}
                />
              </Link>
            </>
          )}
        </div>
        <div className={styles.sideBottomContainer}>
          {isAuth ? (
            <div
              className={styles.userSection}
              style={{ width: !isOpen || isMobile ? "auto" : "" }}
            >
              <Image
                src={profile}
                height={60}
                width={60}
                alt="user profile"
                priority
                className={styles.profileImg}
              />
            </div>
          ) : (
            <div className={styles.buttomLogin}>
              <UserIcon
                alt="user icon"
                aria-label="user icon"
                className={styles.linkIcon}
                onClick={handleLogin}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
