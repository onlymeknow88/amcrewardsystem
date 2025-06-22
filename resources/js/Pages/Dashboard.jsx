import { Link, usePage } from "@inertiajs/react";

import AppLayout from "@/Layouts/AppLayout";

export default function Dashboard() {
    const { auth } = usePage().props;

    console.log(auth);

    const isAdmin =
        auth?.user?.role?.name === "admin" ||
        auth?.user?.role?.name === "super_admin";

    return (
        <AppLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Welcome to Points System! 🏆
                                </h1>
                                <p className="text-lg text-gray-600 mb-8">
                                    Track employee performance, manage rewards,
                                    and celebrate achievements.
                                </p>

                                {auth?.user ? (
                                    <div className="mb-8">
                                        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                                            <span className="mr-2">👋</span>
                                            Welcome back, {auth.user.name}!
                                            {auth.user.role && (
                                                <span className="ml-2 px-2 py-1 bg-green-200 text-green-900 rounded text-sm">
                                                    {
                                                        auth.user.role
                                                            .display_name
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-8">
                                        <p className="text-gray-600 mb-4">
                                            Join our community to track your
                                            progress!
                                        </p>
                                        <div className="space-x-4">
                                            <Link
                                                href="/login"
                                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                                    {/* Public Features */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
                                        <div className="text-3xl mb-4">🏆</div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Leaderboard
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            See top performers and track
                                            rankings across the organization.
                                        </p>
                                        <Link
                                            href="/leaderboard"
                                            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
                                        >
                                            View Leaderboard →
                                        </Link>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
                                        <div className="text-3xl mb-4">🏢</div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Department Rankings
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Compare performance across different
                                            departments and teams.
                                        </p>
                                        <Link
                                            href="/leaderboard/departments"
                                            className="inline-flex items-center text-emerald-600 hover:text-emerald-500"
                                        >
                                            View Rankings →
                                        </Link>
                                    </div>

                                    {/* Admin Features */}
                                    {isAdmin && (
                                        <>
                                            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-lg">
                                                <div className="text-3xl mb-4">
                                                    👥
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Employee Management
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Manage employee records and
                                                    track their performance.
                                                </p>
                                                <Link
                                                    href="/admin/employe"
                                                    className="inline-flex items-center text-violet-600 hover:text-violet-500"
                                                >
                                                    Manage Employees →
                                                </Link>
                                            </div>

                                            <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-lg">
                                                <div className="text-3xl mb-4">
                                                    🎁
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Prize Management
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Create and manage rewards
                                                    that employees can claim.
                                                </p>
                                                <Link
                                                    href="/admin/prize"
                                                    className="inline-flex items-center text-amber-600 hover:text-amber-500"
                                                >
                                                    Manage Prizes →
                                                </Link>
                                            </div>

                                            <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-lg">
                                                <div className="text-3xl mb-4">
                                                    📊
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    Points Management
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Track point transactions and
                                                    manage the points system.
                                                </p>
                                                <Link
                                                    href="/admin/transaction-point"
                                                    className="inline-flex items-center text-rose-600 hover:text-rose-500"
                                                >
                                                    Manage Points →
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
