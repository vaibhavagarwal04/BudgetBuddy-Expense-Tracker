import React, { useEffect, useState, useMemo } from "react";
import { IndianRupee, Receipt, TrendingUp, Wallet } from "lucide-react";
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
            icon: TrendingUp,
            accent: "border-emerald-500",
            iconStyle: "bg-emerald-50 text-emerald-700",
            labelStyle: "text-emerald-700",
        },
        {
            title: "Total Expense",
            amount: totalExpense,
            icon: Receipt,
            accent: "border-rose-500",
            iconStyle: "bg-rose-50 text-rose-700",
            labelStyle: "text-rose-700",
        },
        {
            title: "Total Savings",
            amount: savings,
            icon: Wallet,
            accent: savings < 0 ? "border-rose-500" : "border-sky-500",
            iconStyle: savings < 0 ? "bg-rose-50 text-rose-700" : "bg-sky-50 text-sky-700",
            labelStyle: savings < 0 ? "text-rose-700" : "text-sky-700",
        },
    ];

    return (
        <div className="min-h-screen space-y-10 bg-slate-50 p-6 md:p-10">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {statCards.map(({ title, amount, icon, accent, iconStyle, labelStyle }) => (
                    <div
                        key={title}
                        className={`relative overflow-hidden rounded-2xl border-l-4 ${accent} bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className={`text-sm font-semibold ${labelStyle}`}>{title}</p>
                                <p className="mt-3 flex items-center gap-1 text-3xl font-bold tracking-tight text-slate-900">
                                    <IndianRupee size={23} strokeWidth={2.5} />
                                    {amount.toLocaleString()}
                                </p>
                                <p className="mt-2 text-xs text-slate-500">
                                    {title === "Total Savings"
                                        ? amount < 0 ? "Spending is above income" : "Income left after expenses"
                                        : "For the selected period"}
                            </p>
                            </div>
                            <div className={`rounded-xl p-3 ${iconStyle}`}>
                                {React.createElement(icon, { size: 22, strokeWidth: 2.2 })}
                            </div>
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
                <div className="flex min-h-[24rem] flex-col rounded-3xl border border-gray-100 bg-white p-7 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">
                        💰 Income vs Expense
                    </h2>
                    <div className="flex flex-1 items-center justify-center">
                        <IncomeExpenseDonutChart
                            income={totalIncome}
                            expense={totalExpense}
                        />
                    </div>
                </div>

                <div className="bg-white p-7 rounded-3xl shadow-lg border border-gray-100 ">
                    <h2 className="text-2xl font-bold mb-6">
                        📊 Weekly Transactions
                    </h2>
                    {weeklyChartData?.datasets?.length > 0 ? (
                        <div className="h-70 ">
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
