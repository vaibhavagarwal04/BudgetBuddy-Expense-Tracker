import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [dropDown, setDropDown] = useState(false);

    const handleDropDown = () => {
        setDropDown((prev) => !prev);
    };

    const userName = localStorage.getItem("username");
    const initial = userName ? userName[0].toUpperCase() : "U";

    return (
        <nav className="bg-white shadow-md px-4 py-3 rounded-4xl border-2 sticky justify-between items-center max-w-7xl mt-1 flex">
            <div className="md:flex text-center">
                <Link to={"/"} className="text-3xl font-bold">
                    ~BudgetBuddy
                </Link>
            </div>

            <div className="hidden sm:flex gap-4 mr-2 font-semibold">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/income">Income</Link>
                <Link to="/expense">Expense</Link>
                <Link
                    to="/profile"
                    className="h-8 w-8 bg-white hover:bg-black transition duration-300 rounded-full border-2 border-black flex items-center justify-center text-black hover:text-white"
                    title="Profile"
                >
                    <span className="text-sm font-bold">{initial}</span>
                </Link>
            </div>

            <div className="sm:hidden relative">
                <button
                    onClick={handleDropDown}
                    className="h-8 w-8 bg-white hover:bg-black transition duration-300 rounded-full border-2 border-black flex items-center justify-center text-black hover:text-white"
                >
                    <span className="text-sm font-bold">{initial}</span>
                </button>

                {dropDown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                        <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                            Dashboard
                        </Link>
                        <Link to="/income" className="block px-4 py-2 hover:bg-gray-100">
                            Income
                        </Link>
                        <Link to="/expense" className="block px-4 py-2 hover:bg-gray-100">
                            Expense
                        </Link>
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                            Profile
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
