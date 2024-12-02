"use client";

import { useTermCardStore } from "@/app/store/TermCard";
import styles from "@/app/styles/termcard.module.css";

export default function TermCard() {
  const { showCard, setShowCard } = useTermCardStore();

  const termcardData = [
    {
      name: "tips",
      title: "Health Tips",
      description: "Read our health tips",
    },
    {
      name: "about",
      title: "About Us",
      description: "Learn more about us",
    },
    {
      name: "Terms",
      title: "Terms and Conditions",
      description: "Read our terms and conditions",
    },
 
    {
      name: "Disclaimer",
      title: "Our Disclaimer",
      description: "Read our disclaimer",
    },
  
  ];

  return (
    <div className={styles.termcardContainer}>
      {termcardData.map((data, index) => (
        <div
          className={`${styles.termcard} ${
            showCard === data.name ? styles.termcardActive : ""
          }`}
          onClick={() => setShowCard(data.name)}
          key={index}
        >
          <div className={styles.termcardTitle}>
            <h3> {data.title}</h3>
            <p>{data.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
