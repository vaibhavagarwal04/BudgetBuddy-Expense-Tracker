import React, { useEffect, useState, useMemo } from "react";
import supabase from "../../supabase-client";
import manAvatar from "../assets/manavatar.png";
import avatarGirl from "../assets/avatargirl.png";
import {
    FaMoneyBillWave,
    FaWallet,
    FaPiggyBank,
    FaUser,
    FaIdBadge,
    FaCalendarAlt,
    FaExchangeAlt,
    FaEdit,
    FaSignOutAlt,
} from "react-icons/fa";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [income, setIncome] = useState([]);
    const [expense, setExpense] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastLogin, setLastLogin] = useState(null);
    const [userId, setUserId] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [gender, setGender] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setAuthUser(user);
            if (!user) {
                setLoading(false);
                return;
            }
            setUserId(user.id);
            setLastLogin(user.last_sign_in_at);

            const { data: existing } = await supabase
                .from("account_summary")
                .select("id")
                .eq("id", user.id)
                .maybeSingle();

            if (!existing) {
                const fullName =
                    `${user.user_metadata?.first_name || ""} ${
                        user.user_metadata?.last_name || ""
                    }`.trim() || null;

                await supabase.from("account_summary").upsert({
                    id: user.id,
                    email: user.email || "",
                    name: fullName,
                    gender: null,
                    join_date: new Date().toISOString(),
                    avatar_url: user.user_metadata?.avatar_url || null,
                });
            }

            const { data: profileData } = await supabase
                .from("account_summary")
                .select("*")
                .eq("id", user.id)
                .single();

            const { data: incomeData } = await supabase
                .from("Income")
                .select("*")
                .eq("user_id", user.id);

            const { data: expenseData } = await supabase
                .from("Expense")
                .select("*")
                .eq("user_id", user.id);

            setProfile(profileData || null);
            setGender(profileData?.gender || "");
            setIncome(incomeData || []);
            setExpense(expenseData || []);
            setLoading(false);
        };

        fetchData();
    }, []);

    const { totalIncome, totalExpense, savings } = useMemo(() => {
        const totalIncomeCalc = income.reduce(
            (acc, curr) => acc + curr.amount,
            0
        );
        const totalExpenseCalc = expense.reduce(
            (acc, curr) => acc + curr.amount,
            0
        );
        const savingsCalc = totalIncomeCalc - totalExpenseCalc;
        return {
            totalIncome: totalIncomeCalc,
            totalExpense: totalExpenseCalc,
            savings: savingsCalc,
        };
    }, [income, expense]);

    const totalTransactions = income.length + expense.length;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    const handleGenderChange = async (e) => {
        const selectedGender = e.target.value;
        setGender(selectedGender);

        if (userId) {
            await supabase
                .from("account_summary")
                .update({ gender: selectedGender })
                .eq("id", userId);
            setProfile((prev) => ({ ...prev, gender: selectedGender }));
        }
    };

    const formatINR = (n) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(n || 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <p className="text-sm sm:text-base text-gray-600">
                    Loading profile...
                </p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <p className="text-base sm:text-lg text-red-500">
                    No profile data found.
                </p>
            </div>
        );
    }

    const avatarUrl =
        profile.avatar_url ||
        (gender?.toLowerCase() === "male"
            ? manAvatar
            : gender?.toLowerCase() === "female"
            ? avatarGirl
            : manAvatar);

    return (
        <div className="h-80% bg-gradient-to-b from-slate-50 to-slate-100 py-6 sm:py-5">
            <div className="mx-auto w-full max-w-3xl">
                <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 overflow-hidden">
                    <div className="px-6 sm:px-8 pt-6 pb-4 bg-white/80 backdrop-blur">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-slate-100 shadow"
                                />
                                <div className="min-w-0">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 truncate py-2">
                                        {profile?.name}
                                    </h2>
                                    <p className="text-slate-500 text-sm sm:text-base truncate">
                                        {profile.email}
                                    </p>
                                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                        Joined:{" "}
                                        {new Date(
                                            profile.join_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <select
                                value={gender}
                                onChange={handleGenderChange}
                                className="border border-slate-300 rounded-md px-2 py-1 text-sm"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1 rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                <FaUser className="text-blue-500" />{" "}
                                {gender || "N/A"}
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1 rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                <FaIdBadge className="text-purple-500" />{" "}
                                {userId}
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1 rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                <FaCalendarAlt className="text-orange-500" />{" "}
                                {lastLogin
                                    ? new Date(lastLogin).toLocaleString()
                                    : "N/A"}
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1 rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                                <FaExchangeAlt className="text-teal-500" />{" "}
                                {totalTransactions} transactions
                            </span>
                        </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <div className="px-6 sm:px-8 py-6">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">
                            Financial Summary
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="group rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-center hover:bg-blue-50 transition">
                                <FaMoneyBillWave className="mx-auto text-blue-600 text-2xl mb-1" />
                                <p className="text-sm text-slate-500">Income</p>
                                <p className="text-xl font-extrabold text-slate-800">
                                    {formatINR(totalIncome)}
                                </p>
                            </div>
                            <div className="group rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-center hover:bg-rose-50 transition">
                                <FaWallet className="mx-auto text-rose-600 text-2xl mb-1" />
                                <p className="text-sm text-slate-500">
                                    Expenses
                                </p>
                                <p className="text-xl font-extrabold text-slate-800">
                                    {formatINR(totalExpense)}
                                </p>
                            </div>
                            <div className="group rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-center hover:bg-emerald-50 transition">
                                <FaPiggyBank className="mx-auto text-emerald-600 text-2xl mb-1" />
                                <p className="text-sm text-slate-500">
                                    Savings
                                </p>
                                <p className="text-xl font-extrabold text-slate-800">
                                    {formatINR(savings)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 sm:px-8 pb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2.5 shadow-sm transition"
                                onClick={() =>
                                    (window.location.href = "/edit-profile")
                                }
                            >
                                <FaEdit /> Edit Profile
                            </button>
                            <button
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white py-2.5 shadow-sm transition"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
