import React from "react";
import img from "../assets/hero.png";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <>
      <div className="h-[75vh] flex items-center justify-center md:flex-row flex-col">
        <div className="w-full md:mb-0 mb-12 lg:w-3/6 flex flex-col items-center lg:items-start justify-center">
          <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 lg:text-left text-center">
            Discover Your Next Great Read
          </h1>
          <p className="mt-4 lg:text-left text-center text-xl text-zinc-300">
            Uncover captivating stories, enriching knowledge, and endless
            inspiration in our curated collection of Books
          </p>
          <div className="mt-8">
            <Link
              to="/all-books"
              className="px-10 py-3 rounded-full text-yellow-100 text-xl lg:text-2xl font-semibold border border-yellow-100 hover:bg-zinc-800">
              Discover More
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center">
          <img src={img} alt="hero" />
        </div>
      </div>
    </>
  );
}
