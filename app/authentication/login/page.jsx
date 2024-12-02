"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { FaRegUser as usernameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
} from "react-icons/md";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, toggleAuth } = useAuthStore();
  const [terms, setTerms] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTermsChange = (event) => {
    setTerms(event.target.checked);
    setErrors((prev) => ({ ...prev, terms: "" }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "username ";
    if (!terms) newErrors.terms = "You must accept the terms and conditions";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const responseData = await response.json();
      const { token, refreshToken, user } = responseData.data;

      // Save user and token to state
      setUser({ ...user, token, refreshToken });
      toggleAuth();

      toast.success("Welcome back!");
      router.push("/page/home", { scroll: false });
    } catch (error) {
      toast.error(error.message || "Login failed, please try again");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authComponent}>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.authImage}
          src={auth1Image}
          alt="auth image"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority={true}
        />
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.formLogo}>
            <Image
              className={styles.logo}
              src={LogoImg}
              alt="logo"
              width={50}
              priority={true}
            />
          </div>
          <div className={styles.formHeader}>
            <h1>Login</h1>
            <p>Enter your account details</p>
          </div>
          {/* username/Email */}
          <div className={styles.authInput}>
            <usernameIcon className={styles.authIcon} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="username"
            />
          </div>
          {errors.username && (
            <p className={styles.errorText}>{errors.username}</p>
          )}

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
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}

          {/* Terms */}
          <div className={styles.formChange}>
            <div className={styles.termsContainer}>
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={handleTermsChange}
              />
              <label htmlFor="terms">
                Accept terms and conditions
              </label>
            </div>
            {errors.terms && <p className={styles.errorText}>{errors.terms}</p>}
            <span onClick={() => router.push("/resetcode")}>
              Forgot Password
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.formAuthButton} ${
              isLoading ? styles.activeFormAuthButton : ""
            }`}
          >
            {isLoading ? <Loader /> : "Login"}
          </button>
          <h3>
            Don&apos;t have an account?{" "}
            <span
              className={styles.btnLogin}
              onClick={() => router.push("signup")}
            >
              Sign up
            </span>
          </h3>
        </form>
      </div>
    </div>
  );
}
