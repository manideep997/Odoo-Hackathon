import React, { useState, useEffect } from "react";
import apiService from "../services/api";

export default function FilterBar({ onFilterChange, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("newest");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPopularTags();
  }, []);

  const fetchPopularTags = async () => {
    try {
      const response = await apiService.getPopularTags(10);
      setTags(response.tags || []);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleTagToggle = (tagName) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter((t) => t !== tagName)
      : [...selectedTags, tagName];

    setSelectedTags(newSelectedTags);

    if (onFilterChange) {
      onFilterChange(selectedFilter, newSelectedTags);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
    setSelectedFilter("newest");
    if (onFilterChange) {
      onFilterChange("newest", []);
    }
    if (onSearch) {
      onSearch("");
    }
  };

  const filterOptions = [
    { key: "newest", label: "Newest", icon: "🕒" },
    { key: "unanswered", label: "Unanswered", icon: "❓" },
    { key: "popular", label: "Popular", icon: "🔥" },
    { key: "votes", label: "Most Votes", icon: "👍" },
  ];

  return (
    <div className="card p-6 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pr-12"
            placeholder="Search questions, answers, or tags..."
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner w-5 h-5"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleFilterClick(option.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedFilter === option.key
                ? "bg-primary-600 text-white shadow-lg transform scale-105"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Popular Tags */}
      {tags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Popular Tags
            </h3>
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.name || tag._id}
                onClick={() => handleTagToggle(tag.name)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTags.includes(tag.name)
                    ? "bg-primary-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                #{tag.name}
                {tag.questionCount && (
                  <span className="ml-1 text-xs opacity-75">
                    ({tag.questionCount})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
