import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { IndianRupee, Trash2 } from "lucide-react";
import WaveChart from "../components/WaveChart";
import PieChart from "../components/PieChart";
import dayjs from "dayjs";
import AddExpense from "./AddExpense";
import { fetchExpense } from "../hooks/UseExpense";

export default function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [userId, setUserId] = useState(null);
    const [add, setAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        fetchUser();
    }, []);

    const deleteExpense = async (id) => {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
            alert("User not authenticated");
            return;
        }
        const { error } = await supabase
            .from("Expense")
            .delete()
            .match({ id, user_id: user.id });
        if (error) {
            alert("Failed to delete expense: " + error.message);
        } else {
            loadExpenses();
        }
    };

    const loadExpenses = async () => {
        if (!userId || loading) return;
        setLoading(true);
        const data = await fetchExpense(userId);
        setExpenses(data);
        setLoading(false);
    };

    useEffect(() => {
        if (userId) loadExpenses();
    }, [userId]);

    const toggle = () => setAdd((prev) => !prev);

    const todayDate = dayjs().format("YYYY-MM-DD");
    const currentMonth = dayjs().format("YYYY-MM");
    const currentYear = dayjs().format("YYYY");

    const todayExpenses = expenses.filter(
        (e) => dayjs(e.created_at).format("YYYY-MM-DD") === todayDate
    );
    const monthExpenses = expenses.filter(
        (e) => dayjs(e.created_at).format("YYYY-MM") === currentMonth
    );
    const yearExpenses = expenses.filter(
        (e) => dayjs(e.created_at).format("YYYY") === currentYear
    );

    const monthlyData = Array(12).fill(0);
    expenses.forEach((exp) => {
        const month = new Date(exp.created_at).getMonth();
        monthlyData[month] += exp.amount;
    });

    const chartLabels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const expenseOverviewData = {
        Today: todayExpenses.reduce((acc, e) => acc + e.amount, 0),
        "This Month": monthExpenses.reduce((acc, e) => acc + e.amount, 0),
        "This Year": yearExpenses.reduce((acc, e) => acc + e.amount, 0),
    };

    const StatCard = ({ label, value, icon: Icon, gradient }) => (
        <div
            className={`flex items-center gap-4 p-5 rounded-xl shadow-lg text-white ${gradient}`}
        >
            <div className="p-3 bg-white/20 rounded-full">
                <Icon size={28} />
            </div>
            <div>
                <p className="text-sm opacity-80">{label}</p>
                <h3 className="text-2xl font-bold">
                    ₹{value.toLocaleString()}
                </h3>
            </div>
        </div>
    );

    const renderExpenses = (list) =>
        list.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center mt-6">
                No expense records found.
            </p>
        ) : (
            <div className="flex flex-col gap-4 px-2 sm:px-4 py-2">
                {list.map((expense) => (
                    <div
                        key={expense.id}
                        className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl px-6 py-5 shadow hover:shadow-lg transition"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {expense.title}
                            </h3>
                            <div className="flex items-center text-red-600 font-bold text-lg">
                                <IndianRupee size={18} className="mr-1" />-
                                {expense.amount}
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                                {dayjs(expense.created_at).format(
                                    "DD MMM YYYY"
                                )}
                            </span>
                            <button
                                onClick={() => deleteExpense(expense.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 min-h-screen font-sans">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    Your Expenses
                </h2>
                <button
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow hover:bg-red-700 transition"
                    onClick={toggle}
                >
                    + Add Expense
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Today"
                    value={expenseOverviewData.Today}
                    icon={Trash2}
                    gradient="bg-gradient-to-r from-blue-500 to-blue-700"
                />
                <StatCard
                    label="This Month"
                    value={expenseOverviewData["This Month"]}
                    icon={Trash2}
                    gradient="bg-gradient-to-r from-cyan-500 to-cyan-700"
                />
                <StatCard
                    label="This Year"
                    value={expenseOverviewData["This Year"]}
                    icon={Trash2}
                    gradient="bg-gradient-to-r from-teal-600 to-teal-800"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md">
                    <WaveChart
                        labels={chartLabels}
                        dataPoints={monthlyData}
                        type="expense"
                    />
                </div>
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-4">
                        Expense Overview
                    </h3>
                    <PieChart data={expenseOverviewData} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="h-96 bg-white/80 backdrop-blur-md rounded-xl shadow-md flex flex-col">
                    <div className="bg-blue-600 text-white p-4 rounded-t-xl">
                        <h3 className="text-lg font-semibold">
                            Today's Expenses
                        </h3>
                    </div>
                    <div className="p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        {renderExpenses(todayExpenses)}
                    </div>
                </div>

                <div className="h-96 bg-white/80 backdrop-blur-md rounded-xl shadow-md flex flex-col">
                    <div className="bg-cyan-600 text-white p-4 rounded-t-xl">
                        <h3 className="text-lg font-semibold">This Month</h3>
                    </div>
                    <div className="p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        {renderExpenses(monthExpenses)}
                    </div>
                </div>

                <div className="h-96 bg-white/80 backdrop-blur-md rounded-xl shadow-md flex flex-col">
                    <div className="bg-teal-700 text-white p-4 rounded-t-xl">
                        <h3 className="text-lg font-semibold">This Year</h3>
                    </div>
                    <div className="p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        {renderExpenses(yearExpenses)}
                    </div>
                </div>
            </div>

            {loading && (
                <p className="text-center mt-4 text-gray-500">Loading...</p>
            )}

            {add && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
                        <button
                            onClick={toggle}
                            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
                        >
                            &times;
                        </button>
                        <AddExpense
                            userId={userId}
                            onExpenseAdded={() => {
                                loadExpenses();
                                toggle();
                            }}
                            onClose={toggle}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
