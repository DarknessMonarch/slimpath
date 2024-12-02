"use client";

import { useRouter } from "next/navigation";
import styles from "@/app/styles/about.module.css";

export default function About() {
  const router = useRouter();

  const navigateToFeature = (feature) => {
    switch (feature) {
      case "calculateWeight":
        router.push("home", { scroll: false });
        break;
      case "calorieTracker":
        router.push("home", { scroll: false });
        break;
      case "tips":
        router.push("healthTips", { scroll: false });
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContainerInner}>
        <h2>Welcome to Slimpath, Your Personal Weight-Loss Companion!</h2>
        <p>
          Slimpath is a web app designed to support your weight-loss journey by calculating your ideal weight based on personal metrics and determining the recommended daily calorie intake for healthy, sustainable weight loss.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h2>How Slimpath Works</h2>
        <p>
          Our system gathers your basic information like age, gender, current weight, and target weight, then calculates your Body Mass Index (BMI) and daily calorie needs. Based on these, it provides personalized calorie goals to help you achieve and maintain your ideal weight.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h2>Features That Make Slimpath Stand Out</h2>
        <p>
          Slimpath’s smart calorie tracker monitors your intake, offering daily, weekly, and monthly insights into your progress. With additional features like goal reminders, progress charts, and a library of health tips, Slimpath is more than a calorie counter—it&apos;s a full support system for a healthier you.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h2>The Benefits of Using Slimpath for Weight Loss</h2>
        <p>
          Slimpath provides a structured, science-based approach to weight loss, helping you achieve your goals without extreme dieting. With its personalized approach and easy-to-use calorie tracker, you can make informed choices and stay motivated every day. Let Slimpath guide you toward your healthiest self!
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h2>How to Get Started with Slimpath</h2>
        <p>
          Simply create an account, enter your details, and let Slimpath do the rest. You’ll receive a daily calorie goal, suggestions for healthy foods, and strategies to stay on track. Whether you’re looking to lose a few pounds or make a major transformation, Slimpath is here to support every step of the way.
        </p>
      </div>
      <div className={styles.aboutContainerInner}>
        <h2>Our Key Features</h2>
        <p>Explore the core functionalities of Slimpath to boost your journey:</p>
        <ul>
          <li onClick={() => navigateToFeature("calculateWeight")}>Weight Calculator</li>
          <li onClick={() => navigateToFeature("calorieTracker")}>Calorie Tracker</li>
          <li onClick={() => navigateToFeature("tips")}>Health and Wellness Tips</li>
        </ul>
      </div>
    </div>
  );
}
