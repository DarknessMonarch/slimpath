"use client";

import { useEffect } from "react";

import Advert from "@/app/components/Advert";
import styles from "@/app/styles/home.module.css";
import { Overview } from "@/app/components/Overview";
import { Progress } from "@/app/components/Progress";
import { useTrackingStore } from "@/app/store/Tracking";

export default function Home() {
  const { currentTracking } = useTrackingStore();

  return (
    <div className={styles.homeMain}>
      <div className={styles.homeMainSideWrapTop}>
        <div className={styles.homeMainSide}>
          <Overview />
        </div>
        <Advert />
      </div>
      <div className={styles.homeMainSideWrapBottom}>
        <Progress
          progress={currentTracking?.progressTrend}
          chartData={currentTracking?.chartData}
        />
      </div>
    </div>
  );
}
