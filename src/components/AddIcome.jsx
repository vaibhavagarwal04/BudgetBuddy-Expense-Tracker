import React, { useState } from "react";
import supabase from "../../supabase-client";
import { CalendarDays } from "lucide-react";

function AddIncome({ onIncomeAdded, userId }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const now = new Date();
    const todayDate = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");

    const handleAdd = async (event) => {
        event.preventDefault();

        const parsedAmount = Number(amount);
        if (!title.trim() || !amount || !date || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a title, a valid positive amount, and a date.");
            return;
        }

        if (date > todayDate) {
            alert("Income date cannot be in the future.");
            return;
        }

        if (!userId)
            return alert("User not authenticated");

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("Income")
                .insert([{
                    title: title.trim(),
                    amount: parsedAmount,
                    created_at: date,
                    user_id: userId,
                }]);

            if (error) {
                console.error("Insert error:", error.message);
                alert("Failed to add income: " + error.message);
                return;
            }

            setTitle("");
            setAmount("");
            setDate("");
            onIncomeAdded();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-5 text-white">
                <p className="text-sm font-medium uppercase tracking-wide text-teal-100">
                    Income tracker
                </p>
                <h2 className="mt-1 text-2xl font-bold">Add New Income</h2>
                <p className="mt-1 text-sm text-cyan-50">
                    Record money coming in and keep your budget up to date.
                </p>
            </div>

            <form onSubmit={handleAdd} className="space-y-5 p-6">
                <div className="text-left">
                    <label htmlFor="income-title" className="mb-2 block text-sm font-semibold text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="income-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Freelance Project"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    />
                </div>

                <div className="text-left">
                    <label htmlFor="income-amount" className="mb-2 block text-sm font-semibold text-gray-700">
                        Amount (₹)
                    </label>
                    <input
                        type="number"
                        id="income-amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                        required
                        placeholder="e.g. 5000"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    />
                </div>

                <div className="text-left">
                    <label htmlFor="income-date" className="mb-2 block text-sm font-semibold text-gray-700">
                        Date
                    </label>
                    <div className="relative">
                        <CalendarDays
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-teal-600"
                            size={19}
                        />
                        <input
                            type="date"
                            id="income-date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={todayDate}
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                        />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Select today or an earlier date.</p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Adding Income..." : "+ Add Income"}
                </button>
            </form>
        </div>
    );
}

export default AddIncome;
