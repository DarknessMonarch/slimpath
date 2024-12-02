import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      isAllowed: true,

      toggleAllow: () => {
        set({
          isOpen: !get().isOpen, 
        });
      },
    }),
    {
      name: "notification-storage",
      getStorage: () => localStorage,
    }
  )
);
