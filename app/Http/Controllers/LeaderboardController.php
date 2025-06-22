<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Employe;
use App\Models\ClaimHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\TransactionPoint;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $period = $request->get('period', 'all-time');
        $department = $request->get('department');
        $company = $request->get('company');
        $limit = $request->get('limit', 50);

        // Build the base query for employee rankings
        $query = Employe::select([
            'employes.id',
            'employes.EmpName',
            'employes.Company',
            'employes.JobTitle',
            DB::raw('COALESCE(SUM(transaction_points.PointValue), 0) as total_points'),
            DB::raw('COALESCE(SUM(CASE WHEN transaction_points.PointValue > 0 THEN transaction_points.PointValue ELSE 0 END), 0) as earned_points'),
            DB::raw('COALESCE(SUM(CASE WHEN transaction_points.PointValue < 0 THEN ABS(transaction_points.PointValue) ELSE 0 END), 0) as spent_points'),
            DB::raw('COUNT(transaction_points.id) as total_transactions'),
            DB::raw('MAX(transaction_points.created_at) as last_activity')
        ])
            ->leftJoin('transaction_points', 'employes.id', '=', 'transaction_points.employe_id');

        // Apply period filter
        if ($period !== 'all-time') {
            $dateRange = $this->getDateRange($period);
            if ($dateRange) {
                $query->where('transaction_points.EntitleDate', '>=', $dateRange['start'])
                    ->where('transaction_points.EntitleDate', '<=', $dateRange['end']);
            }
        }

        // Apply department filter (assuming department is stored in a related table or derived from JobTitle)
        if ($department) {
            // You might need to adjust this based on your actual department structure
            $query->where('employes.JobTitle', 'LIKE', "%{$department}%");
        }

        // Apply company filter
        if ($company) {
            $query->where('employes.Company', $company);
        }

        $leaderboard = $query->groupBy([
            'employes.id',
            'employes.EmpName',
            'employes.Company',
            'employes.JobTitle'
        ])
            ->orderBy('total_points', 'desc')
            ->limit($limit)
            ->get();

        // Add ranking
        $leaderboard = $leaderboard->map(function ($employee, $index) {
            $employee->rank = $index + 1;
            $employee->last_activity = $employee->last_activity ?
                Carbon::parse($employee->last_activity)->diffForHumans() : 'No activity';
            return $employee;
        });


        // Get filter options
        $companies = Employe::distinct()->pluck('Company')->filter()->sort()->values();
        $departments = $this->getDepartments();

        // Get summary statistics
        $stats = $this->getLeaderboardStats($period, $department, $company);
        // dd($stats);

        return Inertia::render('Leaderboard/Index', [
            'leaderboard' => $leaderboard,
            'companies' => $companies,
            'departments' => $departments,
            'stats' => $stats,
            'filters' => [
                'period' => $period,
                'department' => $department,
                'company' => $company,
                'limit' => $limit
            ]
        ]);
    }

    public function departmentRankings(Request $request)
    {
        $period = $request->get('period', 'all-time');

        // Get department rankings
        $query = Employe::select([
            'departments.name as department_name', // 👈 Add department name
            // '.id as idDept',
            'employes.department_id',
            DB::raw('COUNT(DISTINCT employes.id) as employee_count'),
            DB::raw('COALESCE(SUM(transaction_points.PointValue), 0) as total_points'),
            DB::raw('COALESCE(AVG(transaction_points.PointValue), 0) as avg_points_per_transaction'),
            DB::raw('COALESCE(SUM(CASE WHEN transaction_points.PointValue > 0 THEN transaction_points.PointValue ELSE 0 END), 0) as total_earned'),
            DB::raw('COALESCE(SUM(CASE WHEN transaction_points.PointValue < 0 THEN ABS(transaction_points.PointValue) ELSE 0 END), 0) as total_spent')
        ])
            ->leftJoin('transaction_points', 'employes.id', '=', 'transaction_points.employe_id') // Existing join
            ->leftJoin('departments', 'employes.department_id', '=', 'departments.id'); // 👈 New join

        // Apply period filter
        if ($period !== 'all-time') {
            $dateRange = $this->getDateRange($period);
            if ($dateRange) {
                $query->where('transaction_points.EntitleDate', '>=', $dateRange['start'])
                    ->where('transaction_points.EntitleDate', '<=', $dateRange['end']);
            }
        }

        $departmentRankings = $query->groupBy('employes.department_id', 'departments.name') // 👈 Group by both columns
            ->orderBy('total_points', 'desc')
            ->get();

        // Add ranking
        $departmentRankings = $departmentRankings->map(function ($dept, $index) {
            $dept->rank = $index + 1;
            $dept->avg_points_per_employee = $dept->employee_count > 0 ?
                round($dept->total_points / $dept->employee_count, 2) : 0;
            return $dept;
        });

        return Inertia::render('Leaderboard/Departments', [
            'departmentRankings' => $departmentRankings,
            'filters' => ['period' => $period]
        ]);
    }

    public function topPerformers(Request $request)
    {
        $period = $request->get('period', 'current-month');
        $type = $request->get('type', 'earners'); // earners, spenders, active

        $dateRange = $this->getDateRange($period);

        if ($type === 'earners') {
            $performers = $this->getTopEarners($dateRange);
        } elseif ($type === 'spenders') {
            $performers = $this->getTopSpenders($dateRange);
        } else {
            $performers = $this->getMostActive($dateRange);
        }

        return Inertia::render('Leaderboard/TopPerformers', [
            'performers' => $performers,
            'filters' => [
                'period' => $period,
                'type' => $type
            ]
        ]);
    }

    public function employeeDetail(Request $request, $employeeId)
    {
        $employee = Employe::findOrFail($employeeId);
        $period = $request->get('period', 'all-time');

        // Get employee's detailed statistics
        $query = TransactionPoint::where('employe_id', $employeeId);

        if ($period !== 'all-time') {
            $dateRange = $this->getDateRange($period);
            if ($dateRange) {
                $query->where('EntitleDate', '>=', $dateRange['start'])
                    ->where('EntitleDate', '<=', $dateRange['end']);
            }
        }

        $transactions = $query->orderBy('EntitleDate', 'desc')->get();


        $stats = [
            'total_points' => $transactions->sum('PointValue'),
            'earned_points' => $transactions->where('PointValue', '>', 0)->sum('PointValue'),
            'spent_points' => abs($transactions->where('PointValue', '<', 0)->sum('PointValue')),
            'total_transactions' => $transactions->count(),
            'avg_transaction' => $transactions->count() > 0 ? round($transactions->avg('PointValue'), 2) : 0,
        ];

        // Get point breakdown by type
        $pointsByType = $transactions->groupBy('point_type')->map(function ($group) {
            return [
                'count' => $group->count(),
                'total_points' => $group->sum('PointValue'),
                'avg_points' => round($group->avg('PointValue'), 2)
            ];
        });

        // Get recent claims
        $recentClaims = ClaimHistory::with(['prize'])
            ->where('employe_id', $employeeId)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get employee's rank
        $rank = $this->getEmployeeRank($employeeId, $period);

        return Inertia::render('Leaderboard/EmployeeDetail', [
            'employee' => $employee,
            'stats' => $stats,
            'pointsByType' => $pointsByType,
            'recentClaims' => $recentClaims,
            'rank' => $rank,
            'transactions' => $transactions->take(20), // Recent 20 transactions
            'filters' => ['period' => $period]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    private function getDateRange($period)
    {
        $now = Carbon::now();

        switch ($period) {
            case 'current-month':
                return [
                    'start' => $now->startOfMonth()->toDateString(),
                    'end' => $now->endOfMonth()->toDateString()
                ];
            case 'last-month':
                return [
                    'start' => $now->subMonth()->startOfMonth()->toDateString(),
                    'end' => $now->subMonth()->endOfMonth()->toDateString()
                ];
            case 'current-quarter':
                return [
                    'start' => $now->startOfQuarter()->toDateString(),
                    'end' => $now->endOfQuarter()->toDateString()
                ];
            case 'current-year':
                return [
                    'start' => $now->startOfYear()->toDateString(),
                    'end' => $now->endOfYear()->toDateString()
                ];
            case 'last-year':
                return [
                    'start' => $now->subYear()->startOfYear()->toDateString(),
                    'end' => $now->subYear()->endOfYear()->toDateString()
                ];
            default:
                return null;
        }
    }

    private function getDepartments()
    {
        // Extract unique departments from job titles or create a proper department system
        return Employe::select('JobTitle')
            ->distinct()
            ->pluck('JobTitle')
            ->map(function ($title) {
                // Extract department from job title (you might want to improve this logic)
                $parts = explode(' ', $title);
                return end($parts);
            })
            ->unique()
            ->filter()
            ->sort()
            ->values();
    }

    private function getLeaderboardStats($period, $department, $company)
    {
        $baseQuery = TransactionPoint::query();

        // Apply filters to base query
        if ($period !== 'all-time') {
            $dateRange = $this->getDateRange($period);
            if ($dateRange) {
                $baseQuery->where('EntitleDate', '>=', $dateRange['start'])
                    ->where('EntitleDate', '<=', $dateRange['end']);
            }
        }

        if ($company) {
            $baseQuery->whereHas('employe', function ($q) use ($company) {
                $q->where('Company', $company);
            });
        }

        // Clone the base query for each different calculation
        $totalPointsDistributed = (clone $baseQuery)->where('PointValue', '>', 0)->sum('PointValue');
        $totalPointsSpent = abs((clone $baseQuery)->where('PointValue', '<', 0)->sum('PointValue'));
        $totalTransactions = (clone $baseQuery)->count();
        $activeEmployees = (clone $baseQuery)->distinct('employe_id')->count();
        $totalPoints = (clone $baseQuery)->sum('PointValue');

        return [
            'total_points_distributed' => $totalPointsDistributed,
            'total_points_spent' => $totalPointsSpent,
            'total_transactions' => $totalTransactions,
            'active_employees' => $activeEmployees,
            'avg_points_per_employee' => $activeEmployees > 0 ?
                round($totalPoints / $activeEmployees, 2) : 0
        ];
    }

    private function getTopEarners($dateRange)
    {
        $query = Employe::select([
            'employes.id',
            'employes.EmpName',
            'employes.Company',
            'employes.JobTitle',
            DB::raw('SUM(transaction_points.PointValue) as earned_points')
        ])
            ->join('transaction_points', 'employes.id', '=', 'transaction_points.employe_id')
            ->where('transaction_points.PointValue', '>', 0);

        if ($dateRange) {
            $query->whereBetween('transaction_points.EntitleDate', [$dateRange['start'], $dateRange['end']]);
        }

        return $query->groupBy(['employes.id', 'employes.EmpName', 'employes.Company', 'employes.JobTitle'])
            ->having('earned_points', '>', 0)
            ->orderBy('earned_points', 'desc')
            ->limit(10)
            ->get();
    }

    private function getTopSpenders($dateRange)
    {
        $query = Employe::select([
            'employes.id',
            'employes.EmpName',
            'employes.Company',
            'employes.JobTitle',
            DB::raw('SUM(ABS(transaction_points.PointValue)) as spent_points')
        ])
            ->join('transaction_points', 'employes.id', '=', 'transaction_points.employe_id')
            ->where('transaction_points.PointValue', '<', 0);

        if ($dateRange) {
            $query->whereBetween('transaction_points.EntitleDate', [$dateRange['start'], $dateRange['end']]);
        }

        return $query->groupBy(['employes.id', 'employes.EmpName', 'employes.Company', 'employes.JobTitle'])
            ->having('spent_points', '>', 0)
            ->orderBy('spent_points', 'desc')
            ->limit(10)
            ->get();
    }

    private function getMostActive($dateRange)
    {
        $query = Employe::select([
            'employes.id',
            'employes.EmpName',
            'employes.Company',
            'employes.JobTitle',
            DB::raw('COUNT(transaction_points.id) as transaction_count')
        ])
            ->join('transaction_points', 'employes.id', '=', 'transaction_points.employe_id');

        if ($dateRange) {
            $query->whereBetween('transaction_points.EntitleDate', [$dateRange['start'], $dateRange['end']]);
        }

        return $query->groupBy(['employes.id', 'employes.EmpName', 'employes.Company', 'employes.JobTitle'])
            ->having('transaction_count', '>', 0)
            ->orderBy('transaction_count', 'desc')
            ->limit(10)
            ->get();
    }

    private function getEmployeeRank($employeeId, $period)
    {
        // Build base query
        $query = Employe::select([
            'employes.id',
            DB::raw('COALESCE(SUM(transaction_points.PointValue), 0) as total_points')
        ])
            ->leftJoin('transaction_points', function ($join) use ($period) {
                $join->on('employes.id', '=', 'transaction_points.employe_id');

                if ($period !== 'all-time') {
                    $dateRange = $this->getDateRange($period);
                    if ($dateRange) {
                        $join->whereBetween('transaction_points.EntitleDate', [$dateRange['start'], $dateRange['end']]);
                    }
                }
            });

        // Get all rankings
        $rankings = $query->groupBy('employes.id')
            ->orderBy('total_points', 'desc')
            ->pluck('total_points', 'employes.id')
            ->toArray();

        // Find rank using array_search for better performance
        $sortedIds = array_keys($rankings);
        $rank = array_search($employeeId, $sortedIds);

        return $rank !== false ? $rank + 1 : null;
    }

    // Alternative optimized version using window functions (if your DB supports it)
    private function getEmployeeRankOptimized($employeeId, $period)
    {
        $query = "
        SELECT
            ranked_employees.id,
            ranked_employees.rank
        FROM (
            SELECT
                e.id,
                COALESCE(SUM(tp.PointValue), 0) as total_points,
                ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(tp.PointValue), 0) DESC) as rank
            FROM employes e
            LEFT JOIN transaction_points tp ON e.id = tp.employe_id
    ";

        $bindings = [];

        if ($period !== 'all-time') {
            $dateRange = $this->getDateRange($period);
            if ($dateRange) {
                $query .= " AND tp.EntitleDate BETWEEN ? AND ?";
                $bindings[] = $dateRange['start'];
                $bindings[] = $dateRange['end'];
            }
        }

        $query .= "
            GROUP BY e.id
        ) as ranked_employees
        WHERE ranked_employees.id = ?
    ";

        $bindings[] = $employeeId;

        $result = DB::selectOne($query, $bindings);

        return $result ? $result->rank : null;
    }

    // Helper method to apply date range filter consistently
    private function applyDateRangeFilter($query, $dateRange, $dateColumn = 'transaction_points.EntitleDate')
    {
        if ($dateRange) {
            return $query->whereBetween($dateColumn, [$dateRange['start'], $dateRange['end']]);
        }
        return $query;
    }
}
