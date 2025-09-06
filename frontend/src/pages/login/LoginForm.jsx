import React, { useState } from 'react'
import loginbg from '../../assets/images/login-image.png';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


const app_name = import.meta.env.VITE_APP_NAME;
const api_url = import.meta.env.VITE_API_URL;

const LoginForm = () => {
    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const result = await axios.post(`${api_url}/login`, data);
            login(result.data.token);
            reset();
            navigate("/dashboard");
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="flex w-screen h-screen bg-[#f1f0ff]">
            <div
                className="w-3/5 h-full bg-contain bg-center bg-no-repeat relative z-20 hidden sm:block"
                style={{ backgroundImage: `url(${loginbg})` }}
            ></div>

            <div className="sm:w-2/5 w-full h-full flex items-center justify-center relative md:-ml-16 z-20">
                <div className='bg-white p-2 rounded-lg  p-5 min-h-[400px] py-10 ' >
                    <h4 className="flex items-center gap-1 text-xl">
                        <img src="/whatsup-logo.png" alt="" className='w-5' />
                        {app_name}
                    </h4 >
                    <h4>Please Log In Continue</h4>
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                        <div className="flex flex-col mb-4 mt-5">
                            <label htmlFor="email" className="mb-2 text-gray-700 font-bold">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter Email"
                                className="input-style focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition"
                                {...register("email", { required: "Email is Required" })}
                            />
                            {
                                errors.email && <p className='text-red-500'>{errors.email.message}</p>
                            }
                        </div>
                        <div className="flex flex-col mt-4 relative">
                            <label htmlFor="password" className="mb-2 text-gray-700 font-bold">
                                Password:
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter Password"
                                    className="w-full pr-10 input-style focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition"
                                    {...register("password", { required: "Password is Required" })}
                                />
                                <span
                                    className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </span>
                            </div>
                            {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
                        </div>

                        <div className='flex justify-end m-2'>
                            <a href="" className='text-blue-500 underline hover:text-blue-600 transition'>Forgot Password?</a>
                        </div>
                        <button
                            disabled={isSubmitting}
                            className="w-75 sm:w-100 px-4 py-2 rounded-lg bg-[#f1f0ff] text-gray-700 font-bold border border-[#f1f0ff] hover:bg-[#e0dfff] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>


    )
}

export default LoginForm
