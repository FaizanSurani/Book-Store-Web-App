import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Loader from "./Loader";
import { GrLanguage } from "react-icons/gr";
import axios from "axios";
import { FaEdit, FaHeart, FaShoppingCart } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";

export default function BookDetails() {
  const { id } = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const { role } = useContext(AuthContext);
  const [bookDetails, setBookDetails] = useState("");
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("authToken")}`,
    bookid: id,
  };
  const navigate = useNavigate();

  useEffect(() => {
    const bookdetails = async () => {
      const resp = await axios.get(
        `https://book-store-web-app-3.onrender.com/api/v1/bookid/${id}`
      );
      setBookDetails(resp.data.data);
    };
    bookdetails();
  }, []);

  const handleFav = async () => {
    const res = await axios.put(
      "https://book-store-web-app-3.onrender.com/api/v1/addFavourites",
      {},
      { headers }
    );
    alert(res.data.message);
  };

  const handleCart = async () => {
    const res = await axios.put(
      "https://book-store-web-app-3.onrender.com/api/v1/addItems",
      {},
      { headers }
    );
    alert(res.data.message);
  };

  const handleDelete = async () => {
    const response = await axios.delete(
      "https://book-store-web-app-3.onrender.com/api/v1/deleteBook",
      { headers }
    );
    alert(response.data.message);
    navigate("/all-books");
  };

  return (
    <>
      {bookDetails && (
        <div className="px-4 md:px-12 py-8 bg-zinc-900 flex lg:flex-row flex-col gap-8 items-start">
          <div className="lg:w-3/6 w-full">
            <div className="lg:flex-row flex-col bg-zinc-800 rounded p-12 flex justify-around">
              <img
                className="lg:h-[60vh] h-[50vh] rounded"
                src={bookDetails.url}
                alt="/"
              />
              {isLoggedIn === true && role === "user" && (
                <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start lg:mt-0 mt-8">
                  <button
                    className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 text-red-500 flex justify-center items-center"
                    onClick={handleFav}>
                    <FaHeart />
                  </button>
                  <button
                    className="text-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 mt-8 md:mt-0 lg:mt-8 bg-blue-500 flex items-center justify-center"
                    onClick={handleCart}>
                    <FaShoppingCart />
                  </button>
                </div>
              )}
              {isLoggedIn === true && role === "admin" && (
                <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start lg:mt-0 mt-8">
                  <Link
                    to={`/updateBooks/${id}`}
                    className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 flex justify-center items-center">
                    <FaEdit />
                  </Link>
                  <button className="text-red-500 md:mt-0 rounded lg:rounded-full text-4xl lg:text-3xl p-3 mt-8 lg:mt-8 bg-white flex items-center justify-center">
                    <MdOutlineDelete onClick={handleDelete} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 lg:w-3/6 w-full">
            <h1 className="text-4xl text-zinc-300 font-semibold">
              {bookDetails.title}
            </h1>
            <p className="text-zinc-400 mt-1">by {bookDetails.author}</p>
            <p className="text-zinc-500 mt-4 text-xl">
              {bookDetails.description}
            </p>
            <p className="flex mt-4 items-center justify-start text-zinc-400">
              <GrLanguage className="me-3" /> {bookDetails.language}
            </p>
            <p className="mt-4 text-zinc-100 text-3xl font-semibold">
              Price : &#x20B9; {bookDetails.price}
            </p>
          </div>
        </div>
      )}
      {!bookDetails && (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
}
