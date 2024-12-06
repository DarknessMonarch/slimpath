// components/Progress.jsx
"use client";

import WeightProgressChart from "@/app/components/chartComponent";
import styles from "@/app/styles/progress.module.css";

import { TbArrowWaveLeftDown as LossIcon } from "react-icons/tb";
import { FaHourglassStart as StartingIcon } from "react-icons/fa";
import { TbCurrentLocation as GoalIcon } from "react-icons/tb";
import { FaWeightHanging as CurrentIcon } from "react-icons/fa6";
import { IoCalendar as CalendarIcon } from "react-icons/io5";
import { GiGearStickPattern as PatternIcon } from "react-icons/gi";

const getIcon = (name) => {
  switch (name) {
    case "startingWeight":
      return (
        <StartingIcon
          height={40}
          width={40}
          className={styles.progressIcon}
          aria-label="progress icon"
        />
      );
    case "weeklyGoal":
      return (
        <GoalIcon
          height={40}
          width={40}
          className={styles.progressIcon}
          aria-label="progress icon"
        />
      );
    case "currentWeight":
      return (
        <CurrentIcon
          height={40}
          width={40}
          className={styles.progressIcon}
          aria-label="progress icon"
        />
      );
    case "actualLoss":
      return (
        <LossIcon
          height={40}
          width={40}
          className={styles.progressIcon}
          aria-label="progress icon"
        />
      );
    default:
      return null;
  }
};

export const Progress = ({ progress, chartData }) => {

  return (
    <div className={styles.progressSection}>
      <div className={styles.weeklyProgress}>
        <div className={styles.sectionTitle}>
          <CalendarIcon
            height={40}
            width={40}
            className={styles.overviewIcon}
            aria-label="Information icon"
          />
          <h3>Weekly Progress</h3>
        </div>
        <div className={styles.chartContainer}>
          {/* <WeightProgressChart data={} /> */}
        </div>
        <div className={styles.progressDetails}>
          {/* {Object.entries(weekly).map(([key, value]) => (
            <div key={key} className={styles.progressRow}>
              <div className={styles.progressTitle}>
                {getIcon(key)}
                <h3>{key}</h3>
              </div>
              <span>{value} kg</span>
            </div>
          ))} */}
        </div>
      
      </div>
      <div className={styles.patternDetection}>
      <div className={styles.sectionTitle}>
          <PatternIcon
            height={40}
            width={40}
            className={styles.overviewIcon}
            aria-label="Pattern icon"
          />
          <h3>Pattern Detection</h3>
        </div>
        <div className={styles.patternInfo}>
          <h4>Best Progress Days</h4>
          <p></p>

          <h4>Sleep Correlation</h4>
          <p></p>

          <h4>Meal Timing</h4>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default Progress;
