import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import BookCard from "../components/BookCard";

export default function AllBooks() {
  const [allBooks, setAllBooks] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        "https://book-store-web-app-3.onrender.com/api/v1/getAllBooks"
      );
      console.log(res.data.data);
      setAllBooks(res.data.data);
    };
    fetch();
  }, []);

  return (
    <>
      <div className="bg-zinc-900 h-screen px-12 py-8">
        <h4 className="text-3xl text-yellow-100">All Books</h4>
        {!allBooks && (
          <div className="flex items-center justify-center my-8">
            <Loader />
          </div>
        )}
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {allBooks &&
            allBooks.map((items, i) => (
              <div key={i}>
                <BookCard data={items} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
