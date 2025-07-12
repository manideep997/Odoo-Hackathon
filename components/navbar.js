import Link from 'next/link';
import { Bell } from 'react-feather';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-blue-600 p-4 text-white">
      <div className="font-bold text-xl">StackIt</div>
      <div className="space-x-4">
        <Link href="/ask">
          <button className="bg-white text-blue-600 px-3 py-1 rounded">Ask New Question</button>
        </Link>
        <Link href="/login">Login</Link>
        <Bell className="inline" />
      </div>
    </nav>
  );
}
