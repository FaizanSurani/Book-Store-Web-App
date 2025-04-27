import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;
  const navigate = useNavigate();
  const { login, changeRole } = useContext(AuthContext);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email === "" || password === "") {
        alert("All fields are necessary");
      } else {
        const res = await axios.post(
          "https://book-store-web-app-gl7e.onrender.com/api/v1/login",
          {
            email,
            password,
          }
        );
        login();
        console.log(res);
        changeRole(res.data.role);
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("authToken", res.data.authToken);
        localStorage.setItem("role", res.data.role);
        navigate("/");
      }
    } catch (error) {
      alert(error.res.data.message);
    }
  };

  return (
    <>
      <div className="h-screen bg-zinc-900 px-12 py-8 flex justify-center items-center">
        <form
          className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6"
          onSubmit={onSubmit}>
          <h1 className="text-zinc-200 text-xl">Login</h1>
          <div className="mt-4">
            <label htmlFor="email" className="text-zinc-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              className="w-full bg-zinc-900 mt-2 text-zinc-100 p-2 outline-none"
              onChange={onChange}
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="text-zinc-400">
              Password
            </label>
            <div className="flex gap-2 items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
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
              Login
            </button>
          </div>
          <p className="flex mt-4 justify-center items-center text-zinc-200 font-semibold">
            Or
          </p>

          <p className="flex mt-4 justify-center items-center text-zinc-500 font-semibold">
            Don't have an account? &nbsp;
            <Link to="/register" className="hover:text-blue-500">
              <u>Register</u>
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="flex mt-4 justify-center items-center text-zinc-500 font-semibold">
            <u>Forgot Password?</u>
          </Link>
        </form>
      </div>
    </>
  );
}
