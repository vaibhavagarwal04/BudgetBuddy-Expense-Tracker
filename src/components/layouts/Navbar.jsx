import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [dropDown, setDropDown] = useState(false);
    const handleDropDown = () => setDropDown((prev) => !prev);

    const userName = localStorage.getItem("username");
    const initial = userName ? userName[0].toUpperCase() : "U";

    return (
        <nav className="backdrop-blur-md bg-white/30 border border-white/20 shadow-lg px-6 py-4 rounded-2xl sticky top-0 z-50 flex justify-between items-center max-w-7xl mx-auto">
            <div className="text-2xl font-extrabold tracking-wide text-gray-800">
                <Link to="/" className="hover:opacity-80 transition duration-300">
                    ~BudgetBuddy
                </Link>
            </div>

            <div className="hidden sm:flex items-center gap-8 mr-2 font-medium text-gray-700">
                {["Dashboard", "Income", "Expense"].map((item) => (
                    <Link
                        key={item}
                        to={`/dashboard${item !== "Dashboard" ? "/" + item.toLowerCase() : ""}`}
                        className="relative group"
                    >
                        {item}
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                ))}
                <Link
                    to="/profile"
                    className="h-10 w-10 bg-gray-800 text-white hover:bg-black transition duration-300 rounded-full border border-gray-700 flex items-center justify-center font-bold"
                    title="Profile"
                >
                    {initial}
                </Link>
            </div>

            <div className="sm:hidden relative">
                <button
                    onClick={handleDropDown}
                    className="h-10 w-10 bg-gray-800 text-white hover:bg-black transition duration-300 rounded-full border border-gray-700 flex items-center justify-center font-bold"
                >
                    {initial}
                </button>

                {dropDown && (
                    <div className="absolute right-0 mt-3 w-44 bg-white/90 backdrop-blur-md text-gray-800 border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 ease-in-out">
                        {["Dashboard", "Income", "Expense", "Profile"].map((item) => (
                            <Link
                                key={item}
                                to={`/${item === "Profile" ? "profile" : "dashboard" + (item !== "Dashboard" ? "/" + item.toLowerCase() : "")}`}
                                className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
