export const initialData = {
  basicInfo: {
    currentWeight: 1000,
    goalWeight: 100,
  },
  caloriesSummary: {
    total: 240500,
    distribution: {
      morning: 72150,
      afternoon: 96200,
      night: 72150
    }
  },
  meals: [
    {
      id: 1,
      name: "Breakfast",
      calories: 80167
    },
    {
      id: 2,
      name: "Lunch",
      calories: 80167
    },
    {
      id: 3,
      name: "Dinner",
      calories: 80167
    }
  ],
  progress: {
    weekly: {
      startingWeight: 71.0,
      currentWeight: 69.5,
      weeklyGoal: -0.5,
      actualLoss: -0.7
    },
    patterns: {
      bestDays: ["Tuesday", "Thursday"],
      sleepCorrelation: "Better progress with 7+ hours sleep",
      mealTiming: "Most successful with early dinner"
    }
  }, 
  chartData: {
    weightProgress: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
      actual: [71.0, 70.5, 70.1, 69.8, 69.5, 69.2, 68.8, 68.5],
      target: [71.0, 70.5, 70.0, 69.5, 69.0, 68.5, 68.0, 67.5],
    },
  },
  recommendations: [
    "Maintain current meal schedule",
    "Consider increasing water intake",
    "Add light exercise on rest days"
  ]
};