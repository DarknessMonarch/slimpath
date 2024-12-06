import Image from "next/image";
import styles from "@/app/styles/logoLoading.module.css";
import AnimatedLogo from "@/public/assets/Logo.gif";

export default function Loading() {
  return (
    <div className={styles.loadingComponent}>
      <Image
        className={styles.loadingImg}
        src={AnimatedLogo}
        alt="Animated Logo "
        height={250}
        priority={true}
      />
    </div>
  );
}
