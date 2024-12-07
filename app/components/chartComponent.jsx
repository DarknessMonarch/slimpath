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

  if (!data?.actual || !data?.target || !data?.labels) {
    return null;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Actual Weight",
        data: data.actual,
        borderColor: 'rgb(147, 112, 219)',
        backgroundColor: 'rgba(147, 112, 219, 0.5)',
        tension: 0.1,
        fill: false
      },
      {
        label: "Target Weight",
        data: data.target,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderDash: [5, 5],
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
        // Set min/max with some padding
        min: Math.min(...data.actual, ...data.target) - 2,
        max: Math.max(...data.actual, ...data.target) + 2
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