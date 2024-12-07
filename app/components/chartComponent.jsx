"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightProgressChart = ({ data }) => {
  // Add console.log to debug the incoming data
  console.log("Chart Data:", data);

  // Early return if no data
  if (!data || !data.weightProgress) {
    console.log("No weight progress data available");
    return null;
  }

  // Format dates for x-axis
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get dates and weights
  const dates = data.weightProgress.map(point => formatDate(point.date));
  const weights = data.weightProgress.map(point => point.weight);

  // Create the chart data
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Actual Weight",
        data: weights,
        borderColor: 'rgb(147, 112, 219)',
        backgroundColor: 'rgba(147, 112, 219, 0.5)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#666'
        }
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} lbs`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#666'
        },
        min: Math.min(...weights) - 2,
        max: Math.max(...weights) + 2
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div style={{ height: '300px', width: '100%', padding: '20px 0' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeightProgressChart;