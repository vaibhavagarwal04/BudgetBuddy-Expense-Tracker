import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { IndianRupee, Trash2 } from "lucide-react";
import WaveChart from "../components/WaveChart";
import PieChart from "../components/PieChart";
import dayjs from "dayjs";
import AddExpense from "./AddExpense";
import { fetchExpense } from "../hooks/UseExpense";

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  const deleteExpense = async (id) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("User not authenticated");
      return;
    }
    const { error } = await supabase.from("Expense").delete().match({ id, user_id: user.id });
    if (error) {
      alert("Failed to delete expense: " + error.message);
    } else {
      loadExpenses();
    }
  };

  const loadExpenses = async () => {
    if (!userId) return;
    setLoading(true);
    const data = await fetchExpense(userId);
    setExpenses(data);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) loadExpenses();
  }, [userId]);

  const toggle = () => setAdd((prev) => !prev);

  const isSameDay = (d) => new Date(d).toDateString() === new Date().toDateString();
  const isSameMonth = (d) => new Date(d).getMonth() === new Date().getMonth() && new Date(d).getFullYear() === new Date().getFullYear();
  const isSameYear = (d) => new Date(d).getFullYear() === new Date().getFullYear();

  const todayExpenses = expenses.filter((e) => isSameDay(e.created_at));
  const monthExpenses = expenses.filter((e) => isSameMonth(e.created_at));
  const yearExpenses = expenses.filter((e) => isSameYear(e.created_at));

  const monthlyData = Array(12).fill(0);
  expenses.forEach((exp) => {
    const month = new Date(exp.created_at).getMonth();
    monthlyData[month] += exp.amount;
  });

  const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const renderExpenses = (list) =>
    list.length === 0 ? (
      <p className="text-sm text-gray-500 italic text-center mt-6">No expense records found.</p>
    ) : (
      <div className="flex flex-col gap-4 px-2 sm:px-4 py-2 custom-scrollbar overflow-y-auto">
        {list.map((expense) => (
          <div key={expense.id} className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{expense.title}</h3>
              <div className="flex items-center text-red-600 font-semibold text-lg">
                <IndianRupee size={18} className="mr-1" />-{expense.amount}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Added on:{" "}
                <span className="text-gray-700 font-medium">
                  {new Date(expense.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </p>
              <button onClick={() => deleteExpense(expense.id)} className="text-red-500 hover:text-red-700 transition" title="Delete">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );

  const todayDate = dayjs().format("YYYY-MM-DD");
  const currentMonth = dayjs().format("YYYY-MM");
  const currentYear = dayjs().format("YYYY");

  const todayExpense = expenses.filter((e) => dayjs(e.created_at).format("YYYY-MM-DD") === todayDate).reduce((acc, e) => acc + e.amount, 0);
  const monthExpense = expenses.filter((e) => dayjs(e.created_at).format("YYYY-MM") === currentMonth).reduce((acc, e) => acc + e.amount, 0);
  const yearExpense = expenses.filter((e) => dayjs(e.created_at).format("YYYY") === currentYear).reduce((acc, e) => acc + e.amount, 0);

  const expenseOverviewData = {
    Today: todayExpense,
    "This Month": monthExpense,
    "This Year": yearExpense,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 relative">
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `
          radial-gradient(circle at 30% 70%, rgba(252, 165, 165, 0.35), transparent 60%),
          radial-gradient(circle at 70% 30%, rgba(254, 215, 170, 0.4), transparent 60%)`,
      }} />

      <div className="p-6 max-w-7xl mx-auto bg-white/70 backdrop-blur-lg rounded-xl shadow-lg custom-scrollbar overflow-y-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Expenses</h2>
          <button className="border border-red-400 rounded-full px-6 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition" onClick={toggle}>
            + Add Expense
          </button>
        </div>

        <div className="mb-12">
          <WaveChart labels={chartLabels} dataPoints={monthlyData} type="expense" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg flex flex-col">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Today's Expenses</h3>
            </div>
            <div className="p-4 flex-1 custom-scrollbar overflow-y-auto">{renderExpenses(todayExpenses)}</div>
          </div>

          <div className="h-96 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg flex flex-col">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">This Month's Expenses</h3>
            </div>
            <div className="p-4 flex-1 custom-scrollbar overflow-y-auto">{renderExpenses(monthExpenses)}</div>
          </div>

          <div className="h-96 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg flex flex-col">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">This Year's Expenses</h3>
            </div>
            <div className="p-4 flex-1 custom-scrollbar overflow-y-auto">{renderExpenses(yearExpenses)}</div>
          </div>

          <div className="h-96 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg flex flex-col items-center justify-center p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Expense Overview</h3>
            <PieChart data={expenseOverviewData} />
          </div>
        </div>

        {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}

        {add && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
              <button onClick={toggle} className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold">&times;</button>
              <AddExpense userId={userId} onExpenseAdded={loadExpenses} onClick={toggle} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
