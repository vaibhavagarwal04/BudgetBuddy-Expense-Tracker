import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

function DashboardPieChart({ label1, value1, label2, value2 }) {
    const data = {
        labels: [label1, label2],
        datasets: [
            {
                data: [value1, value2],
                backgroundColor: ["#000000", "#ffffff"],
                borderColor: "#cccccc",
                borderWidth: 1,
                cutout: "60%", // Doughnut hole size
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="w-full h-full">
            <Doughnut data={data} options={options} />
        </div>
    );
}

export default DashboardPieChart;
