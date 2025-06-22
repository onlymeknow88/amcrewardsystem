import { Link, useForm } from "@inertiajs/react"

import AppLayout from "@/Layouts/AppLayout"

export default function Departments({ departmentRankings, filters }) {
  const { data, setData, get, processing } = useForm({
    period: filters.period || "all-time",
  })

  const handlePeriodChange = (period) => {
    setData("period", period)
    get("/leaderboard/departments", {
      data: { period },
      preserveState: true,
    })
  }

  const periodOptions = [
    { value: "all-time", label: "All Time" },
    { value: "current-year", label: "Current Year" },
    { value: "current-quarter", label: "Current Quarter" },
    { value: "current-month", label: "Current Month" },
    { value: "last-month", label: "Last Month" },
  ]

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800"
    if (rank === 2) return "bg-gray-100 text-gray-800"
    if (rank === 3) return "bg-orange-100 text-orange-800"
    return "bg-blue-100 text-blue-800"
  }

  return (
    <AppLayout title="Department Rankings">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">🏢 Department Rankings</h1>
            <p className="mt-2 text-sm text-gray-700">
              Company/department performance based on total points and employee participation.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              ← Back to Leaderboard
            </Link>
          </div>
        </div>

        {/* Period Filter */}
        <div className="mt-6">
          <div className="sm:hidden">
            <select
              value={data.period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-8">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePeriodChange(option.value)}
                  className={`${
                    data.period === option.value
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  {option.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Department Rankings */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departmentRankings.map((dept) => (
              <div key={dept.Company} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankBadgeColor(dept.rank)}`}
                      >
                        #{dept.rank}
                      </span>
                      <h3 className="ml-3 text-lg font-medium text-gray-900 truncate">{dept.department_name}</h3>
                    </div>
                    {dept.rank <= 3 && (
                      <span className="text-2xl">{dept.rank === 1 ? "🥇" : dept.rank === 2 ? "🥈" : "🥉"}</span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {dept.total_points.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500 ml-1">pts</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {dept.avg_points_per_employee.toLocaleString()} pts per employee
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Employees</div>
                      <div className="text-lg font-semibold text-gray-900">{dept.employee_count}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Avg/Transaction</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.round(dept.avg_points_per_transaction)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between text-sm">
                    <div className="text-green-600">
                      <span className="font-medium">Earned:</span> +{dept.total_earned.toLocaleString()}
                    </div>
                    <div className="text-red-600">
                      <span className="font-medium">Spent:</span> -{dept.total_spent.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {departmentRankings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No department data found</h3>
              <p className="text-gray-500">No point transactions found for the selected period.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
