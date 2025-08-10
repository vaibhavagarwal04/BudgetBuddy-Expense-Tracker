import React, { useEffect, useState, useMemo } from "react";
import { IndianRupee } from "lucide-react";
import supabase from "../../supabase-client";
import WaveChart from "../components/WaveChart";
import WeeklyTransactionChart from "../components/WeeklyTransactionChart";
import useWeeklyTransactionChart from "../hooks/useWeeklyTransactionChart";
import useMonthlySavings from "../hooks/useMonthlySavings";
import dayjs from "dayjs";
import RecentTransactions from "../components/RecentTransactions";
import IncomeExpenseDonutChart from "../components/IncomeExpenseDonutChart";

function Dashboard() {
    const [userId, setUserId] = useState(null);
    const [income, setIncome] = useState([]);
    const [expense, setExpense] = useState([]);
    const [filter, setFilter] = useState("month");

    const weeklyChartData = useWeeklyTransactionChart(userId);
    const { labels: monthlyLabels, monthlySavings } = useMonthlySavings(userId);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        getUser();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            const now = dayjs();
            let fromDate = null;
            if (filter === "month") fromDate = now.startOf("month");
            else if (filter === "3months")
                fromDate = now.subtract(3, "month").startOf("month");

            const applyDateFilter = (query) =>
                filter === "all"
                    ? query
                    : query.gte("created_at", fromDate.toISOString());

            const incomeQuery = applyDateFilter(
                supabase.from("Income").select("*").eq("user_id", userId)
            );
            const expenseQuery = applyDateFilter(
                supabase.from("Expense").select("*").eq("user_id", userId)
            );

            const [incomeResult, expenseResult] = await Promise.all([
                incomeQuery,
                expenseQuery,
            ]);

            setIncome(incomeResult.data || []);
            setExpense(expenseResult.data || []);
        };

        fetchData();
    }, [userId, filter]);

    const { totalIncome, totalExpense, savings, recentTransactions } =
        useMemo(() => {
            const totalIncomeCalc = income.reduce(
                (acc, curr) => acc + curr.amount,
                0
            );
            const totalExpenseCalc = expense.reduce(
                (acc, curr) => acc + curr.amount,
                0
            );
            const savingsCalc = totalIncomeCalc - totalExpenseCalc;

            const allTransactions = [
                ...income.map((i) => ({ ...i, type: "income" })),
                ...expense.map((e) => ({ ...e, type: "expense" })),
            ];

            const sortedRecent = allTransactions
                .sort(
                    (a, b) =>
                        new Date(b.date || b.created_at) -
                        new Date(a.date || a.created_at)
                )
                .slice(0, 10);

            return {
                totalIncome: totalIncomeCalc,
                totalExpense: totalExpenseCalc,
                savings: savingsCalc,
                recentTransactions: sortedRecent,
            };
        }, [income, expense]);

    const statCards = [
        {
            title: "Total Income",
            amount: totalIncome,
            bg: "bg-gradient-to-br from-teal-700 via-teal-500 to-teal-400 backdrop-blur-xl bg-opacity-80 shadow-lg shadow-teal-700/50 rounded-2xl border border-teal-300/60 hover:scale-[1.03] transition-transform duration-300 ease-out hover:shadow-teal-600/70",
            accent: "border-teal-300/80",
        },
        {
            title: "Total Expense",
            amount: totalExpense,
            bg: "bg-gradient-to-br from-orange-700 via-orange-500 to-orange-400 backdrop-blur-xl bg-opacity-80 shadow-lg shadow-orange-700/50 rounded-2xl border border-orange-300/60 hover:scale-[1.03] transition-transform duration-300 ease-out hover:shadow-orange-600/70",
            accent: "border-orange-300/80",
        },
        {
            title: "Total Savings",
            amount: savings,
            bg: "bg-gradient-to-br from-cyan-700 via-cyan-500 to-cyan-400 backdrop-blur-xl bg-opacity-80 shadow-lg shadow-cyan-700/50 rounded-2xl border border-cyan-300/60 hover:scale-[1.03] transition-transform duration-300 ease-out hover:shadow-cyan-600/70",
            accent: "border-cyan-300/80",
        },
    ];

    return (
        <div className="p-10 space-y-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {statCards.map(({ title, amount, bg, accent }) => (
                    <div
                        key={title}
                        className={`${bg} relative overflow-hidden rounded-3xl shadow-2xl border ${accent} p-7 transition-transform transform hover:scale-105`}
                        style={{
                            backgroundBlendMode: "overlay",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20"></div>
                        <div className="relative z-10">
                            <p className="text-lg font-serif tracking-wide text-yellow-300 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                                {title}
                            </p>
                            <p className="text-4xl font-bold flex items-center gap-1 mt-2 text-yellow-200 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
                                <IndianRupee size={26} />{" "}
                                {amount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 justify-center">
                {["month", "3months", "all"].map((val) => (
                    <button
                        key={val}
                        onClick={() => setFilter(val)}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium shadow-md transition-all ${
                            filter === val
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "bg-white border hover:bg-gray-100"
                        }`}
                    >
                        {val === "month"
                            ? "This Month"
                            : val === "3months"
                            ? "Last 3 Months"
                            : "All Time"}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-7 rounded-3xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-5">
                        📈 Monthly Savings Overview
                    </h2>
                    <WaveChart
                        labels={monthlyLabels}
                        dataPoints={monthlySavings}
                        type="savings"
                    />
                </div>

                <RecentTransactions transactions={recentTransactions} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-7 rounded-3xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">
                        💰 Income vs Expense
                    </h2>
                    <IncomeExpenseDonutChart
                        income={totalIncome}
                        expense={totalExpense}
                    />
                </div>

                <div className="bg-white p-7 rounded-3xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">
                        📊 Weekly Transactions
                    </h2>
                    {weeklyChartData?.datasets?.length > 0 ? (
                        <div className="h-80">
                            <WeeklyTransactionChart
                                chartData={weeklyChartData}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-48 text-gray-400 animate-pulse">
                            Loading weekly data...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
