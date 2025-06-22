"use client"

import { Link, useForm } from "@inertiajs/react"

import AppLayout from "@/Layouts/AppLayout"

export default function EmployeeDetail({ employee, stats, pointsByType, recentClaims, rank, transactions, filters }) {
  const { data, setData, get } = useForm({
    period: filters.period || "all-time",
  })

  const handlePeriodChange = (period) => {
    setData("period", period)
    get(`/leaderboard/employee/${employee.id}`, {
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

  const getPointTypeColor = (points) => {
    return points >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <AppLayout title="Leaderboard" heroSection={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex items-center gap-2">
              <Link href="/leaderboard" className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                ← Back to Leaderboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employee.emp_name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {employee.Company} • {employee.JobTitle}
                  {rank && <span className="ml-2 font-medium">• Rank #{rank}</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Period Filter */}
        <div className="mt-6">
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

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">🏆</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Points</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total_points.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📈</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Points Earned</dt>
                    <dd className="text-lg font-medium text-green-600">+{stats.earned_points.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">💸</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Points Spent</dt>
                    <dd className="text-lg font-medium text-red-600">-{stats.spent_points.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">🔄</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Transactions</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total_transactions}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📊</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Transaction</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.avg_transaction}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Points by Type */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Points by Type</h3>
              <div className="space-y-4">
                {Object.entries(pointsByType).map(([type, data]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{type}</div>
                      <div className="text-xs text-gray-500">{data.count} transactions</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getPointTypeColor(data.total_points)}`}>
                        {data.total_points > 0 ? "+" : ""}
                        {data.total_points.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">avg: {data.avg_points}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Claims */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Prize Claims</h3>
              <div className="space-y-4">
                {recentClaims.length > 0 ? (
                  recentClaims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {claim.prize.image_path && (
                          <img
                            src={`/storage/${claim.prize.image_path}`}
                            alt={claim.prize.item_name}
                            className="h-8 w-8 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{claim.prize.item_name}</div>
                          <div className="text-xs text-gray-500">{new Date(claim.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">Qty: {claim.qty}</div>
                        <div className="text-xs text-red-600">-{claim.prize.point * claim.qty} pts</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No prize claims yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Transactions</h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.EntitleDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {transaction.PointType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{transaction.PointDesc}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={getPointTypeColor(transaction.PointValue)}>
                          {transaction.PointValue > 0 ? "+" : ""}
                          {transaction.PointValue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
