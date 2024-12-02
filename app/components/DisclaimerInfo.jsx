"use client";

import styles from "@/app/styles/about.module.css";

export default function Disclaimer() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContainerInner}>
        <h2>Disclaimer</h2>
        <p>
          Welcome to Slimpath! Our goal is to provide helpful tools and guidance for tracking calories and supporting your weight management journey. Please keep in mind that the information on Slimpath is for general purposes only and should not replace professional medical advice. Before making significant changes to your diet or exercise, consider consulting a healthcare professional to ensure it’s the best path for you.
        </p>
        <p>
          <h2>Results May Vary</h2>
          Slimpath is designed to support your personal wellness goals, but remember that everyone’s body is unique. Results may vary depending on many factors, and we encourage you to approach weight management at your own pace and in a way that feels sustainable and healthy.
        </p>
        <p>
          <h2>For Informational Purposes Only</h2>
          The tools and information on Slimpath are based on general nutrition and wellness principles, but they may not be tailored specifically to your individual needs. Please use them as a guide and adjust to what works best for you.
        </p>
        <p>
          <h2>Third-Party Resources</h2>
          Occasionally, we may link to third-party content for additional resources. While we do our best to suggest valuable content, Slimpath cannot guarantee the accuracy or relevance of third-party information. We recommend reviewing these resources carefully.
        </p>
        <p>
          <h2>Continual Improvement</h2>
          At Slimpath, we’re committed to bringing you up-to-date tools and information. However, wellness information is always evolving, so some details might occasionally change. We’ll do our best to keep everything updated for your benefit.
        </p>
        <p>
          Thank you for choosing Slimpath to support your wellness goals. Enjoy the journey, and feel free to adjust our recommendations to suit your needs. We’re here to help you along the way!
        </p>
      </div>
    </div>
  );
}
