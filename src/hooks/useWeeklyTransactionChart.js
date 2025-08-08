
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import supabase from "../../supabase-client";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const useWeeklyTransactionChart = (userId) => {
  const [chartData, setChartData] = useState({
    labels: daysOfWeek,
    datasets: [
      { label: "Income", data: Array(7).fill(0), backgroundColor: "#ffffff" },
      { label: "Expense", data: Array(7).fill(0), backgroundColor: "#000000" },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      const [{ data: incomes }, { data: expenses }] = await Promise.all([
        supabase.from("Income").select("amount, created_at").eq("user_id", userId),
        supabase.from("Expense").select("amount, created_at").eq("user_id", userId),
      ]);

      const incomeData = Array(7).fill(0);
      const expenseData = Array(7).fill(0);

      incomes.forEach(({ amount, created_at }) => {
        const day = dayjs(created_at).day(); // 0 (Sunday) - 6 (Saturday)
        incomeData[day] += amount;
      });

      expenses.forEach(({ amount, created_at }) => {
        const day = dayjs(created_at).day();
        expenseData[day] += amount;
      });

      setChartData({
        labels: daysOfWeek,
        datasets: [
          { label: "Income", data: incomeData, backgroundColor: "#ffffff" },
          { label: "Expense", data: expenseData, backgroundColor: "#000000" },
        ],
      });
    };

    fetchData();
  }, [userId]);

  return chartData;
};

export default useWeeklyTransactionChart;
