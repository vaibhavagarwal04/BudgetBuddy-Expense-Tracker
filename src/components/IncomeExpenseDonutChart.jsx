import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function IncomeExpenseDonutChart({ income, expense }) {
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#4ade80", "#f87171"],
        hoverBackgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`
        }
      }
    },
    cutout: "70%"
  };

  return (
    <div style={{ width: "100%", maxWidth: 300, margin: "0 auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
