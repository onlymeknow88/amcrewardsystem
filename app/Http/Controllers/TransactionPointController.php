<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\MasterPoint;
use Illuminate\Http\Request;
use App\Models\TransactionPoint;

class TransactionPointController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactionpoints = TransactionPoint::with('employe')
            ->select('id', 'employe_id', 'EntitleDate', 'PointType', 'PointDesc', 'PointValue')
            ->get();

        $employes = Employe::select('id', 'EmpName', 'JobTitle', 'Company')->get();


        $masterPoints = MasterPoint::select('id', 'PointDesc', 'PointApplyTo', 'PointValue', 'PointType', 'Unit', 'Department')
            ->orderBy('created_at', 'asc')
            ->get();
        return inertia('Admin/TransactionPoint/Index', [
            'transactionpoints' => $transactionpoints,
            'employes' => $employes,
            'masterPoints' => $masterPoints,
            'page_settings' => [
                'title' => 'Transaction Point',
                'subtitle' => 'Menampilkan semua data Transaction Point'
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
        // dd($request->all());
        $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'EntitleDate' => 'required|date',
            'PointType' => 'required|string|max:50',
            'PointDesc' => 'required|string|max:500',
            'PointValue' => 'required|integer',
        ]);

        $data = $request->except('PointApplyTo');
        // $data['CreatedBy'] = auth()->user()->name ?? 'System';

        TransactionPoint::create($data);

        return redirect()->route('admin.transaction-point.index')
            ->with('success', 'Transaction point created successfully.');
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
    public function update(Request $request, TransactionPoint $transactionpoint)
    {
        // dd($transactionpoint);
       $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'EntitleDate' => 'required|date',
            'PointType' => 'required|string|max:50',
            'PointDesc' => 'required|string|max:500',
            'PointValue' => 'required|integer',
        ]);

        $data = $request->except('PointApplyTo');
        // $data['UpdatedBy'] = auth()->user()->name ?? 'System';

        $transactionpoint->update($data);

        return redirect()->route('admin.transaction-point.index')
            ->with('success', 'Transaction point updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TransactionPoint $transactionpoint)
    {
         $transactionpoint->delete();

        return redirect()->route('admin.transaction-point.index')
            ->with('success', 'Transaction point deleted successfully.');
    }

    public function getEmployeePoints(Request $request)
    {
        $employeeId = $request->get('employe_id');


        if (!$employeeId) {
            return response()->json(['total_points' => 0]);
        }

        $totalPoints = TransactionPoint::where('employe_id', $employeeId)
            ->sum('PointValue');

        return response()->json(['total_points' => $totalPoints]);
    }
}
