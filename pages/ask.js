import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";

export default function AskQuestion() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/ask");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters long";
    } else if (formData.title.length > 150) {
      newErrors.title = "Title must be less than 150 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters long";
    }

    if (!formData.tags.trim()) {
      newErrors.tags = "At least one tag is required";
    } else {
      const tagList = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      if (tagList.length === 0) {
        newErrors.tags = "At least one tag is required";
      } else if (tagList.length > 5) {
        newErrors.tags = "Maximum 5 tags allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const tagList = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const questionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: tagList,
      };

      const response = await apiService.createQuestion(questionData);

      // Redirect to the new question
      if (response.question && response.question._id) {
        router.push(`/question/${response.question._id}`);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      setErrors({
        submit: error.message || "Failed to create question. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatText = (type) => {
    const textarea = document.getElementById("description");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);

    let newText = formData.description;

    switch (type) {
      case "bold":
        newText =
          formData.description.substring(0, start) +
          `**${selectedText}**` +
          formData.description.substring(end);
        break;
      case "italic":
        newText =
          formData.description.substring(0, start) +
          `*${selectedText}*` +
          formData.description.substring(end);
        break;
      case "code":
        newText =
          formData.description.substring(0, start) +
          `\`${selectedText}\`` +
          formData.description.substring(end);
        break;
      case "codeblock":
        newText =
          formData.description.substring(0, start) +
          `\n\`\`\`\n${selectedText}\n\`\`\`\n` +
          formData.description.substring(end);
        break;
    }

    setFormData((prev) => ({ ...prev, description: newText }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-500 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ask a Question ✍️
          </h1>
          <p className="text-lg text-white/90">
            Get help from our community of developers
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    📝 Question Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`input ${
                      errors.title
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="e.g., How to join two columns in SQL and create a third column?"
                    maxLength={150}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.title && (
                      <p className="text-red-500 text-sm">{errors.title}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {formData.title.length}/150
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    📖 Detailed Description
                  </label>

                  {/* Formatting Toolbar */}
                  <div className="flex gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <button
                      type="button"
                      onClick={() => formatText("bold")}
                      className="px-3 py-1 text-sm font-bold bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText("italic")}
                      className="px-3 py-1 text-sm italic bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText("code")}
                      className="px-3 py-1 text-sm font-mono bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors"
                      title="Inline Code"
                    >
                      {"</>"}
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText("codeblock")}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors"
                      title="Code Block"
                    >
                      {"{ }"}
                    </button>
                  </div>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={8}
                    className={`input resize-y ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="Provide detailed information about your question. Include what you've tried, expected results, and any error messages..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {formData.description.length} characters
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    🏷️ Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className={`input ${
                      errors.tags
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="javascript, react, html, css (separate with commas)"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.tags && (
                      <p className="text-red-500 text-sm">{errors.tags}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {
                        formData.tags.split(",").filter((tag) => tag.trim())
                          .length
                      }
                      /5 tags
                    </p>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-4 h-4"></div>
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Publish Question</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Guidelines */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Writing Guidelines 📝
                </h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Be specific and clear in your title</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Include relevant code examples</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Describe what you've already tried</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Use appropriate tags</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Provide expected vs actual results</span>
                  </div>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Popular Tags 🏷️
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "javascript",
                    "react",
                    "python",
                    "html",
                    "css",
                    "node.js",
                    "sql",
                    "git",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const currentTags = formData.tags
                          ? formData.tags
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t)
                          : [];
                        if (!currentTags.includes(tag)) {
                          setFormData((prev) => ({
                            ...prev,
                            tags:
                              currentTags.length > 0
                                ? `${prev.tags}, ${tag}`
                                : tag,
                          }));
                        }
                      }}
                      className="tag text-xs"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Pro Tips 💡
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Search before asking to avoid duplicates</p>
                  <p>• Include error messages if any</p>
                  <p>• Format code using the toolbar</p>
                  <p>• Be patient for quality answers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
