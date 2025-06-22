<?php

namespace App\Http\Controllers;

use App\Models\Prize;
use App\Models\Employe;
use App\Models\ClaimHistory;
use Illuminate\Http\Request;
use App\Models\TransactionPoint;
use Illuminate\Support\Facades\DB;

class ClaimHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ClaimHistory::with(['employe', 'prize', 'transactionPoint']);

        // Filter by employee if provided
        if ($request->filled('employe_id')) {
            $query->where('employe_id', $request->employe_id);
        }

        // Filter by prize if provided
        if ($request->filled('prize_id')) {
            $query->where('prize_id', $request->prize_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $employes = Employe::select('id', 'EmpName','JobTitle','Company')->get();

         $claimHistories = $query->orderBy('created_at', 'desc')->get();

          $prizes = Prize::select('id', 'ItemName', 'Stock','Price', 'Point')->orderBy('ItemName')->get();

        return inertia('Admin/ClaimHistory/Index', [
           'claimHistories' => $claimHistories,
            'employes' => $employes,
            'prizes' => $prizes,
            'filters' => $request->only(['employe_id', 'prize_id', 'date_from', 'date_to']),
            'page_settings' => [
                'title' => 'Claim History',
                'subtitle' => 'Lacak semua klaim hadiah yang dibuat oleh karyawan termasuk poin yang digunakan dan jumlah yang diklaim.'
            ]
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
         $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'prize_id' => 'required|exists:prizes,id',
            'QTY' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $employee = Employe::findOrFail($request->employe_id);
            $prize = Prize::findOrFail($request->prize_id);


            // Check if prize is available
            if ($prize->Stock < $request->QTY) {
                return back()->withErrors(['QTY' => 'Insufficient stock available.']);
            }

            // Check if prize is within valid period
            if ($prize->PeriodStart > now() || $prize->PeriodEnd < now()) {
                return back()->withErrors(['prize_id' => 'Prize is not available in the current period.']);
            }

            // Calculate total points needed
            $totalPointsNeeded = $prize->Point * $request->QTY;

            // Get employee's total points
            $employeeTotalPoints = TransactionPoint::where('employe_id', $request->employe_id)
            ->sum('PointValue');

            // Check if employee has enough points
            if ($employeeTotalPoints < $totalPointsNeeded) {
                return back()->withErrors([
                    'QTY' => "Insufficient points. Employee has {$employeeTotalPoints} points but needs {$totalPointsNeeded} points."
                ]);
            }
            // dd($employeeTotalPoints);

            // Create a deduction transaction for the points used
            $transactionPoint = TransactionPoint::create([
                'employe_id' => $request->employe_id,
                'EntitleDate' => now()->toDateString(),
                'PointType' => 'minus',
                'PointDesc' => "Claimed {$request->QTY}x {$prize->ItemName}",
                'PointValue' => -$totalPointsNeeded,
                'CreatedBy' => auth()->user()->name ?? 'System',
            ]);

            // Create claim history record
            ClaimHistory::create([
                'prize_id' => $request->prize_id,
                'transaction_id' => $transactionPoint->id,
                'employe_id' => $request->employe_id,
                'QTY' => $request->QTY,
                'CreatedBy' => auth()->user()->name ?? 'System',
            ]);

            // Update prize stock
            $prize->decrement('Stock', $request->QTY);

            DB::commit();

            return redirect()->route('admin.claim-history.index')
                ->with('success', 'Prize claimed successfully!');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'An error occurred while processing the claim.']);
        }
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
    public function update(Request $request, ClaimHistory $claimhistory)
    {
        $request->validate([
            'QTY' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $oldQty = $claimhistory->QTY;
            $newQty = $request->QTY;
            $qtyDifference = $newQty - $oldQty;

            $prize = $claimhistory->prize;

            // Check stock availability for increase
            if ($qtyDifference > 0 && $prize->Stock < $qtyDifference) {
                return back()->withErrors(['QTY' => 'Insufficient stock available for the increase.']);
            }

            // Calculate point difference
            $pointDifference = $prize->Point * $qtyDifference;

            // If increasing quantity, check if employee has enough points
            if ($pointDifference > 0) {
                $employeeTotalPoints = TransactionPoint::where('employe_id', $claimhistory->employe_id)
                ->sum('PointValue');

                if ($employeeTotalPoints < $pointDifference) {
                    return back()->withErrors([
                        'QTY' => "Insufficient points for the increase. Employee needs {$pointDifference} more points."
                    ]);
                }
            }

            // dd($claimhistory->transactionPoint()->first());
            // Update the transaction point record
            $claimhistory->transactionPoint->update([
                'PointDesc' => "Claimed {$newQty}x {$prize->ItemName} (Updated)",
                'PointValue' => -($prize->Point * $newQty),
                'UpdatedBy' => auth()->user()->name ?? 'System',
            ]);

            // Update claim history
            $claimhistory->update([
                'QTY' => $newQty,
                'UpdatedBy' => auth()->user()->name ?? 'System',
            ]);

            // Update prize stock (subtract the difference)
            $prize->decrement('Stock', $qtyDifference);

            DB::commit();

            return redirect()->route('admin.claim-history.index')
                ->with('success', 'Claim history updated successfully!');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'An error occurred while updating the claim.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClaimHistory $claimhistory)
    {
         DB::beginTransaction();

        try {
            // Restore prize stock
            $claimhistory->prize->increment('Stock', $claimhistory->QTY);

            // Delete the associated transaction point (this will restore the points)
            $claimhistory->transactionPoint->delete();

            // Delete the claim history
            $claimhistory->delete();

            DB::commit();

            return redirect()->route('admin.claim-history.index')
                ->with('success', 'Claim history deleted and points restored successfully!');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'An error occurred while deleting the claim.']);
        }
    }

    public function getEmployeeAvailablePoints(Request $request)
    {
        $employeeId = $request->get('employe_id');

        if (!$employeeId) {
            return response()->json(['available_points' => 0]);
        }

        $availablePoints = TransactionPoint::where('employe_id', $employeeId)
            ->sum('PointValue');

        return response()->json(['available_points' => max(0, $availablePoints)]);
    }
}
