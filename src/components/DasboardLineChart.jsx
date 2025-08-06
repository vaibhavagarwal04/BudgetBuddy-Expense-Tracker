import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const DashboardLineChart = ({ data }) => {
  const labels = data.map((item) => item.date);
  const values = data.map((item) => item.amount);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Savings",
        data: values,
        fill: false,
        borderColor: "#4B5563",
        tension: 0.4,
        pointBackgroundColor: "#4B5563",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default DashboardLineChart;
