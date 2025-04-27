import axios from "axios";
import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [values, setValues] = useState({ password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { password } = values;
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://book-store-web-app-gl7e.onrender.com/api/v1/resetPassword/${token}`,
        { password: password }
      );
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="h-screen bg-zinc-900 px-12 py-8 flex justify-center items-center">
        <form
          className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6"
          onSubmit={onSubmit}>
          <h1 className="text-zinc-200 text-xl">Reset Password</h1>
          <div className="mt-4">
            <label htmlFor="password" className="text-zinc-400">
              Password
            </label>
            <div className="flex gap-2 items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                className="w-full bg-zinc-900 mt-2 text-zinc-100 p-2 outline-none"
                onChange={onChange}
                required
              />
              <div
                className="cursor-pointer mt-2"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <IoEyeOutline className="text-white h-7 w-7" />
                ) : (
                  <IoEyeOffOutline className="text-white h-7 w-7" />
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-blue-500 w-full font-semibold px-7 py-3 uppercase text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
