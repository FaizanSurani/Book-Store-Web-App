import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import Loader from "./Loader";

export default function RecentBooks() {
  const [books, setbooks] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getRecentBooks"
      );
      console.log(response.data.data);
      setbooks(response.data.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="mt-8 px-4">
        <h4 className="text-3xl text-yellow-100">Recently Added</h4>
        {!books && (
          <div className="flex items-center justify-center my-8">
            <Loader />
          </div>
        )}
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {books &&
            books.map((items, i) => (
              <div key={i}>
                <BookCard data={items} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
