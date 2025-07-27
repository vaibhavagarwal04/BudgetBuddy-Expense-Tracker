import React, { useState } from "react";
import supabase from "../../supabase-client";

function AddIncome({ onIcomAdded }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const handleAdd = async () => {
        if (!title || !amount || !date)
            return alert("please fill all the details");

        const { error } = await supabase
            .from("Income")
            .insert([{ title, amount: parseFloat(amount), date }]);

        if (error) {
            console.error("Insert error:", error);
            alert("Failed to add income");
        } else {
            setTitle("");
            setAmount("");
            setDate("");
            onIcomAdded();
        }
    };

    return (
        <div className="mb-6 p-4 border rounded shadow w-80 h-80 m-auto text-center">
            <h2 className="text-xl font-semibold">Add Income</h2>
            <div className="flex flex-col text-center justify-between gap-6 mt-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full sm:w-64 p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 text-center"                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full sm:w-64 p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 text-center"
                />
                <input
                    type="date"
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full sm:w-64 p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                />

                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>
        </div>
    );
}

export default AddIncome;
