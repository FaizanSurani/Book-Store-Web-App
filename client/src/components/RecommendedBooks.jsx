import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import axios from "axios";
import BookCard from "./BookCard";

export const RecommendedBooks = () => {
  const [recBooks, setRecBooks] = useState([]);
  const id = localStorage.getItem("id");

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await axios.get(
        `https://book-store-web-app-gl7e.onrender.com/api/v1/recommendation_api/${id}`
      );
      console.log(res.data.recommended_products);
      setRecBooks(res.data.recommended_products);
    };
    fetchBooks();
  }, [id]);

  return (
    <>
      <div className="bg-zinc-900 h-screen">
        <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
          Your Recommended Books
        </h1>
        {!recBooks && (
          <div className="flex items-center justify-center my-8">
            <Loader />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recBooks &&
            recBooks.map((items, i) => (
              <div key={i}>
                <BookCard data={items} />
              </div>
            ))}
        </div>
        {recBooks.length === 0 && (
          <div className="h-[80vh] p-4 text-zinc-100">
            <div className="h-[100%] flex flex-col items-center justify-center">
              <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
                No Recommended Books
              </h1>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
