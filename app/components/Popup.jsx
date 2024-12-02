import styles from "@/app/styles/popup.module.css";
import { useSocialStore } from "@/app/store/Social";
import { IoIosCloseCircle as ExitIcon } from "react-icons/io";

export default function PopupComponent({  
  content,
}) {
  const { isOpen, toggleIsOpen } = useSocialStore();

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.popupBackdrop}>
    <div className={styles.popupContainer}>
      <div className={styles.popupHeader}>
        <div className={styles.popupExit}>
          <ExitIcon
            className={styles.popupIcon}
            alt="Exit icon"
            onClick={toggleIsOpen}
            width={30}
            height={30}
          />
        </div>
      </div>
      {content}
    </div>
    </div>

  );
}
