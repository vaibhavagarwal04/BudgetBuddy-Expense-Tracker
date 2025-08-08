import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import dayjs from "dayjs";

function useMonthlySavings(userId) {
  const [labels, setLabels] = useState([]);
  const [monthlySavings, setMonthlySavings] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const { data: incomeData } = await supabase
        .from("Income")
        .select("*")
        .eq("user_id", userId);

      const { data: expenseData } = await supabase
        .from("Expense")
        .select("*")
        .eq("user_id", userId);

      const savingsMap = {};

      for (let i = 0; i < 6; i++) {
        const month = dayjs().subtract(i, "month").format("MMM YYYY");
        savingsMap[month] = { income: 0, expense: 0 };
      }

      incomeData?.forEach((entry) => {
        const month = dayjs(entry.date).format("MMM YYYY");
        if (savingsMap[month]) {
          savingsMap[month].income += Number(entry.amount);
        }
      });

      expenseData?.forEach((entry) => {
        const month = dayjs(entry.date).format("MMM YYYY");
        if (savingsMap[month]) {
          savingsMap[month].expense += Number(entry.amount);
        }
      });

      const sortedMonths = Object.keys(savingsMap).reverse();

      const monthlyLabels = sortedMonths;
      const savings = sortedMonths.map(
        (month) => savingsMap[month].income - savingsMap[month].expense
      );

      setLabels(monthlyLabels);
      setMonthlySavings(savings);
    };

    fetchData();
  }, [userId]);

  return { labels, monthlySavings };
}

export default useMonthlySavings;
