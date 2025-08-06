import React, { useEffect, useState } from "react";
import DashboardPieChart from "../components/DashboardPieChart";
import supabase from "../../supabase-client";
import DashboardLineChart from "../components/DasboardLineChart";

function Dashboard() {
    const [incomeTotal, setIncomeTotal] = useState(0);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [savingsData, setSavingsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: incomeData } = await supabase
                .from("Income")
                .select("amount, created_at");

            const { data: expenseData } = await supabase
                .from("Expense")
                .select("amount, created_at");

            let incomeTotal = 0;
            let expenseTotal = 0;
            const savingsMap = {};

            incomeData?.forEach(({ amount, created_at }) => {
                const date = new Date(created_at);
                const month = date.toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                }); 
                incomeTotal += amount;
                savingsMap[month] = (savingsMap[month] || 0) + amount;
            });

            expenseData?.forEach(({ amount, created_at }) => {
                const date = new Date(created_at);
                const month = date.toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                });
                expenseTotal += amount;
                savingsMap[month] = (savingsMap[month] || 0) - amount;
            });

            setIncomeTotal(incomeTotal);
            setExpenseTotal(expenseTotal);

            const sortedMonths = Object.keys(savingsMap).sort(
                (a, b) => new Date(`1 ${a}`) - new Date(`1 ${b}`)
            );

            const savings = sortedMonths.map((month) => ({
                date: month,
                amount: savingsMap[month],
            }));

            setSavingsData(savings);
        };

        fetchData();
    }, []);

    const currentAmount = incomeTotal - expenseTotal;

    const formatCurrency = (amount) =>
        amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });

    return (
        <div className="bg-[#fefcff] px-6 py-2 flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-1/4 bg-white rounded-2xl p-6 shadow-md flex flex-col gap-6 h-1/2">
                <div>
                    <h2 className="text-sm text-gray-500">Current Amount</h2>
                    <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(currentAmount)}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-24 h-24">
                        <DashboardPieChart
                            label1="Deposit"
                            value1={incomeTotal}
                            label2="Remaining"
                            value2={expenseTotal}
                        />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(incomeTotal)}
                        </p>
                        <p className="text-sm text-gray-600">Deposit</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-24 h-24">
                        <DashboardPieChart
                            label1="Withdraw"
                            value1={expenseTotal}
                            label2="Remaining"
                            value2={currentAmount}
                        />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-red-600">
                            {formatCurrency(expenseTotal)}
                        </p>
                        <p className="text-sm text-gray-600">Withdraw</p>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-2/3">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-800">
                        Financial
                    </h1>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                        Dashboard
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <DashboardLineChart data={savingsData} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow p-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Last Transactions
                        </h3>
                        <ul className="divide-y divide-gray-200">
                            {[...incomeData, ...expenseData]
                                .sort(
                                    (a, b) =>
                                        new Date(b.created_at) -
                                        new Date(a.created_at)
                                )
                                .slice(0, 5)
                                .map((txn, idx) => (
                                    <li
                                        key={idx}
                                        className="py-2 flex justify-between items-center"
                                    >
                                        <span className="text-gray-700">
                                            {txn.title ||
                                                txn.category ||
                                                "Transaction"}
                                        </span>
                                        <span
                                            className={`font-medium ${
                                                txn.amount > 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {txn.amount > 0 ? "+" : "-"}₹
                                            {Math.abs(txn.amount)}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Expense Breakdown by Category */}
                    <div className="bg-white rounded-xl shadow p-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Expense by Category
                        </h3>
                        <ul className="divide-y divide-gray-200">
                            {Object.entries(
                                expenseData?.reduce((acc, curr) => {
                                    const cat = curr.category || "Others";
                                    acc[cat] = (acc[cat] || 0) + curr.amount;
                                    return acc;
                                }, {})
                            ).map(([cat, amt], idx) => (
                                <li
                                    key={idx}
                                    className="py-2 flex justify-between items-center"
                                >
                                    <span className="text-gray-700">{cat}</span>
                                    <span className="text-red-600 font-semibold">
                                        ₹{amt}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
