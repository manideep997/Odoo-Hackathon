import React from "react";
import Link from "next/link";

export default function QuestionCard({
  _id,
  title,
  description,
  tags = [],
  author,
  answerCount = 0,
  voteCount = 0,
  views = 0,
  createdAt,
  isApproved = true,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="card-hover p-6 mb-6 group">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/question/${_id}`}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {title}
            </h2>
          </Link>

          <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
            {truncateDescription(description)}
          </p>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col items-end space-y-2 ml-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <span className="text-primary-600 dark:text-primary-400">👍</span>
              <span>{voteCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-green-600 dark:text-green-400">💬</span>
              <span>{answerCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-blue-600 dark:text-blue-400">👁️</span>
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {/* Author Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 p-0.5">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold">
                {author?.username?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          </div>

          {/* Author Info */}
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {author?.username || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          {!isApproved && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
              Pending
            </span>
          )}
          {answerCount > 0 && (
            <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              {answerCount} {answerCount === 1 ? "Answer" : "Answers"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
