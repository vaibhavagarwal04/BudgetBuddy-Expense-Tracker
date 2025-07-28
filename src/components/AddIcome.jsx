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
        .insert([{
            title,
            amount: parseFloat(amount),
            created_at: date,
            user_id: userId
        }]);

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
        <div className="mb-6 p-4 border rounded shadow w-80 h-80 m-auto text-center">
            <h2 className="text-xl font-semibold">Add Income</h2>
            <div className="flex flex-col text-center justify-between gap-6 mt-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-xl text-center"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded-xl text-center"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded-xl"
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
