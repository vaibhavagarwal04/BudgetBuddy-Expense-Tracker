import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../components/FormLayOut";
import supabase from "../../supabase-client";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(error) setErrorMsg(error.message);
        else navigate("/dashboard");
    };


    return (
        <FormLayout>
            <form
                className="max-w-md mx-auto p-6 border-1 rounded-2xl shadow-md h-80 w-70"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-black ">
                    Login
                </h2>

                {errorMsg && (
                    <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
                )}

                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="email"
                        name="floating_email"
                        id="floating_email"
                        className="block py-3.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                        placeholder=" "
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label
                        htmlFor="floating_email"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-8"

                    >
                        Email address
                    </label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="password"
                        name="floating_password"
                        id="floating_password"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer "
                        placeholder=" "
                        required
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <label
                        htmlFor="floating_password"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 "
                    >
                        Password
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full text-white bg-black hover:bg-gray-900 focus:ring-2  font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all mt-4"
                >
                    Submit
                </button>
            </form>
        </FormLayout>
    );
}

export default Login;
