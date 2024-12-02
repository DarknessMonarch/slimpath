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
  const actualData = data?.actual || [];
  const targetData = data?.target || [];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Actual Weight",
        data: actualData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.4,
      },
      {
        label: "Target Weight",
        data: targetData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weight Progress Over Time",
      },
    },
    scales: {
      y: {
        min: Math.min(...actualData, ...targetData) - 1,
        max: Math.max(...actualData, ...targetData) + 1,
        title: {
          display: true,
          text: "Weight (kg)",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default (WeightProgressChart);
