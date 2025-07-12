import Navbar from './Navbar';
import FilterBar from './FilterBar';
import QuestionCard from './QuestionCard';
import Pagination from './Pagination';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import QuestionCard from '../components/QuestionCard';
import Pagination from '../components/Pagination';

export default function Home() {
  const dummyQuestions = [
      title: 'How to join 2 columns in a data set to make a separate column in SQL?',
      description: 'I do not know the code for it as I am a beginner. As an example...',
      tags: ['SQL', 'Beginner'],
      username: 'User1',
      answerCount: 5,
    },
    {
      title: 'Question 2 Title',
      description: 'Question 2 description here...',
      tags: ['React', 'JWT'],
      username: 'User2',
      answerCount: 3,
    },
    {
      title: 'Question 3 Title',
      description: 'Question 3 description here...',
      tags: ['JavaScript'],
      username: 'User3',
      answerCount: 2,
      title: 'How to join 2 columns in SQL and make a third column?',
      description: 'I’m new to SQL and need help combining 2 columns to create a full name column.',
      tags: ['SQL', 'Beginner'],
      username: 'nachiketh_op',
      answerCount: 5,
    },
    {
      title: 'JWT Token not working in React app?',
      description: 'Stored token in localStorage but it disappears after refresh.',
      tags: ['React', 'JWT'],
      username: 'manideep_sudo',
      answerCount: 2,
    },
    {
      title: 'CSS animation delay not working properly',
      description: 'My button animation has a weird delay. Using TailwindCSS...',
      tags: ['CSS', 'Tailwind'],
      username: 'varshith_dev',
      answerCount: 1,
    },
  ];

  return (
    <>
      <Navbar />
      <FilterBar />

      <div className="p-8">
        {dummyQuestions.map((q, index) => (
          <QuestionCard key={index} {...q} />
        ))}

        <Pagination />
      </div>
    </>
  );
}
    <div className="font-pop min-h-screen bg-light text-dark">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4">
        <FilterBar />
        <section className="mt-6">
         {dummyQuestions.map((q, i) => (
            <QuestionCard key={i} {...q} />
          ))}
        </section>
        <Pagination />
      </main>
    </div>
  );
}
