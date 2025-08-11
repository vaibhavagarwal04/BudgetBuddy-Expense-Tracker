import React, { useEffect, useRef, useState } from "react";
import supabase from "../../supabase-client";
import AddIncome from "../components/AddIcome";
import {
    IndianRupee,
    Trash2,
    Plus,
    Calendar,
    TrendingUp,
    CalendarDays,
} from "lucide-react";
import WaveChart from "../components/WaveChart";
import PieChart from "../components/PieChart";
import dayjs from "dayjs";
import { fetchIncomes } from "../hooks/UserIncome";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [userId, setUserId] = useState(null);
    const [add, setAdd] = useState(false);
    const [loading, setLoading] = useState(false);
    const today = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    const deleteIncome = async (id) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return alert("User not authenticated");
        const { error } = await supabase
            .from("Income")
            .delete()
            .match({ id, user_id: user.id });
        if (!error) loadIncomes();
    };

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

    const todayDate = dayjs().format("YYYY-MM-DD");
    const currentMonth = dayjs().format("YYYY-MM");
    const currentYear = dayjs().format("YYYY");

    const todayIncomes = incomes.filter(
        (i) => dayjs(i.created_at).format("YYYY-MM-DD") === todayDate
    );
    const monthIncomes = incomes.filter(
        (i) => dayjs(i.created_at).format("YYYY-MM") === currentMonth
    );
    const yearIncomes = incomes.filter(
        (i) => dayjs(i.created_at).format("YYYY") === currentYear
    );

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

    const incomeOverviewData = {
        Today: todayIncomes.reduce((acc, i) => acc + i.amount, 0),
        "This Month": monthIncomes.reduce((acc, i) => acc + i.amount, 0),
        "This Year": yearIncomes.reduce((acc, i) => acc + i.amount, 0),
    };

    const StatCard = ({ label, value, icon: Icon, gradient, targetRef }) => {
        const handleClick = () => {
            if (targetRef?.current) {
                targetRef.current.scrollIntoView({ behavior: "smooth" });
            }
        };

        return (
            <div
                onClick={handleClick}
                className={`flex items-center gap-4 p-5 rounded-xl shadow-lg text-white ${gradient} cursor-pointer transition-transform hover:scale-105`}
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
    };

    const renderIncomes = (list) =>
        list.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center mt-6">
                No income records found.
            </p>
        ) : (
            <div className="flex flex-col gap-4 px-2 sm:px-4 py-2">
                {list.map((income) => (
                    <div
                        key={income.id}
                        className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl px-6 py-5 shadow hover:shadow-lg transition"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {income.title}
                            </h3>
                            <div className="flex items-center text-teal-600 font-bold text-lg">
                                <IndianRupee size={18} className="mr-1" />
                                {income.amount}
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                                {dayjs(income.created_at).format("DD MMM YYYY")}
                            </span>
                            <button
                                onClick={() => deleteIncome(income.id)}
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
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 min-h-screen">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    Your Income
                </h2>
                <button
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full shadow hover:bg-teal-700 transition"
                    onClick={toggle}
                >
                    <Plus size={18} /> Add Income
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Today"
                    value={incomeOverviewData.Today}
                    icon={Calendar}
                    gradient="bg-gradient-to-r from-teal-400 to-teal-600"
                     targetRef={today}
                />
                <StatCard
                    label="This Month"
                    value={incomeOverviewData["This Month"]}
                    icon={CalendarDays}
                    gradient="bg-gradient-to-r from-cyan-400 to-cyan-600"
                    targetRef={monthRef}
                />
                <StatCard
                    label="This Year"
                    value={incomeOverviewData["This Year"]}
                    icon={TrendingUp}
                    gradient="bg-gradient-to-r from-emerald-400 to-emerald-600"
                    targetRef={yearRef}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md">
                    <WaveChart
                        labels={chartLabels}
                        dataPoints={monthlyData}
                        type="income"
                    />
                </div>
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-4">
                        Income Overview
                    </h3>
                    <PieChart data={incomeOverviewData} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                    ref={today}
                    className="h-96 bg-white/80 backdrop-blur-md rounded-xl shadow-md flex flex-col"
                >
                    <div className="bg-teal-500 text-white p-4 rounded-t-xl ">
                        <h3 className="text-lg font-semibold">
                            Today's Income
                        </h3>
                    </div>
                    <div className="p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        {renderIncomes(todayIncomes)}
                    </div>
                </div>

                <div ref={monthRef} className="h-96 bg-white/80 backdrop-blur-md rounded-xl shadow-md flex flex-col">
                    <div className="bg-cyan-500 text-white p-4 rounded-t-xl">
                        <h3 className="text-lg font-semibold">This Month</h3>
                    </div>
                    <div className="p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        {renderIncomes(monthIncomes)}
                    </div>
                </div>

                <div ref={yearRef} className="h-96 bg-white/80 backdrop-blur-md rounded-xl shadow-md flex flex-col">
                    <div className="bg-emerald-500 text-white p-4 rounded-t-xl">
                        <h3 className="text-lg font-semibold">This Year</h3>
                    </div>
                    <div className="p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        {renderIncomes(yearIncomes)}
                    </div>
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
