import Image from "next/image";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/Auth";
import { FaLink as LinkIcon } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import styles from "@/app/styles/socialLink.module.css";
import { IoShareSocialSharp as ShareIcon } from "react-icons/io5";

import Instagram from "@/public/icons/instagram.svg";
import Whatsapp from "@/public/icons/whatsapp.svg";
import LinkedIn from "@/public/icons/linkedIn.svg";
import Telegram from "@/public/icons/telegram.svg";
import Twitter from "@/public/icons/twitter.svg";
import Youtube from "@/public/icons/youtube.svg";

export default function Referral() {
  const { referralCode } = useAuthStore();
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const websiteUrl = "https://slimpath.vercel.app";

  const generateShareLink = useCallback(() => {
    const link = `${websiteUrl}/authenticate/signup?referral=${referralCode}`;
    setShareLink(link);
  }, [referralCode]);

  useEffect(() => {
    generateShareLink();
  }, [generateShareLink]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  const openSocialLink = (baseUrl) => {
    window.open(`${baseUrl}${encodeURIComponent(shareLink)}`, "_blank");
  };

  const socialData = [
    {
      name: "Twitter",
      icons: Twitter,
      link: "https://twitter.com/intent/tweet?url=",
    },
    {
      name: "Youtube",
      icons: Youtube,
      link: "https://www.youtube.com/share?url=",
    },
    { name: "Telegram", icons: Telegram, link: "https://t.me/share/url?url=" },
    {
      name: "LinkedIn",
      icons: LinkedIn,
      link: "https://www.linkedin.com/sharing/share-offsite/?url=",
    },
    {
      name: "Whatsapp",
      icons: Whatsapp,
      link: "https://api.whatsapp.com/send?text=",
    },
    {
      name: "Instagram",
      icons: Instagram,
      link: "https://www.instagram.com/share?url=",
    },
  ];

  return (
    <div className={styles.popupContent}>
      <div className={styles.popupContentInner}>
        <div className={styles.popupHeader}>
          <h1>Social share</h1>
          <p>
            Share this link to two people to get access to Slimpath for life
          </p>
        </div>
        <div className={styles.socialContainer}>
          {socialData.map((data, index) => (
            <div
              className={styles.socialIconWrap}
              key={index}
              onClick={() => openSocialLink(data.link)}
            >
              <Image
                className={styles.socialIcon}
                src={data.icons}
                alt={data.name}
                height={30}
                priority={true}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.copyInner}>
        <h1>Copy link</h1>
        <div className={styles.copyField}>
          <LinkIcon
            className={styles.linkIcon}
            alt="link icon"
            width={24}
            height={24}
          />
          <p>{shareLink}</p>
        </div>
        <button className={styles.formPromoteBtn} onClick={copyLink}>
          {isCopied ? (
            "Copied!"
          ) : (
            <ShareIcon
              className={styles.shareIcon}
              alt="share icon"
              width={24}
              height={24}
            />
          )}
        </button>
      </div>
    </div>
  );
}
