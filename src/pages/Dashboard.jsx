import React, { useEffect, useState } from "react";
import DashboardPieChart from "../components/DashboardPieChart";
import supabase from "../../supabase-client";
import DashboardLineChart from "../components/DasboardLineChart";

function Dashboard() {
    const [incomeTotal, setIncomeTotal] = useState(0);
    const [expenseTotal, setExpenseTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const { data: incomeData } = await supabase
                .from("Income")
                .select("amount");

            const { data: expenseData } = await supabase
                .from("Expense")
                .select("amount");

            const totalIncome =
                incomeData?.reduce((sum, item) => sum + item.amount, 0) || 0;

            const totalExpense =
                expenseData?.reduce((sum, item) => sum + item.amount, 0) || 0;

            setIncomeTotal(totalIncome);
            setExpenseTotal(totalExpense);
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
                    <h1 className="text-xl font-bold text-gray-800">Financial</h1>
                    <h2 className="text-2xl font-extrabold text-gray-900">Dashboard</h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <DashboardLineChart/>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
