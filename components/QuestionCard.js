export default function QuestionCard({ title, description, tags, username, answerCount }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-all border border-gray-200 mb-4">
      <h2 className="text-xl font-semibold mb-1 text-primary">{title}</h2>
      <p className="text-gray-700 mb-2">{description}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className="bg-indigo-100 text-indigo-700 px-2 py-1 text-xs rounded">{tag}</span>
        ))}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>👤 {username}</span>
        <span className="bg-primary text-white px-2 py-1 rounded-full">{answerCount} answers</span>
      </div>
    </div>
  );
}