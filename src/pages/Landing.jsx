import React from "react";
import Button from "../components/ui/Button";
import savingSvg from "../assets/Saving money-bro.svg";
import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleSignUpClick = () => {
        navigate("/signup");
    };

    return (
        <div className="font-noto min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center px-6 py-10">
            <header className="text-center mb-10">
                <h1
                    className="text-4xl md:text-5xl font-extrabold text-blue-800 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Budget Buddy
                </h1>
                <p className="mt-2 text-lg md:text-xl text-gray-600">
                    Manage your money smartly and stress-free 💸📊
                </p>
            </header>

            <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl gap-10">
                <div className="flex-1 text-center md:text-left space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                        Stay on top of your budget with ease
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Track your income, monitor expenses, and visualize your savings — all in one clean dashboard.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                        <Button onClick={handleLoginClick}>Log in</Button>
                        <Button onClick={handleSignUpClick}>Get Started</Button>
                    </div>
                </div>

                <div className="flex-1">
                    <img
                        src={savingSvg}
                        alt="Money saving illustration"
                        className="w-full h-auto max-h-[500px] object-contain"
                    />
                </div>
            </div>
        </div>
    );
}

export default Landing;
