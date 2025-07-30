import React from "react";
import FormLayout from "../components/FormLayOut";
import { Navigate, useNavigate } from "react-router-dom";
import supabase from "../../supabase-client";

function SignUp() {
    const navigate = useNavigate();

    const HandleSignUp = async (e) => {
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

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                },
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
            <div className=" relative max-w-md mx-auto border-1 rounded-4xl p-4 px-4 ">
                <button
                    onClick={() => navigate(-1)}
                    className="text-2xl absolute top-3 right-4"
                >
                    &times;
                </button>
                <form onSubmit={HandleSignUp}>
                    <h2 className="text-2xl font-bold text-center mb-6 text-black">
                        Sign Up
                    </h2>
                    <div class="relative z-0 mb-5 w-full group ">
                        <input
                            type="email"
                            name="floating_email"
                            id="floating_email"
                            class="block py-2.5  w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                        />
                        <label
                            for="floating_email"
                            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                        >
                            Email address
                        </label>
                    </div>
                    <div class="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="floating_password"
                            id="floating_password"
                            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                        />
                        <label
                            for="floating_password"
                            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                        >
                            Password
                        </label>
                    </div>
                    <div class="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="repeat_password"
                            id="floating_repeat_password"
                            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                            placeholder=" "
                            required
                        />
                        <label
                            for="floating_repeat_password"
                            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                        >
                            Confirm password
                        </label>
                    </div>
                    <div class="grid md:grid-cols-2 md:gap-6">
                        <div class="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="floating_first_name"
                                id="floating_first_name"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                                placeholder=" "
                                required
                            />
                            <label
                                for="floating_first_name"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                            >
                                First name
                            </label>
                        </div>
                        <div class="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="floating_last_name"
                                id="floating_last_name"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                                placeholder=" "
                                required
                            />
                            <label
                                for="floating_last_name"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                            >
                                Last name
                            </label>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 md:gap-6">
                        <div class="relative z-0 w-full mb-5 group">
                            <input
                                type="tel"
                                pattern="[6-9][0-9]{9}"
                                name="floating_phone"
                                id="floating_phone"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                                placeholder=" "
                                required
                            />
                            <label
                                for="floating_phone"
                                class="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                            >
                                Phone number
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        class="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </FormLayout>
    );
}

export default SignUp;
