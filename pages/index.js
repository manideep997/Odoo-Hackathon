import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import QuestionCard from '../components/QuestionCard';
import Pagination from '../components/Pagination';

export default function Home() {
  const dummyQuestions = [
    {
      title: 'How to join 2 columns in SQL and make a third column?',
      description: 'I do not know the code for it as I am a beginner. As an example, I have firstName and lastName columns. I want fullName.',
      tags: ['SQL', 'Beginner'],
      username: 'nachiketh_op',
      answerCount: 3,
    },
    {
      title: 'JWT token not working after page reload',
      description: 'I stored my token in localStorage but it gets removed after refresh.',
      tags: ['JWT', 'React'],
      username: 'manideep_sudo',
      answerCount: 2,
    },
    {
      title: 'CSS animation delay bug',
      description: 'Tailwind transition is acting weird when hovering the button.',
      tags: ['CSS', 'Tailwind'],
      username: 'varshith_dev',
      answerCount: 1,
    }
  ];

  return (
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

