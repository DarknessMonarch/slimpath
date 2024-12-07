"use client";

import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeightProgressChart = ({ data }) => {

  const chartData = {
    labels: data.tracking.chartData.calorieDistribution.labels,
    datasets: [
      {
        label: "Actual Weight",
        data: data.tracking.chartData.weightProgress.map(point => point.weight),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: "Predicted Weight",
        data: data.tracking.chartData.progressTrend.map(point => point.predicted),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        borderDash: [5, 5]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weight Progress Over Time'
      }
    },
    scales: {
      y: {
        min: Math.min(data.tracking.currentWeight, data.tracking.goalWeight) - 5,
        max: Math.max(data.tracking.currentWeight, data.tracking.goalWeight) + 5
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default (WeightProgressChart);
