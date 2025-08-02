import React, { useState } from "react";
import supabase from "../../supabase-client";

function AddIncome({ onIcomAdded, userId }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const handleAdd = async () => {
        if (!title || !amount || !date)
            return alert("Please fill all the details");

        if (!userId)
            return alert("User not authenticated");

        const { error } = await supabase
            .from("Income")
            .insert([
                {
                    title,
                    amount: parseFloat(amount),
                    created_at: date,
                    user_id: userId,
                },
            ]);

        if (error) {
            console.error("Insert error:", error.message);
            alert("Failed to add income: " + error.message);
        } else {
            setTitle("");
            setAmount("");
            setDate("");
            onIcomAdded();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Add New Income
            </h2>

            <div className="space-y-5">
                <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Freelance Project"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₹)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition duration-200"
                >
                    + Add Income
                </button>
            </div>
        </div>
    );
}

export default AddIncome;
