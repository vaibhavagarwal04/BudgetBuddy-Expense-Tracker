import React, { useState } from "react";
import Button from "../components/Button";
import landingimage from "../assets/landing-image.jpg";
import Login from "./Login";
import SignUp from "./SignUp";

function Landing() {
    const [LoginToggle, SetLoginToggle] = useState(false);

    const handleLoginClick = () => {
        SetLoginToggle(true);
    };

    const handleClose = () => {
        SetLoginToggle(false);
    };

    const [signUpToggle,SetSignUpToggle ]=useState(false);

    const handleSignUpClick=()=>{
        SetSignUpToggle(true);
    }

    const handleSignUpClose=()=>{
        SetSignUpToggle(false);
    }

    return (
        <div className="font-noto flex flex-col justify-between min-h-screen px-4 py-6 md:min-h-fit md:py-0">
            {LoginToggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white ">
                    <div
                        className="absolute inset-0 bg-[#f8fafc] "
                        style={{
                            backgroundImage: `
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
                            backgroundSize: "30px 50px",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                            maskImage:
                                "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                        }}
                    />

                    <div className="relative z-10 bg-white rounded-3xl shadow-lg p-6 max-w-md w-85 h-100">
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-4 text-gray-600 hover:text-black text-xl"
                        >
                            &times;
                        </button>
                        <Login />
                    </div>
                </div>
            )}

             {signUpToggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <div
                        className="absolute inset-0 bg-[#f8fafc]"
                        style={{
                            backgroundImage: `
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
                            backgroundSize: "30px 50px",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                            maskImage:
                                "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                        }}
                    />

                    <div className="relative z-10 bg-white rounded-3xl shadow-lg p-6 max-w-md w-85 h-115 md:h-100 border-1">
                        <button
                            onClick={handleSignUpClose}
                            className="absolute top-2 right-4 text-gray-600 hover:text-black text-xl"
                        >
                            &times;
                        </button>
                        <SignUp/>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-12 md:gap-0">
                <h1 className="text-4xl font-black border-1 rounded-2xl p-2 px-5 text-center md:p-2">
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

            <div className="flex flex-col gap-4  md:hidden">
                <Button onClick={handleLoginClick}>Log in</Button>
                <Button onClick={handleSignUpClick}>Sign Up</Button>
            </div>
        </div>
    );
}

export default Landing;
