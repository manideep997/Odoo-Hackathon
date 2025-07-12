import Navbar from './Navbar';
import FilterBar from './FilterBar';
import QuestionCard from './QuestionCard';
import Pagination from './Pagination';


export default function Home() {
  const dummyQuestions = [
    {
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
