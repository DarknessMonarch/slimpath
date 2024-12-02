"use client";

import { useState } from "react";
import styles from "@/app/styles/calculator.module.css";

const foodDatabase = {
  apple: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  banana: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 },
  "chicken breast": {
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
  },
  rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 },
  eggs: { calories: 155, protein: 12.6, carbs: 1.1, fat: 11.3, fiber: 0 },
  milk: { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
  potato: { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
  tomato: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  carrot: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
};

import { FaCalculator as CalculatorIcon } from "react-icons/fa";

export default function FoodCalculator() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const addIngredient = (e) => {
    e.preventDefault();
    if (!newIngredient || !weight) {
      setError("Please enter both ingredient and weight");
      return;
    }

    const ingredient = newIngredient.toLowerCase();
    if (!foodDatabase[ingredient]) {
      setError("Ingredient not found in database");
      return;
    }

    const weightNum = parseFloat(weight);
    const multiplier = weightNum / 100;
    const nutritionInfo = {
      name: ingredient,
      weight: weightNum,
      calories: foodDatabase[ingredient].calories * multiplier,
      protein: foodDatabase[ingredient].protein * multiplier,
      carbs: foodDatabase[ingredient].carbs * multiplier,
      fat: foodDatabase[ingredient].fat * multiplier,
      fiber: foodDatabase[ingredient].fiber * multiplier,
    };

    setIngredients([...ingredients, nutritionInfo]);
    setNewIngredient("");
    setWeight("");
    setError("");
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const totals = ingredients.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return (
    <div className={styles.calculatorContainer}>
      <div className={styles.calculatorContainerInner}>
        <div className={styles.calculatorSection}>
          <div className={styles.sectionTitle}>
            <CalculatorIcon
              height={40}
              width={40}
              className={styles.overviewIcon}
              aria-label="Information icon"
            />
            <h3>Nutritional Calculator</h3>
          </div>
          <form onSubmit={addIngredient} className={styles.inputForm}>
            <div className={styles.inputGroup}>
              <select
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                className={styles.ingredientSelect}
              >
                <option>Select ingredient</option>
                {Object.keys(foodDatabase).map((food) => (
                  <option key={food} value={food}>
                    {food}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight (g)"
                className={styles.weightInput}
              />

              <button type="submit" className={styles.addButton}>
                Add
              </button>
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>

          <div className={styles.ingredientsList}>
            {ingredients.map((item, index) => (
              <div key={index} className={styles.ingredientItem}>
                <div className={styles.ingredientInfo}>
                  <h1>
                    {item.name} ({item.weight}g)
                  </h1>
                  <div className={styles.nutritionInfo}>
                    <span>Calories: {Math.round(item.calories)}</span>
                    <span>P: {item.protein.toFixed(1)}g</span>
                    <span>C: {item.carbs.toFixed(1)}g</span>
                    <span>F: {item.fat.toFixed(1)}g</span>
                  </div>
                </div>
                <button
                  onClick={() => removeIngredient(index)}
                  className={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {ingredients.length > 0 && (
          <div className={styles.nutritionSummary}>
            <h2>Nutritional Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <h1>Vitamin</h1>
                <span>{totals.protein.toFixed(1)}g</span>
              </div>

              <div className={styles.summaryItem}>
                <h1>Protein</h1>
                <span>{totals.protein.toFixed(1)}g</span>
              </div>
              <div className={styles.summaryItem}>
                <h1>Carbs</h1>
                <span>{totals.carbs.toFixed(1)}g</span>
              </div>
              <div className={styles.summaryItem}>
                <h1>Fat</h1>
                <span>{totals.fat.toFixed(1)}g</span>
              </div>
              <div className={styles.summaryItem}>
                <h1>Fiber</h1>
                <span>{totals.fiber.toFixed(1)}g</span>
              </div>
              <div className={styles.summaryItem}>
                <h1>Total Calories</h1>
                <span>{Math.round(totals.calories)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


