import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import UserData from "./UserData";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [options, setOptions] = useState(-1);
  const [values, setValues] = useState({ status: "" });
  const [userDiv, setUserDiv] = useState("hidden");
  const [userDivData, setUserDivData] = useState();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/allOrders",
        { headers }
      );
      setOrders(response.data.data);
      console.log(response.data.data);
    };
    fetch(orders);
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (i) => {
    const id = orders[i]._id;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/updateStatus/${id}`,
        values,
        { headers }
      );
      alert(res.data.message);
      setOrders((prevOrders) =>
        prevOrders.map((order, index) =>
          index === i ? { ...order, status: values.status } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <>
      {!orders && (
        <div className="h-[100%] flex justify-center items-center">
          <Loader />
        </div>
      )}
      {orders && (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            All Orders
          </h1>
          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%]">
              <h1 className="text-center">Sr.</h1>
            </div>

            <div className="w-[22%]">
              <h1>Books</h1>
            </div>

            <div className="w-[45%]">
              <h1>Description</h1>
            </div>

            <div className="w-[9%]">
              <h1>Price</h1>
            </div>

            <div className="w-[16%]">
              <h1>Status</h1>
            </div>

            <div className="w-none md:w-[5%] hidden md:block">
              <h1>Mode</h1>
            </div>
          </div>
          {orders.map((items, i) => (
            <div
              key={i}
              className="bg-zinc-800 w-full rounded px-4 py-2 flex gap-2 hover:bg-zinc-900 hover:cursor-pointer transition duration-150 ease-in-out">
              <div className="w-[3%]">
                <h1 className="text-center">{i + 1}</h1>
              </div>
              <div className="w-[40%] md:w-[22%]">
                <Link
                  to={`/view-book-details/${items.books._id}`}
                  className="hover:text-blue-300">
                  {items.books.title}
                </Link>
              </div>
              <div className="w-0 md:w-[45%] hidden md:block">
                <h1>{items.books.description.slice(0, 50)} ...</h1>
              </div>
              <div className="w-[17%] md:w-[9%]">
                <h1>&#8377; {items.books.price}</h1>
              </div>
              <div className="w-[30%] md:w-[16%]">
                <h1 className="font-semibold">
                  <button
                    className="hover:scale-105 transition duration-150"
                    onClick={() => setOptions(i)}>
                    {items.status === "Order Placed" ? (
                      <div className="text-yellow-500">{items.status}</div>
                    ) : items.status === "Cancelled" ? (
                      <div className="text-red-500">{items.status}</div>
                    ) : (
                      <div className="text-green-500">{items.status}</div>
                    )}
                  </button>
                  <div
                    className={`${
                      options === i ? "block" : "hidden"
                    } flex mt-4`}>
                    <select
                      name="status"
                      value={values.status}
                      className="bg-gray-800"
                      onChange={handleChange}>
                      {[
                        "Order Placed",
                        "Out for Delivery",
                        "Delivered",
                        "Cancelled",
                      ].map((items, i) => (
                        <option value={items} key={i}>
                          {items}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-green-500 hover:text-pink-600 mx-2"
                      onClick={() => {
                        setOptions(-1);
                        handleSubmit(i);
                      }}>
                      <FaCheck />
                    </button>
                  </div>
                </h1>
              </div>
              <div className="w-[10%] md:w-[5%]">
                <button
                  className="text-xl hover:text-orange-500"
                  onClick={() => {
                    setUserDiv("fixed");
                    setUserDivData(items.user);
                  }}>
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {userDivData && (
        <UserData
          userDivData={userDivData}
          userDiv={userDiv}
          setUserDiv={setUserDiv}
        />
      )}
    </>
  );
}
