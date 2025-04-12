import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

export default function Settings() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    address: "",
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:5000/api/v1/getUser", {
        headers,
      });
      setValues({
        username: res.data.username,
        email: res.data.email,
        address: res.data.address,
      });
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const changeDetails = async () => {
    const res = await axios.put(
      "http://localhost:5000/api/v1/updateProfile",
      values,
      { headers }
    );
    alert(res.data.message);
  };

  return (
    <>
      {!values && (
        <div className="h-[100%] w-full flex justify-center items-center">
          <Loader />
        </div>
      )}
      {values && (
        <div className="h-screen p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Settings
          </h1>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <label htmlFor="">Username</label>
              <input
                className="p-2 rounded bg-zinc-800 mt-2 font-semibold"
                name="name"
                value={values.username}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Email</label>
              <input
                className="p-2 rounded bg-zinc-800 mt-2 font-semibold"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Password</label>
              <input
                className="p-2 rounded bg-zinc-800 mt-2 font-semibold"
                name="password"
                type="password"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <label htmlFor="">Address</label>
            <textarea
              className="p-2 rounded bg-zinc-800 mt-2 font-semibold"
              placeholder="Address"
              name="address"
              rows="5"
              value={values.address}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-black font-semibold px-3 py-2 hover:bg-blue-400 rounded transition duration-150 ease-in-out"
              onClick={changeDetails}>
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
}
