"use client";

import WeightProgressChart from "@/app/components/chartComponent";
import styles from "@/app/styles/progress.module.css";
import LogoLoading from "@/app/components/LogoLoading";

import { TbArrowWaveLeftDown as LossIcon } from "react-icons/tb";
import { FaHourglassStart as StartingIcon } from "react-icons/fa";
import { TbCurrentLocation as GoalIcon } from "react-icons/tb";
import { FaWeightHanging as CurrentIcon } from "react-icons/fa6";
import { IoCalendar as CalendarIcon } from "react-icons/io5";
import { GiGearStickPattern as PatternIcon } from "react-icons/gi";

const getIcon = (name) => {
  switch (name) {
    case "startingWeight":
      return <StartingIcon style={{ fontSize: "40px" }} className={styles.progressIcon} aria-label="progress icon" />;
    case "weeklyGoal":
      return <GoalIcon style={{ fontSize: "40px" }} className={styles.progressIcon} aria-label="progress icon" />;
    case "currentWeight":
      return <CurrentIcon style={{ fontSize: "40px" }} className={styles.progressIcon} aria-label="progress icon" />;
    case "actualLoss":
      return <LossIcon style={{ fontSize: "40px" }} className={styles.progressIcon} aria-label="progress icon" />;
    default:
      return null;
  }
};

const formatKey = (key) => {
  const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  return formattedKey;
};

const renderEmptyCard = () => {
  return (
    <div className={styles.progressSection}>
      <div className={`${styles.weeklyProgress} ${styles.emptyCard} skeleton`}>
        <LogoLoading />
      </div>
      <div className={`${styles.patternDetection} ${styles.emptyCard} skeleton`}>
        <LogoLoading />
      </div>
    </div>
  );
};

export const Progress = ({ progress, chartData }) => {
  if (!progress || !chartData || Object.keys(progress).length === 0) {
    return renderEmptyCard();
  }
  const weekly = progress?.weeklyProgress || {};

  return (
    <div className={styles.progressSection}>
      <div className={styles.weeklyProgress}>
        <div className={styles.sectionTitle}>
          <CalendarIcon style={{ fontSize: "40px" }} className={styles.overviewIcon} aria-label="Information icon" />
          <h3>Weekly Progress</h3>
        </div>
        <div className={styles.chartContainer}>
          <WeightProgressChart data={chartData} />
        </div>
        <div className={styles.progressDetails}>
          {Object.entries(weekly).map(([key, value]) => (
            <div key={key} className={styles.progressRow}>
              <div className={styles.progressTitle}>
                {getIcon(key)}
                <h3>{formatKey(key)}</h3>
              </div>
              <span>{typeof value === "number" ? value.toFixed(1) : value} kg</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.patternDetection}>
        <div className={styles.sectionTitle}>
          <PatternIcon style={{ fontSize: "40px" }} className={styles.overviewIcon} aria-label="Pattern icon" />
          <h3>Pattern Detection</h3>
        </div>
        {progress?.overallTrend ? (
          <div className={styles.patternInfo}>
            <h4>Detected Pattern</h4>
            <p>{progress.overallTrend}</p>
          </div>
        ) : (
          <div className={styles.patternInfo}>
            <h4>No Pattern Detected</h4>
            <p>Continue tracking to detect patterns</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
