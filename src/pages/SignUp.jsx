import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FormLayout from "../components/FormLayout";
import illustration from "../assets/Sign-up-rafiki.svg";
import supabase from "../../supabase-client";

function SignUp() {
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        const email = e.target.floating_email.value;
        const password = e.target.floating_password.value;
        const confirmPassword = e.target.repeat_password.value;
        const firstName = e.target.floating_first_name.value;
        const lastName = e.target.floating_last_name.value;
        const phone = e.target.floating_phone.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName, phone },
            },
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Sign-up successful! Please verify your email.");
            navigate("/");
        }
    };

    return (
        <FormLayout>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-white max-w-4xl mx-auto rounded-2xl shadow-xl px-6 py-8 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-3 right-4 text-3xl text-gray-500 hover:text-black"
                >
                    &times;
                </button>

                <div className="hidden md:block w-1/2">
                    <img
                        src={illustration}
                        alt="Sign up"
                        className="w-full h-auto max-h-[360px] object-contain"
                    />
                </div>

                <form onSubmit={handleSignUp} className="w-full md:w-1/2 space-y-4">
                    <h2 className="text-2xl font-bold text-center text-black mb-2">
                        Create Your Account
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative z-0 w-full group">
                            <input
                                type="text"
                                name="floating_first_name"
                                id="floating_first_name"
                                placeholder=" "
                                required
                                className="block py-2.5 w-full text-sm bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                            />
                            <label
                                htmlFor="floating_first_name"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-black peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100"
                            >
                                First Name
                            </label>
                        </div>
                        <div className="relative z-0 w-full group">
                            <input
                                type="text"
                                name="floating_last_name"
                                id="floating_last_name"
                                placeholder=" "
                                required
                                className="block py-2.5 w-full text-sm bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                            />
                            <label
                                htmlFor="floating_last_name"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-black peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100"
                            >
                                Last Name
                            </label>
                        </div>
                    </div>

                    <div className="relative z-0 w-full group">
                        <input
                            type="email"
                            name="floating_email"
                            id="floating_email"
                            placeholder=" "
                            required
                            className="block py-2.5 w-full text-sm bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                        />
                        <label
                            htmlFor="floating_email"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-black peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100"
                        >
                            Email Address
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative z-0 w-full group">
                            <input
                                type="password"
                                name="floating_password"
                                id="floating_password"
                                placeholder=" "
                                required
                                className="block py-2.5 w-full text-sm bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                            />
                            <label
                                htmlFor="floating_password"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-black peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100"
                            >
                                Password
                            </label>
                        </div>
                        <div className="relative z-0 w-full group">
                            <input
                                type="password"
                                name="repeat_password"
                                id="floating_repeat_password"
                                placeholder=" "
                                required
                                className="block py-2.5 w-full text-sm bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                            />
                            <label
                                htmlFor="floating_repeat_password"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-black peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100"
                            >
                                Confirm Password
                            </label>
                        </div>
                    </div>

                    <div className="relative z-0 w-full group">
                        <input
                            type="tel"
                            pattern="[6-9][0-9]{9}"
                            name="floating_phone"
                            id="floating_phone"
                            placeholder=" "
                            required
                            className="block py-2.5 w-full text-sm bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                        />
                        <label
                            htmlFor="floating_phone"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-black peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100"
                        >
                            Phone Number
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-900 transition"
                    >
                        Sign Up
                    </button>
                </form>
            </motion.div>
        </FormLayout>
    );
}

export default SignUp;
