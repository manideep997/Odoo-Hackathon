export default function Pagination() {
  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button className="px-3 py-1 rounded bg-primary text-white hover:bg-indigo-700">1</button>
      <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">2</button>
      <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">3</button>
    </div>
  );
}