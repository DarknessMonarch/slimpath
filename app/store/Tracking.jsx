import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useTrackingStore = create(
  persist(
    (set, get) => ({
      currentTracking: null,
      trackingHistory: [],
      isLoading: false,
      error: null,

      setTracking: (trackingData) => {
        set({
          currentTracking: trackingData,
          error: null,
        });
      },

      setTrackingHistory: (history) => {
        set({
          trackingHistory: history,
          error: null,
        });
      },

      clearTracking: () => {
        set({
          currentTracking: null,
          trackingHistory: [],
          error: null,
        });
      },

      initializeTracking: async (trackingData) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/calories/initialize`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(trackingData),
          });

          const data = await response.json();

          if (response.ok) {
            set({
              currentTracking: {
                ...data.tracking,
                progressPercentage: data.tracking.progressPercentage || 0,
              },
              isLoading: false,
            });
            return { success: true, tracking: data.tracking };
          }

          set({
            error: data.error || "Failed to initialize tracking",
            isLoading: false,
          });
          return {
            success: false,
            message: data.error || "Failed to initialize tracking",
          };
        } catch (error) {
          console.error("Tracking initialization error:", error);
          set({
            error: "An error occurred during tracking initialization",
            isLoading: false,
          });
          return {
            success: false,
            message: "An error occurred during tracking initialization",
          };
        }
      },

      updateTracking: async (updateData) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/calories/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData),
          });

          const data = await response.json();

          if (response.ok) {
            set({
              currentTracking: {
                ...data.tracking,
                progressPercentage: data.tracking.progressPercentage || 0,
              },
              isLoading: false,
            });
            return { success: true, tracking: data.tracking };
          }

          set({
            error: data.error || "Failed to update tracking",
            isLoading: false,
          });
          return {
            success: false,
            message: data.error || "Failed to update tracking",
          };
        } catch (error) {
          console.error("Tracking update error:", error);
          set({
            error: "An error occurred during tracking update",
            isLoading: false,
          });
          return {
            success: false,
            message: "An error occurred during tracking update",
          };
        }
      },

      calculateProgressPercentage: (currentWeight, goalWeight, latestWeight) => {
        if (currentWeight && goalWeight && latestWeight) {
          const totalWeightDifference = Math.abs(currentWeight - goalWeight);
          const progressMade = Math.abs(currentWeight - latestWeight);
          return Math.min((progressMade / totalWeightDifference) * 100, 100);
        }
        return 0;
      },
    }),
    {
      name: "tracking-storage",
      getStorage: () => localStorage,
    }
  )
);
