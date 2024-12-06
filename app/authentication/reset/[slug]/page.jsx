"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import auth2Image from "@/public/assets/auth2Image.jpg";
import auth3Image from "@/public/assets/auth3Image.jpg";
import auth4Image from "@/public/assets/auth4Image.jpg";

import {
  FaRegEye as ShowPasswordIcon,
  FaRegEyeSlash as HidePasswordIcon,
} from "react-icons/fa";
import { MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Reset({ params }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const images = [auth1Image, auth2Image, auth3Image, auth4Image];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");

    setIsLoading(true);
    try {
      const result = await resetPassword(params.slug, password);

      if (result.success) {
        toast.success(result.message || "Password reset successful");
        router.push("/authentication/login", { scroll: false });
      } else {
        toast.error(result.message || "Password reset failed");
      }
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authComponent}>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.authImage}
          src={images[currentImageIndex]}
          alt="auth image"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority
        />
        <div className={styles.slideController}>
          <div onClick={nextImage} className={styles.slideBtn}>
            Next
          </div>
          <div className={styles.imageSlider}>
            {images.map((_, index) => (
              <div
                key={index}
                className={`${styles.circleAdv} ${
                  currentImageIndex === index ? styles.activeCircle : ""
                }`}
              ></div>
            ))}
          </div>
          <div onClick={prevImage} className={styles.slideBtn}>
            Previous
          </div>
        </div>
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formLogo}>
            <Image
              className={styles.logo}
              src={LogoImg}
              alt="logo"
              width={50}
              priority
            />
          </div>
          <div className={styles.formHeader}>
            <h1>Reset Password</h1>
            <p>Enter your new Password</p>
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <ShowPasswordIcon className={styles.authIcon} />
              ) : (
                <HidePasswordIcon className={styles.authIcon} />
              )}
            </button>
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <ShowPasswordIcon className={styles.authIcon} />
              ) : (
                <HidePasswordIcon className={styles.authIcon} />
              )}
            </button>
          </div>
          {passwordError && <p className={styles.errorText}>{passwordError}</p>}

          <div className={styles.authBottomBtn}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Reset Password"}
            </button>
          </div>
          <h3>
            Already have an account?{" "}
            <div
              className={styles.btnLogin}
              onClick={() =>
                router.push("/authentication/login", { scroll: false })
              }
            >
              Login
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}
