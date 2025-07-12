export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 shadow-md flex justify-between items-center text-white">
      <div className="text-2xl font-bold">🚀 StackIt</div>
      <div className="flex space-x-4">
        <a href="#" className="hover:text-yellow-300">Ask</a>
        <a href="#" className="hover:text-yellow-300">Login</a>
      </div>
    </nav>
  );
}