import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import QuestionCard from "../components/QuestionCard";
import Pagination from "../components/Pagination";
import apiService from "../services/api";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
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

      {/* Hero Section */}
      <section className="hero-bg py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-500/20"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow-lg animate-slideInFromTop">
            Welcome to <span className="gradient-text">StackIt</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto text-shadow animate-slideInFromTop">
            Your premier destination for programming questions, expert answers,
            and collaborative problem-solving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideInFromTop">
            <a href="/ask" className="btn-primary text-lg px-8 py-3">
              🚀 Ask Your First Question
            </a>
            <a href="/browse" className="btn-secondary text-lg px-8 py-3">
              🔍 Explore Questions
            </a>
          </div>
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
            {/* Stats Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {filters.search
                  ? `Search results for "${filters.search}"`
                  : "Latest Questions"}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {pagination.total} question{pagination.total !== 1 ? "s" : ""}{" "}
                found
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="spinner w-8 h-8 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading questions...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="card p-6 text-center">
                <div className="text-red-500 dark:text-red-400 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
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
                  <p className="text-lg font-semibold">
                    Oops! Something went wrong
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {error}
                  </p>
                </div>
                <button onClick={fetchQuestions} className="btn-primary">
                  Try Again
                </button>
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
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <QuestionCard {...question} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
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
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        No questions found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {filters.search || filters.tags.length > 0
                          ? "Try adjusting your search or filters."
                          : "Be the first to ask a question!"}
                      </p>
                      <a href="/ask" className="btn-primary">
                        Ask the First Question
                      </a>
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
              {/* Welcome Card */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Welcome to StackIt! 👋
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Join our community of developers helping each other solve
                  problems.
                </p>
                <a href="/ask" className="btn-primary w-full text-center">
                  Ask Your Question
                </a>
              </div>

              {/* Stats Card */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Community Stats 📊
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Questions
                    </span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {pagination.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Active Users
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ∞
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Answers
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      ∞
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Tips for Success 💡
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Be specific in your questions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Include code examples</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Tag appropriately</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Vote helpful answers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
