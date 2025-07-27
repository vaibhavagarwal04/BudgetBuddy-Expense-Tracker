import React, { useEffect, useState } from "react";
import { fetchIncomes } from "../hooks/UseIncome";
import supabase from "../../supabase-client";
import AddIncome from "../components/AddIcome";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [userId, setUserId] = useState(null);
    const [add, setAdd] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const loadIncomes = async () => {
            if (userId) {
                const data = await fetchIncomes(userId);
                setIncomes(data);
            }
        };
        loadIncomes();
    }, [userId]);

    const toggle = () => {
        setAdd((prev) => !prev);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-4">Your Incomes</h2>
                <button
                    className="border rounded-2xl p-2 hover:bg-black hover:text-white"
                    onClick={toggle}
                >
                    Add income
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {incomes.map((income) => (
                    <div
                        key={income.id}
                        className="bg-white p-4 shadow rounded-xl border"
                    >
                        <h3 className="text-lg font-semibold">
                            {income.source}
                        </h3>
                        <p>₹ {income.amount}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(income.created_at).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
            {add && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs ">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
                        <button
                            onClick={toggle}
                            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
                        >
                            &times;
                        </button>
                        <AddIncome onClose={toggle} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Income;
