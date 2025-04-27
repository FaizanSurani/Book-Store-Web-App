import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function UpdateBooks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    description: "",
    language: "",
  });

  const { url, title, author, price, description, language } = bookData;

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("authToken")}`,
    bookid: id,
  };

  useEffect(() => {
    const bookdetails = async () => {
      const resp = await axios.get(
        `https://book-store-web-app-gl7e.onrender.com/api/v1/bookid/${id}`
      );
      setBookData(resp.data.data);
    };
    bookdetails();
  }, []);

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
    try {
      if (
        url === "" ||
        title === "" ||
        author === "" ||
        price === "" ||
        description === "" ||
        language === ""
      ) {
        alert("All Fields are required");
      } else {
        const response = await axios.put(
          "https://book-store-web-app-gl7e.onrender.com/api/v1/updateBook",
          {
            url,
            title,
            author,
            price,
            description,
            language,
          },
          { headers }
        );
        setBookData({
          url: "",
          title: "",
          author: "",
          price: "",
          description: "",
          language: "",
        });
        alert(response.data.message);
        navigate(`/view-book-details/${id}`);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="h-[100%] p-0 md:p-4 bg-zinc-900">
        <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
          Update Book
        </h1>
        <div className="bg-zinc-800 p-4 rounded">
          <div>
            <label htmlFor="" className="text-zinc-400">
              Image
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              name="url"
              required
              value={url}
              placeholder="Enter Url"
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
              Title
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 rounded text-zinc-100 p-2 outline-none"
              required
              value={title}
              placeholder="Enter Book Title"
              onChange={handleChange}
              name="title"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
              Author
            </label>
            <input
              type="text"
              required
              className="w-full mt-2 bg-zinc-900 rounded text-zinc-100 p-2 outline-none"
              value={author}
              name="author"
              onChange={handleChange}
              placeholder="Enter Author Name"
            />
          </div>
          <div className="mt-4 flex gap-4">
            <div className="w-3/6">
              <label htmlFor="" className="text-zinc-400">
                Language
              </label>
              <input
                type="text"
                required
                className="w-full mt-2 bg-zinc-900 rounded text-zinc-100 p-2 outline-none"
                value={language}
                name="language"
                onChange={handleChange}
                placeholder="Enter Book Language"
              />
            </div>
            <div className="w-3/6">
              <label htmlFor="" className="text-zinc-400">
                Price
              </label>
              <input
                type="text"
                required
                className="w-full mt-2 bg-zinc-900 rounded text-zinc-100 p-2 outline-none"
                value={price}
                name="price"
                onChange={handleChange}
                placeholder="Enter Book Price"
              />
            </div>
          </div>
          <div className="mt-4 ">
            <label htmlFor="" className="text-zinc-400">
              Description
            </label>
            <textarea
              required
              rows="5"
              className="w-full mt-2 bg-zinc-900 rounded text-zinc-100 p-2 outline-none"
              value={description}
              name="description"
              onChange={handleChange}
              placeholder="Enter Book Description"
            />
          </div>
          <button
            className="mt-4 px-3 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-150 ease-in-out"
            onClick={handleClick}>
            Update Book
          </button>
        </div>
      </div>
    </>
  );
}
