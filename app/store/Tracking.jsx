import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useTrackingStore = create(
  persist(
    (set, get) => ({
      currentTracking: null,
      isLoading: false,
      error: null,

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

          if (response.ok) {
            const tracking = data.tracking;

            const chartData = {
              labels: tracking.chartData.progressTrend.map(
                (week) => `Week ${week.week}`
              ),
              actual: tracking.chartData.progressTrend.map(
                (week) => week.actual
              ),
              target: tracking.chartData.progressTrend.map(
                (week) => week.predicted
              ),
            };

            const weeklyProgress = {
              startingWeight: tracking.currentWeight,
              weeklyGoal:
                (tracking.goalWeight - tracking.currentWeight) /
                tracking.durationWeeks,
              currentWeight:
                tracking.weeklyProgress[tracking.weeklyProgress.length - 1]
                  ?.currentWeight || tracking.currentWeight,
              actualLoss:
                tracking.currentWeight -
                (tracking.weeklyProgress[tracking.weeklyProgress.length - 1]
                  ?.currentWeight || tracking.currentWeight),
            };

            set({
              currentTracking: {
                ...tracking,
                processedChartData: chartData,
                weeklyProgress,
                progressTrend: tracking.progressPatterns,
                chartData: chartData,
              },
              isLoading: false,
            });
            return { success: true, data };
          }

          set({
            error: data.error || "Failed to fetch tracking data",
            isLoading: false,
          });
          return {
            success: false,
            message: data.error || "Failed to fetch tracking data",
          };
        } catch (error) {
          console.error("All data fetch error:", error);
          set({
            error: "An error occurred while fetching tracking data",
            isLoading: false,
          });
          return {
            success: false,
            message: "An error occurred while fetching tracking data",
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

          if (response.ok) {
            await get().fetchAllData(trackingData.userId);
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
            await get().fetchAllData(updateData.userId);
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

      clearTracking: () => {
        set({
          currentTracking: null,
          error: null,
        });
      },

      getCurrentWeight: () => get().currentTracking?.currentWeight || 0,
      getGoalWeight: () => get().currentTracking?.goalWeight || 0,
      getProgressTrend: () => get().currentTracking?.progressTrend || {},
      getChartData: () => get().currentTracking?.chartData || {},
      getWeeklyProgress: () => get().currentTracking?.weeklyProgress || {},
    }),
    {
      name: "tracking-storage",
      getStorage: () => localStorage,
    }
  )
);
