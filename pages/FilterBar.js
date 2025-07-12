export default function FilterBar() {
  return (
    <div className="flex items-center space-x-4 p-4">
      <button className="border px-3 py-1 rounded">Newest</button>
      <button className="border px-3 py-1 rounded">Unanswered</button>
      <button className="border px-3 py-1 rounded flex items-center space-x-1">
        <span>More</span>
        <span>▼</span>
      </button>
      <input
        className="border p-1 flex-grow rounded"
        type="text"
        placeholder="Search"
      />
    </div>
  );
}