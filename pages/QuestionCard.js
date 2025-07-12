export default function QuestionCard({
  title,
  description,
  tags,
  username,
  answerCount,
}) {
  return (
    <div className="border p-4 mb-4 rounded flex justify-between">
      <div>
        <h2 className="font-bold text-lg mb-1">{title}</h2>
        <div className="mb-2 flex space-x-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-700 mb-2">{description}</p>
        <p className="text-xs text-gray-500">{username}</p>
      </div>
      <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
        {answerCount} ans
      </div>
    </div>
  );
}
