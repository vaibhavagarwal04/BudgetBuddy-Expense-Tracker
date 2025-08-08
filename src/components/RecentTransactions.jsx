import React from "react";
import dayjs from "dayjs";
import { IndianRupee } from "lucide-react";

function RecentTransactions({ transactions }) {
  return (
    <div className="bg-white p-7 rounded-3xl shadow-lg border border-gray-100">
      <div className="flex justify-between mb-5">
        <h2 className="text-2xl font-semibold">📄 Recent Transactions</h2>
      </div>
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium">{tx.description || "No Description"}</p>
                <p className="text-sm text-gray-500">
                  {dayjs(tx.date).format("DD MMM YYYY")}
                </p>
              </div>
              <div
                className={`flex items-center gap-1 font-semibold ${
                  tx.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                <IndianRupee size={16} />
                {tx.type === "income" ? `+${tx.amount}` : `-${tx.amount}`}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No transactions found</p>
        )}
      </div>
    </div>
  );
}

export default RecentTransactions;
