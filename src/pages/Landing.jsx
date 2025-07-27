import React from "react";
import Button from "../components/ui/Button";
import landingimage from "../assets/landing-image.jpg";
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
        <div className="font-noto flex flex-col justify-between min-h-screen px-4 py-6 md:min-h-fit md:py-0">
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-12 md:gap-0">
                <h1
                    className="text-4xl font-black border-1 rounded-2xl p-2 px-5 text-center md:p-2 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    ~Budget Buddy
                </h1>

                <div className="hidden md:flex gap-4">
                    <Button onClick={handleLoginClick}>Log in</Button>
                    <Button onClick={handleSignUpClick}>Sign Up</Button>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center md:mt-6">
                <img
                    src={landingimage}
                    alt="Illustration"
                    className="w-full max-w-2xl sm:max-w-lg md:max-w-1xl object-contain"
                />
            </div>

            <div className="flex flex-col gap-4 md:hidden">
                <Button onClick={handleLoginClick}>Log in</Button>
                <Button onClick={handleSignUpClick}>Sign Up</Button>
            </div>
        </div>
    );
}

export default Landing;
