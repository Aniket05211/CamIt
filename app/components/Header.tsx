import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            CamIt
          </Link>
          <div>
            <Link href="/login" className="text-gray-800 hover:text-blue-500 mx-4">
              Login
            </Link>
            <Link href="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
