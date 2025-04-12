import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function MobileNav() {
  const { role } = useContext(AuthContext);

  return (
    <>
      {role === "user" && (
        <div className="w-full flex md:hidden justify-between items-center my-8">
          <Link
            to="/profile"
            className="text-zinc-100 w-full font-semibold py-2 text-center hover:bg-zinc-900 rounded transition duration-150 ease-in-out">
            Favourites
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-zinc-100 w-full font-semibold py-2 text-center hover:bg-zinc-900 rounded transition duration-150 ease-in-out">
            Order History
          </Link>
          <Link
            to="/profile/settings"
            className="text-zinc-100 w-full font-semibold py-2 text-center hover:bg-zinc-900 rounded transition duration-150 ease-in-out">
            Settings
          </Link>
          <Link
            to="/profile/recommendations"
            className="text-zinc-100 w-full font-semibold py-2 text-center hover:bg-zinc-900 rounded transition duration-150 ease-in-out">
            Recommended Books
          </Link>
        </div>
      )}
      {role === "admin" && (
        <div className="w-full flex md:hidden justify-between items-center my-8">
          <Link
            to="/profile"
            className="text-zinc-100 w-full font-semibold py-2 text-center hover:bg-zinc-900 rounded transition duration-150 ease-in-out">
            All Orders
          </Link>
          <Link
            to="/profile/addBooks"
            className="text-zinc-100 w-full font-semibold py-2 text-center hover:bg-zinc-900 rounded transition duration-150 ease-in-out">
            Add Books
          </Link>
        </div>
      )}
    </>
  );
}
