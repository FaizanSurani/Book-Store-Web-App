import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://book-store-web-app-gl7e.onrender.com/api/v1/orderHistory",
          {
            headers,
          }
        );
        setOrders(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="h-screen bg-zinc-900 px-8 py-4">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : orders.length === 0 ? (
        <div className="h-full flex justify-center items-center">
          <h1 className="text-5xl font-semibold text-zinc-500">
            No Order History
          </h1>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Your Order History
          </h1>
          <div className="overflow-auto">
            <div className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
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
              <div className="w-[5%] hidden md:block">
                <h1>Mode</h1>
              </div>
            </div>
            {orders.map((item, index) => (
              <div
                key={item._id}
                className="bg-zinc-800 w-full rounded py-2 px-4 mt-2 flex gap-4 hover:bg-zinc-900 cursor-pointer transition duration-150 ease-in-out">
                <div className="w-[3%]">
                  <h1 className="text-center">{index + 1}</h1>
                </div>
                <div className="w-[22%]">
                  <Link
                    to={`/view-book-details/${item.Book?._id}`}
                    className="hover:text-blue-300">
                    {item.Book?.title}
                  </Link>
                </div>
                <div className="w-[45%]">
                  <h1>
                    {item.Book?.description.length > 50
                      ? item.Book?.description.slice(0, 50) + "..."
                      : item.Book?.description}
                  </h1>
                </div>
                <div className="w-[9%]">
                  <h1>&#8377; {item.Book?.price}</h1>
                </div>
                <div className="w-[16%]">
                  <h1
                    className={`font-semibold ${
                      item.status === "Order Placed"
                        ? "text-yellow-500"
                        : item.status === "Cancelled"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}>
                    {item.status}
                  </h1>
                </div>
                <div className="w-[5%] hidden md:block">
                  <h1 className="text-sm text-zinc-400">COD</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
