export default function Pagination() {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {[1, 2, 3, 4, 5, 6, 7].map((page) => (
        <button
          key={page}
          className="border px-3 py-1 rounded hover:bg-gray-100"
        >
          {page}
        </button>
      ))}
    </div>
  );
}
