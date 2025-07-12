// pages/question.js
import React from 'react';
import Navbar from '../components/Navbar';

export default function QuestionDetails() {
  const question = {
    title: 'How to join 2 columns in SQL and make a third column?',
    description:
      'I want to create a new fullName column by joining firstName and lastName. What is the best SQL syntax for this?',
    tags: ['SQL', 'Beginner'],
    username: 'nachiketh_op',
    postedAt: '2 hours ago',
  };

  const answers = [
    {
      username: 'manideep_sudo',
      answerText:
        "In MySQL, use `CONCAT(firstName, ' ', lastName)`. In PostgreSQL, try `firstName || ' ' || lastName`.",
      votes: 4,
      isAccepted: true,
    },
    {
      username: 'varshith_dev',
      answerText:
        "Use `CONCAT_WS(' ', firstName, lastName)` — it's cleaner and avoids NULL issues.",
      votes: 2,
      isAccepted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        {/* QUESTION CARD */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">{question.title}</h1>
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">{question.description}</p>

          <div className="flex flex-wrap gap-3 mb-3">
            {question.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-500 italic">
            Posted by <span className="font-medium">@{question.username}</span> • {question.postedAt}
          </div>
        </div>

        {/* ANSWERS SECTION */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Answers ({answers.length})</h2>

          {answers.map((ans, i) => (
            <div
              key={i}
              className={`bg-white border p-5 rounded-lg shadow-md ${
                ans.isAccepted ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              <p className="text-gray-800 text-base leading-relaxed mb-3">
                {ans.answerText}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>By <span className="font-medium">@{ans.username}</span></div>
                <div className="flex gap-4 items-center">
                  <span className="text-blue-600 font-medium">⬆️ {ans.votes}</span>
                  {ans.isAccepted && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      ✔ Accepted Answer
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
