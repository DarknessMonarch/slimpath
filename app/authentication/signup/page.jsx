"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import auth2Image from "@/public/assets/auth2Image.jpg";
import auth3Image from "@/public/assets/auth3Image.jpg";
import auth4Image from "@/public/assets/auth4Image.jpg";
import { useRouter, useSearchParams } from "next/navigation";

import {
  FaRegEye as ShowPasswordIcon,
  FaRegEyeSlash as HidePasswordIcon,
} from "react-icons/fa";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";

export default function SignUp() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [referral, setReferral] = useState(null);
  const [terms, setTerms] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const register = useAuthStore((state) => state.register);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const images = [auth1Image, auth2Image, auth3Image, auth4Image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const referralParam = searchParams.get("referral");
    if (referralParam) {
      setReferral(referralParam);
    }
  }, [searchParams]);

  const handleTermsChange = (event) => {
    setTerms(event.target.checked);
    setTermsError("");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword" || name === "password") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!terms) {
      setTermsError("You must accept the terms and conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      if (referral) {
        dataToSend.referredBy = referral;
      }

      const result = await register(dataToSend);

      if (result.success) {
        toast.success(result.message);
        router.push("/page/home", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
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
          alt="Auth Background"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority
        />
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <Image
            className={styles.logo}
            src={LogoImg}
            alt="Logo"
            width={100}
            priority
          />
          <div>
            <h1>Sign up</h1>
            <p>Enter your account details</p>
          </div>

          <div className={styles.authInput}>
            <UserNameIcon className={styles.authIcon} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
          </div>

          <div className={styles.authInput}>
            <EmailIcon className={styles.authIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
            <div onClick={() => togglePasswordVisibility("password")}>
              {showPassword ? (
                <HidePasswordIcon className={styles.authIcon} />
              ) : (
                <ShowPasswordIcon className={styles.authIcon} />
              )}
            </div>
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
            />
            <div onClick={() => togglePasswordVisibility("confirmPassword")}>
              {showConfirmPassword ? (
                <HidePasswordIcon className={styles.authIcon} />
              ) : (
                <ShowPasswordIcon className={styles.authIcon} />
              )}
            </div>
          </div>
          {passwordError && <p className={styles.errorText}>{passwordError}</p>}
          <div className={styles.formChange}>
            <div className={styles.termsContainer}>
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={handleTermsChange}
              />
              <label htmlFor="terms">Accept terms and conditions</label>
            </div>
            {termsError && <p className={styles.errorText}>{termsError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.formAuthButton} ${
              isLoading ? styles.activeFormAuthButton : ""
            }`}
          >
          {isLoading ? <Loader /> : "Sign up"}
          </button>
          <h3>
            Already have an account?{" "}
            <span
              className={styles.btnLogin}
              onClick={() => router.push("login")}
            >
              Login
            </span>
          </h3>
        </form>
      </div>
    </div>
  );
}
