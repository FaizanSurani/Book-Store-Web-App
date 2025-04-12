import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({ data, favourite }) {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("authToken")}`,
    bookid: data._id,
  };

  const handleRemoveFav = async () => {
    const res = await axios.put(
      "http://localhost:5000/api/v1/deleteFavourites",
      {},
      { headers }
    );
    alert(res.data.message);
  };

  return (
    <>
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-800 rounded p-4 flex flex-col">
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img src={data.url} alt="" className="h-[25vh]" />
          </div>
          <h2 className="mt-4 text-xl text-white font-semibold">
            {data.title}
          </h2>
          <p className="mt-2 font-semibold text-zinc-400">by. {data.author}</p>
          <p className="mt-2 font-semibold text-zinc-200 text-xl">
            &#x20B9; {data.price}
          </p>
        </div>
      </Link>
      {favourite && (
        <button
          onClick={handleRemoveFav}
          className="bg-yellow-50 mt-4 font-semibold px-4 py-2 rounded border border-yellow-500 text-yellow-500">
          Remove
        </button>
      )}
    </>
  );
}
