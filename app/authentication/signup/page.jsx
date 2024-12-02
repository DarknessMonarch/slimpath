"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Loader from "@/app/components/loader";
import LogoImg from "@/public/assets/logo.png";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import auth2Image from "@/public/assets/auth2Image.jpg";
import auth3Image from "@/public/assets/auth3Image.jpg";
import auth4Image from "@/public/assets/auth4Image.jpg";
import { useRouter, useSearchParams } from "next/navigation";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import { MdOutlineVpnKey as PasswordIcon, MdOutlineEmail as EmailIcon } from "react-icons/md";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [referral, setReferral] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const images = [auth1Image, auth2Image, auth3Image, auth4Image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle referral from query params
  useEffect(() => {
    const referralParam = searchParams.get("referral");
    if (referralParam) {
      setReferral(referralParam);
    }
  }, [searchParams]);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    if (!/(?=.*[a-z])/.test(password)) errors.push("Password must contain at least one lowercase letter");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("Password must contain at least one uppercase letter");
    if (!/(?=.*\d)/.test(password)) errors.push("Password must contain at least one number");
    if (!/(?=.*[!@#$%^&*])/.test(password))
      errors.push("Password must contain at least one special character (!@#$%^&*)");
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) newErrors.password = passwordErrors;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;

      // Add referral if available
      if (referral) {
        dataToSend.referredBy = referral;
      }

      const response = await fetch(`${SERVER_API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Sign up failed");

      toast.success("Sign up successful! Please check your email for verification.");
      router.push("/home");
    } catch (error) {
      toast.error(error.message || "Sign up failed");
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
          <div className={styles.formLogo}>
            <Image className={styles.logo} src={LogoImg} alt="Logo" width={50} priority />
          </div>
          <h1>Sign up</h1>
          <p>Enter your account details</p>

          {/* Username */}
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
          {errors.username && <p className={styles.errorText}>{errors.username}</p>}

          {/* Email */}
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
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}

          {/* Password */}
          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
            <button type="button" onClick={() => togglePasswordVisibility("password")}>
              {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
            </button>
          </div>
          {errors.password &&
            Array.isArray(errors.password) &&
            errors.password.map((error, index) => (
              <p key={index} className={styles.errorText}>
                {error}
              </p>
            ))}

          {/* Confirm Password */}
          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
            />
            <button type="button" onClick={() => togglePasswordVisibility("confirmPassword")}>
              {showConfirmPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
            </button>
          </div>
          {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}

          <button type="submit" className={styles.authButton} disabled={isLoading}>
            {isLoading ? <Loader /> : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
