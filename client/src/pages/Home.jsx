import React from "react";
import Hero from "../components/Hero";
import RecentBooks from "../components/RecentBooks";

export default function Home() {
  return (
    <>
      <div className="bg-zinc-900 text-white px-10 py-8">
        <Hero />
        <RecentBooks />
      </div>
    </>
  );
}
