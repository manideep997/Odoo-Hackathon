import React from "react";

const AskQuestion = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/express.png')" }}
    >
      <div className="bg-[#222] text-white p-8 sm:p-10 rounded-2xl w-[90%] max-w-xl shadow-lg animate-fadeInScale">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">StackIt</h2>
          <nav className="flex items-center space-x-4">
            <a href="#" className="font-bold hover:underline">
              Home
            </a>
            <div
              className="w-9 h-9 rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')",
              }}
            />
          </nav>
        </div>

        {/* Form */}
        <form>
          {/* Title */}
          <label className="flex items-center font-semibold mt-4 mb-1" htmlFor="title">
            <img src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png" alt="title" className="w-5 mr-2" />
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter your question title"
            className="w-full p-3 bg-[#111] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-400 transition"
          />

          {/* Description */}
          <label className="flex items-center font-semibold mt-6 mb-1" htmlFor="description">
            <img src="https://cdn-icons-png.flaticon.com/512/1250/1250620.png" alt="desc" className="w-5 mr-2" />
            Description
          </label>

          {/* Toolbar */}
          <div className="flex gap-2 bg-[#222] p-2 rounded mb-2">
            <button type="button" className="bg-[#637e4c] hover:bg-red-500 px-3 py-1 rounded text-sm font-bold">
              B
            </button>
            <button type="button" className="bg-[#637e4c] hover:bg-red-500 px-3 py-1 rounded text-sm italic">
              I
            </button>
            <button type="button" className="bg-[#637e4c] hover:bg-red-500 px-3 py-1 rounded text-sm underline">
              U
            </button>
            <button type="button" className="bg-[#637e4c] hover:bg-red-500 px-3 py-1 rounded text-sm">
              • List
            </button>
            <button type="button" className="bg-[#637e4c] hover:bg-red-500 px-3 py-1 rounded text-sm">
              1. List
            </button>
            <button type="button" className="bg-[#637e4c] hover:bg-red-500 px-3 py-1 rounded text-sm">
              {'{ }'}
            </button>
          </div>

          <textarea
            id="description"
            rows="6"
            placeholder="Explain your question..."
            className="w-full p-3 bg-[#111] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-400 transition resize-y"
          ></textarea>

          {/* Tags */}
          <label className="flex items-center font-semibold mt-6 mb-1" htmlFor="tags">
            <img src="https://cdn-icons-png.flaticon.com/512/2230/2230646.png" alt="tags" className="w-5 mr-2" />
            Tags
          </label>
          <input
            type="text"
            id="tags"
            placeholder="e.g., javascript, html, css"
            className="w-full p-3 bg-[#111] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-400 transition"
          />

          <button
            type="submit"
            className="mt-6 w-full bg-[#c0392b] hover:bg-[#e74c3c] text-white font-bold py-3 rounded-lg transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;