import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import AddIncome from "../components/addIcome";
import { IndianRupee } from "lucide-react";
import WaveChart from "../components/WaveChart";
import PieChart from "../components/PieChart";
import dayjs from "dayjs";
import { fetchIncomes } from "../hooks/UserIncome";

function Income() {
    const [incomes, setIncomes] = useState([]);
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

    const loadIncomes = async () => {
        if (!userId || loading) return;
        setLoading(true);
        const data = await fetchIncomes(userId);
        setIncomes(data);
        setLoading(false);
    };

    useEffect(() => {
        if (userId) loadIncomes();
    }, [userId]);

    const toggle = () => setAdd((prev) => !prev);

    const today = new Date();
    const isSameDay = (d) =>
        new Date(d).toDateString() === today.toDateString();
    const isSameMonth = (d) =>
        new Date(d).getMonth() === today.getMonth() &&
        new Date(d).getFullYear() === today.getFullYear();
    const isSameYear = (d) => new Date(d).getFullYear() === today.getFullYear();

    const todayIncomes = incomes.filter((i) => isSameDay(i.created_at));
    const monthIncomes = incomes.filter((i) => isSameMonth(i.created_at));
    const yearIncomes = incomes.filter((i) => isSameYear(i.created_at));

    const monthlyData = Array(12).fill(0);
    incomes.forEach((inc) => {
        const month = new Date(inc.created_at).getMonth();
        monthlyData[month] += inc.amount;
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

    const renderIncomes = (list) =>
        list.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center mt-6">
                No income records found.
            </p>
        ) : (
            <div className="flex flex-col gap-4 px-2 sm:px-4 py-2 custom-scrollbar overflow-y-auto">
                {list.map((income) => (
                    <div
                        key={income.id}
                        className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {income.title}
                            </h3>
                            <div className="flex items-center text-green-600 font-semibold text-lg">
                                <IndianRupee size={18} className="mr-1" />
                                {income.amount}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            Added on:{" "}
                            <span className="text-gray-700 font-medium">
                                {new Date(income.created_at).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        );

    const todayDate = dayjs().format("YYYY-MM-DD");
    const currentMonth = dayjs().format("YYYY-MM");
    const currentYear = dayjs().format("YYYY");

    const todayIncome = incomes
        .filter(
            (income) =>
                dayjs(income.created_at).format("YYYY-MM-DD") === todayDate
        )
        .reduce((acc, income) => acc + income.amount, 0);

    const monthIncome = incomes
        .filter(
            (income) =>
                dayjs(income.created_at).format("YYYY-MM") === currentMonth
        )
        .reduce((acc, income) => acc + income.amount, 0);

    const yearIncome = incomes
        .filter(
            (income) => dayjs(income.created_at).format("YYYY") === currentYear
        )
        .reduce((acc, income) => acc + income.amount, 0);

    const incomeOverviewData = {
        Today: todayIncome,
        "This Month": monthIncome,
        "This Year": yearIncome,
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-xl shadow-lg custom-scrollbar overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    Your Income
                </h2>
                <button
                    className="border border-green-400 rounded-full px-6 py-2 hover:bg-green-400 hover:text-white transition"
                    onClick={toggle}
                >
                    + Add Income
                </button>
            </div>

            <div className="mb-12">
                <WaveChart labels={chartLabels} dataPoints={monthlyData} type="income" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-96 bg-white rounded-xl shadow flex flex-col">
                    <div className="sticky top-0 z-10 bg-white p-4 border-b">
                        <h3 className="text-lg font-semibold">
                            Today's Income
                        </h3>
                    </div>
                    <div className="p-4 flex-1 custom-scrollbar overflow-y-auto">
                        {renderIncomes(todayIncomes)}
                    </div>
                </div>

                <div className="h-96 bg-white rounded-xl shadow flex flex-col">
                    <div className="sticky top-0 z-10 bg-white p-4 border-b">
                        <h3 className="text-lg font-semibold">
                            This Month's Income
                        </h3>
                    </div>
                    <div className="p-4 flex-1 custom-scrollbar overflow-y-auto">
                        {renderIncomes(monthIncomes)}
                    </div>
                </div>

                <div className="h-96 bg-white rounded-xl shadow flex flex-col">
                    <div className="sticky top-0 z-10 bg-white p-4 border-b">
                        <h3 className="text-lg font-semibold">
                            This Year's Income
                        </h3>
                    </div>
                    <div className="p-4 flex-1 custom-scrollbar overflow-y-auto">
                        {renderIncomes(yearIncomes)}
                    </div>
                </div>

                <div className="h-96 bg-white rounded-xl shadow flex flex-col items-center justify-center p-4">
                    <h3 className="text-lg font-semibold mb-4">
                        Income Overview
                    </h3>
                    <PieChart data={incomeOverviewData} />
                </div>
            </div>

            {loading && (
                <p className="text-center mt-4 text-gray-500">Loading...</p>
            )}

            {add && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
                        <button
                            onClick={toggle}
                            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
                        >
                            &times;
                        </button>
                        <AddIncome userId={userId} onIcomAdded={loadIncomes} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Income;
