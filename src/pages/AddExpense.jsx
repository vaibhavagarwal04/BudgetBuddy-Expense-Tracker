import React, { useState } from "react";
import supabase from "../../supabase-client";

function AddExpense({ onExpenseAdded, userId }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleAdd = async () => {
    if (!title || !amount || !date) return alert("Please fill all the details");
    if (!userId) return alert("User not authenticated");

    const { error } = await supabase.from("Expense").insert([
      {
        title,
        amount: parseFloat(amount),
        created_at: date,
        user_id: userId,
      },
    ]);

    if (error) {
      alert("Failed to add expense: " + error.message);
    } else {
      setTitle("");
      setAmount("");
      setDate("");
      onExpenseAdded(); 
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Add New Expense
      </h2>

      <div className="space-y-5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition duration-200"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default AddExpense;
