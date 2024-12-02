"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Popup from "@/app/components/Popup";
import Loader from "@/app/components/loader";
import { useAuthStore } from "@/app/store/Auth";
import Referral from "@/app/components/Referral";
import { useSocialStore } from "@/app/store/Social";
import styles from "@/app/styles/overview.module.css";
import { useRouter } from "next/navigation";
import {
  IoSunny as MorningIcon,
  IoMoon as MoonIcon,
  IoBookmark as InformationIcon,
} from "react-icons/io5";
import { IoMdPartlySunny as AfternoonIcon } from "react-icons/io";
import { ImSpoonKnife as CalorieIcon } from "react-icons/im";

export const Overview = ({ basicInfo, caloriesSummary, updateBasicInfo }) => {
  const router = useRouter();
  const { isOpen, toggleIsOpen } = useSocialStore();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, isAuthorized, toggleAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    weight: "",
    goal: "",
    duration: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.weight.trim())
      newErrors.weight = "Current weight is required";
    if (!formData.goal.trim()) newErrors.goal = "Goal weight is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuth) {
      toast.error("Please log in to use this feature.");
      router.push("/authentication/login", { scroll: false });
    } else if (isAuth && !isAuthorized) {
      toggleIsOpen();
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateBasicInfo(formData);
      toast.success("Information updated successfully!");
    } catch (error) {
      toast.error("Failed to update information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (day) => {
    switch (day) {
      case "Morning":
        return (
          <MorningIcon
            height={40}
            width={40}
            className={styles.caloriesIcon}
            aria-label="Morning icon"
          />
        );
      case "Afternoon":
        return (
          <AfternoonIcon
            height={40}
            width={40}
            className={styles.caloriesIcon}
            aria-label="Afternoon icon"
          />
        );
      case "Night":
        return (
          <MoonIcon
            height={40}
            width={40}
            className={styles.caloriesIcon}
            aria-label="Night icon"
          />
        );
      default:
        return (
          <MorningIcon
            height={40}
            width={40}
            className={styles.caloriesIcon}
            aria-label="Default icon"
          />
        );
    }
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
        <form className={styles.weightInputs} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="weight">Current Weight (kg)</label>
            <input
              type="text"
              name="weight"
              id="weight"
              placeholder="300"
              value={formData.weight}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            {errors.weight && (
              <p className={styles.errorText}>{errors.weight}</p>
            )}
          </div>
          <div className={styles.inputGroupContainer}>
            <div className={styles.inputGroup}>
              <label htmlFor="goal">Goal Weight (kg)</label>
              <input
                type="text"
                name="goal"
                id="goal"
                placeholder="500"
                value={formData.goal}
                onChange={handleInputChange}
                className={styles.inputField}
              />
              {errors.goal && <p className={styles.errorText}>{errors.goal}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="goal">Duration (weeks)</label>
              <input
                type="text"
                name="duration"
                id="duration"
                placeholder="2"
                value={formData.duration}
                onChange={handleInputChange}
                className={styles.inputField}
              />
              {errors.goal && <p className={styles.errorText}>{errors.goal}</p>}
            </div>
          </div>

          <button
            type="submit"
            className={styles.formcontactButton}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Get analysis"}
          </button>
        </form>
      </div>

      <div className={styles.caloriesSummary}>
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
          <h1>{caloriesSummary.total}</h1>
          <span>kcal</span>
        </div>
        <div className={styles.mealDistribution}>
          {Object.entries(caloriesSummary.distribution).map(
            ([time, calories]) => (
              <div key={time} className={styles.distributionCard}>
                <div className={styles.cardTitle}>
                  {getIcon(time.charAt(0).toUpperCase() + time.slice(1))}
                  <h4>{time.charAt(0).toUpperCase() + time.slice(1)}</h4>
                </div>
                <span>{calories} kcal</span>
              </div>
            )
          )}
        </div>
      </div>
      <Popup content={<Referral />} />
    </div>
  );
};
