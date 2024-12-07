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

      fetchAllData: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/calories/all/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            const error = data.error || "Failed to fetch tracking data";
            set({ error, isLoading: false });
            return { success: false, message: error };
          }

          const tracking = data.tracking;
          if (!tracking) {
            set({ isLoading: false });
            return { success: false, message: "No tracking data found" };
          }

          // Process chart data if it exists
          if (tracking.weeklyProgress) {
            const chartData = {
              labels: tracking.weeklyProgress.map((_, index) => `Week ${index + 1}`),
              actual: tracking.weeklyProgress.map(week => week.currentWeight),
              target: Array(tracking.durationWeeks).fill(null).map((_, index) => {
                const weeklyWeightLoss = 
                  (tracking.currentWeight - tracking.goalWeight) / tracking.durationWeeks;
                return Number((tracking.currentWeight - (weeklyWeightLoss * (index + 1))).toFixed(1));
              }),
            };

            tracking.chartData = chartData;
          }

          // Calculate progress percentage
          const latestWeight = tracking.weeklyProgress?.[tracking.weeklyProgress.length - 1]?.currentWeight;
          const progressPercentage = get().calculateProgressPercentage(
            tracking.currentWeight,
            tracking.goalWeight,
            latestWeight || tracking.currentWeight
          );

          const processedTracking = {
            ...tracking,
            progressPercentage,
          };

          set({
            currentTracking: processedTracking,
            isLoading: false,
            error: null
          });
          
          return { success: true, data: processedTracking };
        } catch (error) {
          console.error("All data fetch error:", error);
          set({
            error: "An error occurred while fetching tracking data",
            isLoading: false,
          });
          return {
            success: false,
            message: "An error occurred while fetching tracking data"
          };
        }
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

          if (!response.ok) {
            const error = data.error || "Failed to initialize tracking";
            set({ error, isLoading: false });
            return { success: false, message: error };
          }

          const tracking = {
            ...data.tracking,
            progressPercentage: data.tracking.progressPercentage || 0,
          };

          set({
            currentTracking: tracking,
            isLoading: false,
          });

          return { success: true, tracking };
        } catch (error) {
          console.error("Tracking initialization error:", error);
          set({
            error: "An error occurred during tracking initialization",
            isLoading: false,
          });
          return {
            success: false,
            message: "An error occurred during tracking initialization"
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

          if (!response.ok) {
            const error = data.error || "Failed to update tracking";
            set({ error, isLoading: false });
            return { success: false, message: error };
          }

          const tracking = {
            ...data.tracking,
            progressPercentage: data.tracking.progressPercentage || 0,
          };

          set({
            currentTracking: tracking,
            isLoading: false,
          });

          return { success: true, tracking };
        } catch (error) {
          console.error("Tracking update error:", error);
          set({
            error: "An error occurred during tracking update",
            isLoading: false,
          });
          return {
            success: false,
            message: "An error occurred during tracking update"
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