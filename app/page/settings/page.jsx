"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import { useState, useEffect, useRef } from "react";
import Profile from "@/public/assets/auth1Image.jpg";
import styles from "@/app/styles/settings.module.css";
// import { getUserDetails } from "@/app/hooks/userDetails";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
  MdModeEdit as EditIcon,
} from "react-icons/md";

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState(Profile);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);

  const {
    isAuth,
    username,
    email,
    profile,
    userType,
    setUser,
    clearUser,
    accessToken,
    authorized,
  } = useAuthStore();
  const [formData, setFormData] = useState({
    username: username,
    email: email,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    verificationCode: "",
  });

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  // useEffect(() => {
  //   if (!isAuth) {
  //     redirect("/page/home");
  //   }
  // }, [isAuth]);

  const fileInputRef = useRef(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)"
      );
    }
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (codeSent && formData.verificationCode.length !== 5) {
      newErrors.verificationCode = "Verification code must be 5 digits";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (formData.newPassword) {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors;
      }
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB size limit
        toast.error("Please upload an image smaller than 5MB.");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      const formData = new FormData();
      formData.append("profile_pic", file);

      try {
        const response = await fetch(`${SERVER_API}/users/update/profilepic`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 201) {
          toast.success("Profile pic updated successfully");

          const data = await response.json().catch(() => null);
          if (data && data.profile_pic) {
            setUser({ profile: data.profile_pic });
          }
          // await getUserDetails();
        } else if (response.status === 413) {
          toast.error(
            "File is too large. Please upload an image smaller than 5MB."
          );
        } else {
          throw new Error("Unexpected response format. Please try again.");
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast.error(error.message || "Failed to update profile picture");
      }
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/users/update/details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      toast.success("Profile updated successfully");
      // await getUserDetails();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/users/update/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast.success("Password updated successfully");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      // await getUserDetails();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SERVER_API}/users/phone/update/${formData.email}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }

      toast.success("Verification code sent successfully");
      setCodeSent(true);
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast.error("Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {};

  return (
    <div className={styles.formSettingContainer}>
      <div className={styles.formSettingContainerInner}>
        <div className={styles.settingWrap}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div className={styles.profileSection}>
            <div className={styles.profileImageContain}>
              <Image
                src={profile === null ? profileImage : Profile}
                alt={username}
                className={styles.profileImage}
                width={100}
                height={100}
              />
              <div className={styles.uploadEditIcon} onClick={handleIconClick}>
                <EditIcon
                  className={styles.editIcon}
                  alt="Edit Icon"
                  width={30}
                  height={30}
                />
              </div>
            </div>
            <div className={styles.profileDetails}>
              <h1>{username}</h1>
              <div className={styles.profileGlass}>
                <h3>{email}</h3>
              </div>
              <div
                onClick={handleDeleteAccount("id")}
                className={styles.deleteAccount}
              >
                <DeleteIcon
                  className={styles.deleteIcon}
                  alt="Delete Icon"
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.settingWrapinfo}>
          <form onSubmit={updateProfile} className={styles.settingWrapS}>
            <div className={styles.settingInputContainer}>
              <label htmlFor="username" className={styles.settingLabel}>
                Username
              </label>
              <div className={styles.settingInput}>
                <UserNameIcon
                  className={styles.settingIcon}
                  alt="Username icon"
                  width={20}
                  height={20}
                />
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="penguin"
                />
              </div>
              {errors.username && (
                <p className={styles.errorText}>{errors.username}</p>
              )}
            </div>

            <div className={styles.settingInputContainer}>
              <label htmlFor="email" className={styles.settingLabel}>
                Email
              </label>
              <div className={styles.settingInput}>
                <EmailIcon
                  className={styles.settingIcon}
                  alt="email icon"
                  width={20}
                  height={20}
                />
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="penguin@gmail.com"
                />
              </div>
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.formsettingButton}
            >
              {isLoading ? <Loader /> : "Update Profile"}
            </button>
          </form>

          <form onSubmit={updatePassword} className={styles.settingWrapS}>
            <div className={styles.settingInputContainer}>
              <label htmlFor="oldPassword" className={styles.settingLabel}>
                Old Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="Old Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.settingInputContainer}>
              <label htmlFor="newPassword" className={styles.settingLabel}>
                New Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="New Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
              {errors.newPassword && Array.isArray(errors.newPassword) && (
                <ul className={styles.errorList}>
                  {errors.newPassword.map((error, index) => (
                    <li key={index} className={styles.errorText}>
                      {error}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.settingInputContainer}>
              <label
                htmlFor="confirmNewPassword"
                className={styles.settingLabel}
              >
                Confirm New Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className={styles.errorText}>{errors.confirmNewPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.formsettingButton}
            >
              {isLoading ? <Loader /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
