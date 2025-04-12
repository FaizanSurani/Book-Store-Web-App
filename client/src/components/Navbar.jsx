import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { AuthContext } from "./AuthContext";

export default function Navbar() {
  const links = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "All Books",
      link: "/all-books",
    },
    {
      title: "Cart",
      link: "/cart",
    },
    {
      title: "Profile",
      link: "/profile",
    },
    {
      title: "Admin Profile",
      link: "/profile",
    },
  ];

  const { isLoggedIn, role } = useContext(AuthContext);
  const [navOpen, setNavOpen] = useState("hidden");

  if (isLoggedIn === false) {
    links.splice(2, 3);
  }

  if (isLoggedIn === true && role === "admin") {
    links.splice(3, 1);
  }

  if (isLoggedIn === true && role === "user") {
    links.splice(4, 1);
  }

  return (
    <>
      <nav className="bg-zinc-800 z-50 text-white relative px-7 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://cdn.icon-icons.com/icons2/516/PNG/512/read_book_study_icon-icons.com_51077.png"
            alt="..."
          />
          <h1 className="text-2xl font-semibold">Book Heaven</h1>
        </Link>
        <div className="items-center gap-4 md:flex block">
          <div className="hidden md:flex gap-4">
            {links.map((items, i) => (
              <Link
                className="hover:text-blue-500 transition ease-in-out"
                key={i}
                to={items.link}>
                {items.title}
              </Link>
            ))}
          </div>
          {!isLoggedIn ? (
            <div className="hidden md:flex gap-4">
              <Link
                to="/login"
                className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition duration-150 ease-in-out">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition duration-150 ease-in-out">
                Register
              </Link>
            </div>
          ) : (
            " "
          )}
          <button
            className="md:hidden block text-white text-2xl hover:text-zinc-400"
            onClick={() =>
              navOpen === "hidden" ? setNavOpen("block") : setNavOpen("hidden")
            }>
            <FaGripLines />
          </button>
        </div>
      </nav>
      <div
        className={`${navOpen} bg-zinc-800 absolute top-0 left-0 w-full z-40 h-screen flex flex-col items-center justify-center`}>
        {links.map((items, i) => (
          <Link
            className={`${navOpen} hover:text-blue-500 transition ease-in-out text-white text-4xl font-semibold mb-8`}
            key={i}
            to={items.link}
            onClick={() =>
              navOpen === "hidden" ? setNavOpen("block") : setNavOpen("hidden")
            }>
            {items.title}
          </Link>
        ))}
        {!isLoggedIn ? (
          <>
            <Link
              onClick={() =>
                navOpen === "hidden"
                  ? setNavOpen("block")
                  : setNavOpen("hidden")
              }
              to="/login"
              className={` ${navOpen} px-8 mb-8 py-2 border text-4xl text-white font-semibold border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition duration-150 ease-in-out`}>
              Login
            </Link>
            <Link
              onClick={() =>
                navOpen === "hidden"
                  ? setNavOpen("block")
                  : setNavOpen("hidden")
              }
              to="/register"
              className={` ${navOpen} px-8 py-2 mb-8 text-4xl font-semibold  bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition duration-150 ease-in-out`}>
              Register
            </Link>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
