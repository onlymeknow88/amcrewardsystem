import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure,
} from "@heroui/react";
import { Link, router, useForm } from "@inertiajs/react";

import AppLayout from "@/Layouts/AppLayout";
import { useState } from "react";

export default function Index(props) {
    const { leaderboard, companies, departments, stats, filters } = props;
    const [showFilters, setShowFilters] = useState(false);

    console.log(stats);

    const { data, setData, get, processing } = useForm({
        period: filters.period || "all-time",
        department: filters.department || "",
        company: filters.company || "",
        limit: filters.limit || 50,
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get("/leaderboard", {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setData({
            period: "all-time",
            department: "",
            company: "",
            limit: 50,
        });
        router.get("/leaderboard");
    };

    const getRankBadgeColor = (rank) => {
        if (rank === 1)
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-200";
        if (rank === 3)
            return "bg-orange-100 text-orange-800 border-orange-200";
        if (rank <= 10) return "bg-blue-100 text-blue-800 border-blue-200";
        return "bg-gray-50 text-gray-600 border-gray-200";
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

    const periodOptions = [
        { value: "all-time", label: "All Time" },
        { value: "current-year", label: "Current Year" },
        { value: "current-quarter", label: "Current Quarter" },
        { value: "current-month", label: "Current Month" },
        { value: "last-month", label: "Last Month" },
        { value: "last-year", label: "Last Year" },
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-900">
                        🏆 Points Leaderboard
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Employee rankings based on total points earned and spent
                        across the organization.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                    <Link
                        href="/leaderboard/departments"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        Department Rankings
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">📈</div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Points Distributed
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.total_points_distributed.toLocaleString()}
                                    </dd>
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Points Spent
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.total_points_spent.toLocaleString()}
                                    </dd>
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Transactions
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.total_transactions.toLocaleString()}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">👥</div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Active Employees
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.active_employees}
                                    </dd>
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Avg per Employee
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.avg_points_per_employee}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <form
                        onSubmit={handleFilter}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Time Period
                            </label>
                            <Select
                                color="primary"
                                placeholder="Select a item period"
                                selectedKeys={data.period ? [data.period] : []}
                                onSelectionChange={(keys) =>
                                    setData("period", Array.from(keys)[0] || "")
                                }
                                variant="bordered"
                                // className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                classNames={{
                                    base: "bg-white rounded-lg",
                                }}
                            >
                                {periodOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Company
                            </label>
                            <Select
                                color="primary"
                                placeholder="Select a company"
                                selectedKeys={
                                    data.company ? [data.company] : []
                                }
                                onSelectionChange={(keys) =>
                                    setData(
                                        "company",
                                        Array.from(keys)[0] || "",
                                    )
                                }
                                variant="bordered"
                                // className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                classNames={{
                                    base: "bg-white rounded-lg",
                                }}
                            >
                                <SelectItem value="">All Companies</SelectItem>
                                {companies.map((company) => (
                                    <SelectItem key={company} value={company}>
                                        {company}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Department
                            </label>
                            <Autocomplete
                                color="primary"
                                placeholder="Select a department"
                                selectedKey={`${data.department ?? ""}`}
                                onSelectionChange={(e) =>
                                    setData("department", e)
                                }
                                className="col-span-1 md:col-span-2"
                                classNames={{
                                    base: "bg-white rounded-lg",
                                }}
                                variant="bordered"
                            >
                                <SelectItem value="">
                                    All Departments
                                </SelectItem>
                                {departments.map((dept) => (
                                    <AutocompleteItem key={dept} value={dept}>
                                        {dept}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Show Top
                            </label>
                            <Select
                                placeholder="select top"
                                selectedKeys={data.limit ? [data.limit] : []}
                                onSelectionChange={(keys) =>
                                    setData("limit", Array.from(keys)[0] || "")
                                }
                                classNames={{
                                    base: "bg-white rounded-lg",
                                }}
                                variant="bordered"
                            >
                                <SelectItem value="10">Top 10</SelectItem>
                                <SelectItem value="25">Top 25</SelectItem>
                                <SelectItem value="50">Top 50</SelectItem>
                                <SelectItem value="100">Top 100</SelectItem>
                            </Select>
                        </div>

                        <div className="md:col-span-4 flex space-x-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                color="primary"
                                // className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                // type="button"
                                color="default"
                                variant="light"
                                onClick={clearFilters}
                                // className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Clear
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Leaderboard */}
            <div className="mt-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {leaderboard.map((employee) => (
                            <li key={employee.id}>
                                <Link
                                    href={`/leaderboard/employee/${employee.id}`}
                                    className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRankBadgeColor(employee.rank)}`}
                                                >
                                                    {getRankIcon(employee.rank)}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center">
                                                    <p className="text-lg font-medium text-indigo-600">
                                                        {employee.EmpName}
                                                    </p>
                                                    {employee.rank <= 3 && (
                                                        <span className="ml-2 text-lg">
                                                            {employee.rank === 1
                                                                ? "👑"
                                                                : "⭐"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <p>{employee.Company}</p>
                                                    <span className="mx-2">
                                                        •
                                                    </span>
                                                    <p>{employee.JobTitle}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {employee.total_points.toLocaleString()}
                                                <span className="text-sm font-normal text-gray-500 ml-1">
                                                    pts
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="text-green-600">
                                                    +
                                                    {employee.earned_points.toLocaleString()}
                                                </span>
                                                <span className="mx-1">•</span>
                                                <span className="text-red-600">
                                                    -
                                                    {employee.spent_points.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {employee.total_transactions}{" "}
                                                transactions •{" "}
                                                {employee.last_activity}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🏆</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No rankings found
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your filters to see more results.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

Index.layout = (page) => (
    <AppLayout children={page} title="Leaderboard" heroSection={false} />
);
