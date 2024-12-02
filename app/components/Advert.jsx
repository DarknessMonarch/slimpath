import Image from "next/image";
import styles from "@/app/styles/advert.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Advert1Image from "@/public/assets/auth1Image.jpg";
import Advert2Image from "@/public/assets/auth2Image.jpg";
import Advert3Image from "@/public/assets/auth3Image.jpg";

export default function Advert() {
  const images = [Advert1Image, Advert2Image, Advert3Image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <div className={`${styles.advertComponent} skeleton `}>
      <Image
        className={styles.advertImage}
        src={images[currentImageIndex]}
        alt={`Advertisement ${currentImageIndex + 1}`}
        layout="fill"
        objectFit="cover"
        priority={true}
      />
      <div className={styles.bannerInfo}>
        <div className={styles.bannerHeadInfo}>
        <h1>Our app makes things easier </h1>
        <p>
          Get better experience with a better notification system with our app
        </p>
        </div>
      
        <button className={styles.buttonBanner}>Coming soon</button>
      </div>

    </div>
  );
}
