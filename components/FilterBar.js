export default function FilterBar() {
  return (
    <div className="flex items-center space-x-4 px-6 py-4 bg-white shadow rounded-md my-4">
      <button className="px-3 py-1 bg-primary text-white rounded hover:bg-indigo-700">Newest</button>
      <button className="px-3 py-1 border border-primary text-primary rounded hover:bg-indigo-100">Unanswered</button>
      <input
        type="text"
        className="flex-grow border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Search for questions..."
      />
    </div>
  );
}