"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/app/loading";
import Popup from "@/app/components/Popup";
import { useAuthStore } from "@/app/store/Auth";
import Referral from "@/app/components/Referral";
import Dropdown from "@/app/components/Dropdown";
import { useSocialStore } from "@/app/store/Social";
import LogoLoading from "@/app/components/LogoLoading";
import { useTrackingStore } from "@/app/store/Tracking";
import { useRouter } from "next/navigation";

import {
  IoSunny as MorningIcon,
  IoMoon as MoonIcon,
  IoBookmark as InformationIcon,
} from "react-icons/io5";
import { GiMeal as MealIcon } from "react-icons/gi";
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
  const { toggleIsOpen } = useSocialStore();
  const { isAuth, userId, isAuthorized } = useAuthStore();
  const { currentTracking, isLoading, initializeTracking } = useTrackingStore();

  const [formData, setFormData] = useState({
    currentWeight: "",
    goalWeight: "",
    durationWeeks: "",
    age: "",
    height: "",
    activityLevel: "sedentary",
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
      const value = formData[key];
      if (!value) {
        newErrors[key] = `${label} is required`;
      } else if (isNaN(parseFloat(value))) {
        newErrors[key] = `${label} must be a valid number`;
      } else if (parseFloat(value) <= 0) {
        newErrors[key] = `${label} must be greater than 0`;
      }
    });

    // Additional validation rules
    if (!newErrors.currentWeight && !newErrors.goalWeight) {
      if (parseFloat(formData.goalWeight) >= parseFloat(formData.currentWeight)) {
        newErrors.goalWeight = "Goal weight should be less than current weight";
      }
    }

    if (!newErrors.age && parseInt(formData.age) > 120) {
      newErrors.age = "Please enter a valid age";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and single decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Handle special cases for each field
    let finalValue = numericValue;
    if (numericValue.includes('.')) {
      const parts = numericValue.split('.');
      if (parts.length > 2) {
        finalValue = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Limit decimal places based on field
      if (name === 'height') {
        finalValue = parts[0] + '.' + (parts[1] || '').slice(0, 1);
      } else {
        finalValue = parts[0] + '.' + (parts[1] || '').slice(0, 2);
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
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
    } else if (isAuth && !isAuthorized) {
      toast.error("Please refer two friends to use this feature to get access.");
      toggleIsOpen();
      return;
    }

    if (!validateForm()) return;

    
    const numericFormData = {
      userId,
      activityLevel: formData.activityLevel,
      currentWeight: parseFloat(formData.currentWeight),
      goalWeight: parseFloat(formData.goalWeight),
      durationWeeks: parseInt(formData.durationWeeks),
      age: parseInt(formData.age),
      height: parseFloat(formData.height)
    };

    const result = await initializeTracking(numericFormData);

    if (result.success) {
      toast.success("Analysis completed successfully!");
    }
  };

  const getIcon = (time) => {
    const icons = {
      Morning: <MorningIcon className={styles.icon} aria-label="Morning icon" />,
      Afternoon: <AfternoonIcon className={styles.icon} aria-label="Afternoon icon" />,
      Night: <MoonIcon className={styles.icon} aria-label="Night icon" />,
    };
    return icons[time] || icons.Morning;
  };

  const renderEmptyCard = () => {
    return (
      <div className={`${styles.caloriesSummarySection} ${styles.emptyCard} skeleton`}>
        <LogoLoading />
      </div>
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
                Current Weight (lb)
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="currentWeight"
                id="currentWeight"
                value={formData.currentWeight}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="200"
              />
              {errors.currentWeight && (
                <p className={styles.errorText}>{errors.currentWeight}</p>
              )}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="goalWeight" className={styles.label}>
                Goal Weight (lb)
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="goalWeight"
                id="goalWeight"
                value={formData.goalWeight}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="195"
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
                type="text"
                inputMode="numeric"
                name="durationWeeks"
                id="durationWeeks"
                value={formData.durationWeeks}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="4"
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
                type="text"
                inputMode="numeric"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="20"
              />
              {errors.age && <p className={styles.errorText}>{errors.age}</p>}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.formLastGroup}`}>
            <div className={styles.inputContainer}>
              <label htmlFor="height" className={styles.label}>
                Height (ft)
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="height"
                id="height"
                value={formData.height}
                onChange={handleInputChange}
                className={styles.inputField}
                placeholder="5.8"
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

      {currentTracking === null ? (
        renderEmptyCard()
      ) : (
        <div className={styles.caloriesSummarySection}>
          <div className={styles.sectionTitle}>
            <CalorieIcon
              height={40}
              width={40}
              className={styles.overviewIcon}
              aria-label="Calorie icon"
            />
            <h3>Daily Calorie Summary</h3>
          </div>
          <div className={styles.totalCalories}>
            <h1>{currentTracking?.dailyCalories ?? 0}</h1>
            <span>kcal</span>
          </div>
          <div className={styles.mealDistribution}>
            {currentTracking?.mealDistribution &&
              Object.entries(currentTracking.mealDistribution)
                .filter(([time]) =>
                  ["morning", "afternoon", "night"].includes(time)
                )
                .map(([time, mealData]) => (
                  <div key={time} className={styles.distributionCard}>
                    <div className={styles.cardTitle}>
                      {getIcon(time.charAt(0).toUpperCase() + time.slice(1))}
                      <h4>{time.charAt(0).toUpperCase() + time.slice(1)}</h4>
                    </div>
                    <div className={styles.mealDetails}>
                      <h2>{mealData.calories} kcal</h2>
                      <p className={styles.mealDescription}>
                        {mealData.description}
                      </p>
                      <div className={styles.recommendedMeals}>
                        <div className={styles.recommendedTitle}>
                          <MealIcon
                            height={40}
                            width={40}
                            className={styles.recommendedIcon}
                            aria-label="Information icon"
                          />
                          <h3>Recommended Meals</h3>
                        </div>
                        <ul>
                          {mealData.recommendedMeals.map((meal, index) => (
                            <li key={index}>{meal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
      <Popup content={<Referral />} />
    </div>
  );
};