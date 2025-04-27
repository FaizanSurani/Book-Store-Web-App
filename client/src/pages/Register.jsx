import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { username, email, password, address } = formData;
  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        username === "" ||
        email === "" ||
        password === "" ||
        address === ""
      ) {
        alert("All fields are necessary");
      } else {
        const res = await axios.post(
          "https://book-store-web-app-gl7e.onrender.com/api/v1/sign-up",
          {
            username,
            email,
            password,
            address,
          }
        );
        alert(res.data.message);
        console.log(res);
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="h-auto bg-zinc-900 py-8 flex justify-center items-center">
        <form
          className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6"
          onSubmit={onSubmit}>
          <h1 className="text-zinc-200 text-xl">Register</h1>
          <div className="mt-4">
            <div>
              <label htmlFor="username" className="text-zinc-400">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                className="w-full bg-zinc-900 mt-2 text-zinc-100 p-2 outline-none"
                onChange={onChange}
                required
              />
            </div>
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
              <label htmlFor="address" className="text-zinc-400">
                Address
              </label>
              <textarea
                name="address"
                value={address}
                rows="5"
                className="w-full bg-zinc-900 mt-2 text-zinc-100 p-2 outline-none"
                onChange={onChange}
                required
              />
            </div>
            <div className="mt-4">
              <button className="bg-blue-500 w-full font-semibold px-7 py-3 uppercase text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out">
                Register
              </button>
            </div>
            <p className="flex mt-4 justify-center items-center text-zinc-200 font-semibold">
              Or
            </p>
            <p className="flex mt-4 justify-center items-center text-zinc-200 font-semibold">
              Already have an account? &nbsp;
              <Link to="/login" className="hover:text-blue-500">
                <u>Login</u>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
