import React from 'react';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';

export default function BrowsePage() {
  const questions = [
    {
      title: 'How to join 2 columns in SQL?',
      description: 'Need help joining first and last name into full name.',
      tags: ['SQL', 'Database'],
      username: 'nachiketh_op',
      answerCount: 2,
    },
    {
      title: 'React JWT login not persisting',
      description: 'JWT token disappears on refresh. Any fix?',
      tags: ['React', 'JWT'],
      username: 'manideep_sudo',
      answerCount: 3,
    },
    {
      title: 'CSS transition delay not working',
      description: 'Tailwind transition delay isn’t working on hover.',
      tags: ['CSS', 'Tailwind'],
      username: 'varshith_dev',
      answerCount: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-dark dark:text-white font-pop">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-sky-400 mb-6 animate-fadeInScale">
          Browse Questions
        </h1>
        <section className="space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="animate-fadeInScale transition duration-500 ease-in-out">
              <QuestionCard {...q} />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

