"use client";
import styles from "@/app/styles/meals.module.css";

import { GiMeal as MealIcon } from "react-icons/gi";
export const Meals = ({ meals, updateMeal }) => {
  return (
    <div className={styles.mealsSection}>
      <div className={styles.sectionTitle}>
        <MealIcon
          height={40}
          width={40}
          className={styles.overviewIcon}
          aria-label="Information icon"
        />
        <h3>Meal Distribution Schedule</h3>
      </div>
      <div className={styles.mealDetails}>
        {/* {meals.map((meal) => (
          <div key={meal.id} className={styles.mealInfo}>
            <h4 >{meal.name}</h4>

            <div className={styles.mealCard}>
              <h3>Calories</h3>
              <div className={styles.mealInner}>
                <h3>{meal.calories} kcal</h3>
                
              </div>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};
