"use client";

import { useState, useEffect } from "react";


import Loader from "@/app/loading";
import Advert from "@/app/components/Advert";
import { Meals } from "@/app/components/Meals";
import styles from "@/app/styles/home.module.css";
import { Overview } from "@/app/components/Overview";
import { Progress } from "@/app/components/Progress";


import { initialData } from "@/app/lib/data";

export default function Home() {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData(initialData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateBasicInfo = (newInfo) => {
    setData((prev) => ({
      ...prev,
      basicInfo: newInfo,
    }));
  };

  const updateMeal = (id, updates) => {
    setData((prev) => ({
      ...prev,
      meals: prev.meals.map((meal) =>
        meal.id === id ? { ...meal, ...updates } : meal
      ),
    }));
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.homeMain}>
      <div className={styles.homeMainSideWrapTop}>
        <div className={styles.homeMainSide}>
          <Overview
            basicInfo={data.basicInfo}
            caloriesSummary={data.caloriesSummary}
            updateBasicInfo={updateBasicInfo}
          />
        </div>
        <div className={styles.homeMainSide}>
          <Meals meals={data.meals} updateMeal={updateMeal} />
        </div>
        <Advert/>
      </div>
      <div className={styles.homeMainSideWrapBottom}>
          <Progress progress={data.progress} chartData={data.chartData} />
      </div>
    </div>
  );
}
