"use client";

import TermCard from "@/app/components/TermCard";
import TermInfo from "@/app/components/TermInfo";
import TipsInfo from "@/app/components/TipsInfo";
import AboutInfo from "@/app/components/AboutInfo";
import styles from "@/app/styles/about.module.css";
import { useTermCardStore } from "@/app/store/TermCard";
import DisclaimerInfo from "@/app/components/DisclaimerInfo";

export default function TermPage() {
  const { showCard } = useTermCardStore();

  const showCardHandler = (name) => {
    switch (name) {
      case "tips":
        return <TipsInfo />;
      case "about":
        return <AboutInfo />;
      case "Terms":
        return <TermInfo />;
        case "Disclaimer":
          return <DisclaimerInfo />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <TermCard />
      {showCardHandler(showCard)}
    </div>
  );
}
