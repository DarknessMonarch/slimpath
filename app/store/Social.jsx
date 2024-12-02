import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSocialStore = create(
  persist(
    (set, get) => ({
      isOpen: true,

      toggleIsOpen: () => {
        set({
          isOpen: !get().isOpen, 
        });
      },
    }),
    {
      name: "social-link",
      getStorage: () => localStorage,
    }
  )
);
