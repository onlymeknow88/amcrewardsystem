import AppLayout from "@/Layouts/AppLayout"
import { Link } from "@inertiajs/react"

export default function AccessDenied({ message = "Access denied. You don't have permission to view this page." }) {
  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-6xl text-red-500 mb-4">🚫</div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
