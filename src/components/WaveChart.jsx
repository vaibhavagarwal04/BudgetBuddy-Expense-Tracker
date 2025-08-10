import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Expense from "../pages/Expense";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function WaveChart({ labels, dataPoints, type = "savings" }) {
  const primaryColor =
    type === "savings"
      ? "#2563EB"
      : type === "expense"
      ? "#EF4444"
      : type === "income"
      ? "#10B981"
      : "#2563EB";

  const backgroundFill =
    type === "savings"
      ? "rgba(37, 99, 235, 0.08)"
      : type === "expense"
      ? "rgba(239, 68, 68, 0.1)"
      : type === "income"
      ? "rgba(16, 185, 129, 0.1)"
      : "rgba(37, 99, 235, 0.08)";

  const data = {
    labels,
    datasets: [
      {
        label: type === "savings" ? "Monthly Savings" : "Line Chart",
        data: dataPoints,
        fill: true,
        borderColor: primaryColor,
        backgroundColor: backgroundFill,
        tension: 0.4,
        pointBackgroundColor: primaryColor,
        pointBorderColor: "#fff",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#374151",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#E5E7EB",
        bodyColor: "#F3F4F6",
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6B7280",
          font: { size: 11 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6B7280",
          font: { size: 11 },
          callback: (value) => `₹${value}`,
        },
        grid: {
          color: "#E5E7EB",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div style={{ height: "220px", width: "100%" }}>
      <Line options={options} data={data} />
    </div>
  );
}


export default WaveChart;
