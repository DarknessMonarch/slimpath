"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import ProfileImg from "@/public/assets/banner.png";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/app/store/Auth";

// Icons
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
import { useRouter } from "next/navigation";

import Loader from "@/app/components/Loader";
import styles from "@/app/styles/settings.module.css";

export default function SettingsPage() {
  const { isAuth, clearUser } = useAuthStore();

  const router = useRouter();

  const {
    username,
    email,
    profileImage,
    updateUsernameOrEmail,
    updatePassword: storeUpdatePassword,
    updateProfileImage: storeUpdateProfileImage,
    deleteAccount,
  } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: username,
    email: email,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if (!isAuth) {
      redirect("home");
    }
  }, [isAuth]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Please upload an image smaller than 5MB.");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;

        setIsLoading(true);
        try {
          const response = await storeUpdateProfileImage(base64Image);

          // Check for specific error types
          if (response.status === "error") {
            if (response.details?.includes("api_key")) {
              toast.error(
                "Server configuration error. Please contact support."
              );
            } else {
              toast.error(response.message || "Failed to update profile image");
            }
            return;
          }

          if (response.success) {
            toast.success("Profile image updated successfully");
          } else {
            toast.error("Failed to update profile image");
          }
        } catch (error) {
          console.error("Profile image update error:", error);
          toast.error("An error occurred while updating profile image");
        } finally {
          setIsLoading(false);
        }
      };
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const result = await updateUsernameOrEmail({
        newUsername: formData.username,
        newEmail: formData.email,
      });

      if (result.success) {
        toast.success(result.message);
        await clearUser();
        router.push("/authentication/login", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const result = await storeUpdatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        toast.success(result.message);
        setFormData((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));
        await clearUser();
        router.push("/authentication/login", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      setIsLoading(true);
      try {
        const response = await deleteAccount();
        if (response.success) {
          toast.success(response.message);
          router.push("/authentication/signup", { scroll: false });
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };
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
                src={profileImage || ProfileImg}
                alt={username}
                className={styles.profileImage}
                width={100}
                height={100}
              />
              <div
                className={styles.uploadEditIcon}
                onClick={() => fileInputRef.current?.click()}
              >
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
                onClick={handleDeleteAccount}
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
                  placeholder="Username"
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
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}
              <p className={styles.errorText}>
                After updating your email, you will be logged out
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.formsettingButton}
            >
              {isLoading ? <Loader /> : "Update Profile"}
            </button>
          </form>

          <form onSubmit={handleUpdatePassword} className={styles.settingWrapS}>
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
            <p className={styles.errorText}>
              After updating your password, you will be logged out
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
