import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import QuestionCard from "../components/QuestionCard";
import Pagination from "../components/Pagination";
import apiService from "../services/api";

export default function BrowsePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    sort: "newest",
    tags: [],
    search: "",
  });

  useEffect(() => {
    fetchQuestions();
  }, [pagination.page, filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: filters.sort,
      };

      if (filters.search) {
        params.q = filters.search;
      }

      if (filters.tags.length > 0) {
        params.tags = filters.tags.join(",");
      }

      const response = await apiService.getQuestions(params);
      setQuestions(response.questions || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0,
      }));
    } catch (err) {
      setError(err.message || "Failed to fetch questions");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (sort, tags = []) => {
    setFilters((prev) => ({
      ...prev,
      sort,
      tags,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (searchQuery) => {
    setFilters((prev) => ({
      ...prev,
      search: searchQuery,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-500 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slideInFromTop">
            Browse All Questions 🔍
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slideInFromTop">
            Explore our vast collection of programming questions and find the
            answers you need.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter and Search */}
        <FilterBar
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {filters.search
                    ? `Search: "${filters.search}"`
                    : "All Questions"}
                </h2>
                {filters.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Filtered by:
                    </span>
                    {filters.tags.map((tag) => (
                      <span key={tag} className="tag text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {pagination.total} question{pagination.total !== 1 ? "s" : ""}{" "}
                  found
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1}-
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="spinner w-10 h-10 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Searching for questions...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="card p-8 text-center">
                <div className="text-red-500 dark:text-red-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {error}
                  </p>
                  <button onClick={fetchQuestions} className="btn-primary">
                    🔄 Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Questions List */}
            {!loading && !error && (
              <>
                {questions.length > 0 ? (
                  <div className="space-y-0">
                    {questions.map((question, index) => (
                      <div
                        key={question._id || index}
                        className="animate-slideInFromLeft"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <QuestionCard {...question} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-16 text-center">
                    <div className="text-gray-400 dark:text-gray-500">
                      <svg
                        className="w-20 h-20 mx-auto mb-6"
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
                      <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        No questions found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        {filters.search || filters.tags.length > 0
                          ? "Try adjusting your search criteria or filters to find more results."
                          : "No questions have been posted yet. Be the first to start the conversation!"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/ask" className="btn-primary">
                          ✍️ Ask a Question
                        </a>
                        {(filters.search || filters.tags.length > 0) && (
                          <button
                            onClick={() => {
                              setFilters({
                                sort: "newest",
                                tags: [],
                                search: "",
                              });
                              setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                            className="btn-secondary"
                          >
                            🔄 Clear Filters
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Search Tips */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Search Tips 🔍
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-500">•</span>
                    <span>Use specific keywords</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-500">•</span>
                    <span>Filter by popular tags</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-500">•</span>
                    <span>Sort by newest or most voted</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-500">•</span>
                    <span>Look for unanswered questions</span>
                  </li>
                </ul>
              </div>

              {/* Browse Stats */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Browse Stats 📈
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Questions
                    </span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {pagination.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Current Page
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {pagination.page} / {pagination.pages}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Results/Page
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {pagination.limit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Quick Actions ⚡
                </h3>
                <div className="space-y-3">
                  <a href="/ask" className="btn-primary w-full text-center">
                    ✍️ Ask Question
                  </a>
                  <a href="/" className="btn-ghost w-full text-center">
                    🏠 Back to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
