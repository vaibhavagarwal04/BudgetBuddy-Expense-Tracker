import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../components/FormLayOut";
import supabase from "../../supabase-client";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import loginIllustration from "../assets/Mobile login-cuate.svg";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) setErrorMsg(error.message);
        else navigate("/dashboard");
    };

    return (
        <FormLayout>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto" 
                onClick={() => navigate("/")}
            >
                <form
                    onSubmit={handleSubmit}onClick={(e) => e.stopPropagation()} className="w-full md:w-1/2"
                >
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                        Welcome Back 👋
                    </h2>

                    {errorMsg && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            {errorMsg}
                        </p>
                    )}

                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="mb-2 relative">
                        <label
                            htmlFor="password"
                            className="block text-gray-600 text-sm font-medium mb-2"
                        >
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-10 text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="text-right mb-6">
                        <a
                            href="#"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition duration-200"
                    >
                        Log In
                    </button>
                </form>

                <div className="w-full md:w-1/2">
                    <img
                        src={loginIllustration}
                        alt="Login Illustration"
                        className="w-full max-w-md mx-auto"
                    />
                </div>
            </motion.div>
        </FormLayout>
    );
}

export default Login;
