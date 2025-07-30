import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xl">K</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">Kasome</span>
    </Link>
  )
}
