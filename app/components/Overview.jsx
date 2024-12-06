"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/app/loading";
import Dropdown from "@/app/components/Dropdown";
import { useAuthStore } from "@/app/store/Auth";
import { useTrackingStore } from "@/app/store/Tracking";
import { useRouter } from "next/navigation";

import {
  IoSunny as MorningIcon,
  IoMoon as MoonIcon,
  IoBookmark as InformationIcon,
} from "react-icons/io5";
import { IoMdPartlySunny as AfternoonIcon } from "react-icons/io";
import { ImSpoonKnife as CalorieIcon } from "react-icons/im";
import { IoFitness as ActivityIcon } from "react-icons/io5";
import styles from "@/app/styles/overview.module.css";

const activityLevels = [
  { code: "sedentary", name: "Sedentary (little or no exercise)" },
  {
    code: "lightlyActive",
    name: "Lightly Active (light exercise 1-3 days/week)",
  },
  {
    code: "moderatelyActive",
    name: "Moderately Active (moderate exercise 3-5 days/week)",
  },
  { code: "veryActive", name: "Very Active (hard exercise 6-7 days/week)" },
  {
    code: "extraActive",
    name: "Extra Active (very hard exercise & physical job)",
  },
];

export const Overview = () => {
  const router = useRouter();
  const { isAuth, userId } = useAuthStore();
  const { currentTracking, isLoading, initializeTracking } = useTrackingStore();

  const [formData, setFormData] = useState({
    currentWeight: "",
    goalWeight: "",
    durationWeeks: "",
    age: "",
    height: "",
    activityLevel: "lightlyActive",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const fields = {
      currentWeight: "Current weight",
      goalWeight: "Goal weight",
      durationWeeks: "Duration",
      age: "Age",
      height: "Height",
    };

    Object.entries(fields).forEach(([key, label]) => {
      if (!formData[key]) {
        newErrors[key] = `${label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleActivitySelect = (option) => {
    setFormData((prev) => ({ ...prev, activityLevel: option.code }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuth) {
      toast.error("Please log in to use this feature.");
      router.push("/authentication/login", { scroll: false });
      return;
    }

    if (!validateForm()) return;

    const result = await initializeTracking({
      userId,
      ...formData,
    });

    if (result.success) {
      toast.success("Analysis completed successfully!");
    }
  };

  const getIcon = (time) => {
    const icons = {
      Morning: (
        <MorningIcon className={styles.icon} aria-label="Morning icon" />
      ),
      Afternoon: (
        <AfternoonIcon className={styles.icon} aria-label="Afternoon icon" />
      ),
      Night: <MoonIcon className={styles.icon} aria-label="Night icon" />,
    };
    return icons[time] || icons.Morning;
  };

  const renderEmptyCard = () => {
    return (
      <div
        className={`${styles.caloriesSummarySection} ${styles.emptyCard} skeleton`}
      ></div>
    );
  };

  return (
    <div className={styles.overviewSection}>
      <div className={styles.basicInfo}>
        <div className={styles.sectionTitle}>
          <InformationIcon
            height={40}
            width={40}
            className={styles.overviewIcon}
            aria-label="Information icon"
          />
          <h3>Basic Information</h3>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <label htmlFor="currentWeight" className={styles.label}>
                Current Weight (kg)
              </label>
              <input
                type="number"
                name="currentWeight"
                id="currentWeight"
                value={formData.currentWeight}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="70"
              />
              {errors.currentWeight && (
                <p className={styles.errorText}>{errors.currentWeight}</p>
              )}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="goalWeight" className={styles.label}>
                Goal Weight (kg)
              </label>
              <input
                type="number"
                name="goalWeight"
                id="goalWeight"
                value={formData.goalWeight}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="65"
              />
              {errors.goalWeight && (
                <p className={styles.errorText}>{errors.goalWeight}</p>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <label htmlFor="durationWeeks" className={styles.label}>
                Duration (weeks)
              </label>
              <input
                type="number"
                name="durationWeeks"
                id="durationWeeks"
                value={formData.durationWeeks}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="12"
              />
              {errors.durationWeeks && (
                <p className={styles.errorText}>{errors.durationWeeks}</p>
              )}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="age" className={styles.label}>
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="30"
              />
              {errors.age && <p className={styles.errorText}>{errors.age}</p>}
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.formLastGroup}`}>
            <div className={styles.inputContainer}>
              <label htmlFor="height" className={styles.label}>
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                id="height"
                value={formData.height}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="170"
              />
              {errors.height && (
                <p className={styles.errorText}>{errors.height}</p>
              )}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="activityLevel" className={styles.label}>
                Activity Level
              </label>
              <Dropdown
                options={activityLevels}
                onSelect={handleActivitySelect}
                Icon={<ActivityIcon className={styles.dropdownIcon} />}
                dropPlaceHolder="Select activity level"
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.formcontactButton}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Get Analysis"}
          </button>
        </form>
      </div>

      {currentTracking !== null ? (
        renderEmptyCard()
      ) : (
        <div className={styles.caloriesSummarySection}>
          <div className={styles.sectionHeader}>
            <CalorieIcon
              height={40}
              width={40}
              className={styles.icon}
              aria-label="Calorie icon"
            />
            <h3>Daily Calorie Summary</h3>
          </div>
          <div className={styles.totalCalories}>
            <h1>{currentTracking.dailyCalories}</h1>
            <span>kcal</span>
          </div>
          <div className={styles.mealDistribution}>
            {Object.entries(currentTracking.mealDistribution).map(
              ([time, calories]) => (
                <div key={time} className={styles.distributionCard}>
                  <div className={styles.cardHeader}>
                    {getIcon(time)}
                    <h4>{time}</h4>
                  </div>
                  <span>{calories} kcal</span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
