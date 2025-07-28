import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import AddIncome from "../components/addIcome";

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

        const { data, error } = await supabase
            .from("Income")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Fetch error:", error);
        } else {
            setIncomes(data);
        }

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

    const renderIncomes = (list) =>
        list.length === 0 ? (
            <p className="text-sm text-gray-500">No income</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {list.map((income) => (
                    <div
                        key={income.id}
                        className="bg-white p-4 shadow rounded-xl border"
                    >
                        <h3 className="text-lg font-semibold">
                            {income.title}
                        </h3>
                        <p>₹ {income.amount}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(income.created_at).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Incomes</h2>
                <button
                    className="border rounded-2xl p-2 hover:bg-black hover:text-white"
                    onClick={toggle}
                >
                    Add income
                </button>
            </div>

            <div className="flex">
                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">
                        Today's Income
                    </h3>
                    {renderIncomes(todayIncomes)}
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">
                        This Month's Income
                    </h3>
                    {renderIncomes(monthIncomes)}
                </section>

                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">
                        This Year's Income
                    </h3>
                    {renderIncomes(yearIncomes)}
                </section>
            </div>

            {loading && (
                <p className="text-center mt-4 text-gray-500">Loading...</p>
            )}

            {add && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
                        <button
                            onClick={toggle}
                            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
                        >
                            &times;
                        </button>
                        <AddIncome
                            userId={userId}
                            onIcomAdded={() => loadIncomes()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Income;
