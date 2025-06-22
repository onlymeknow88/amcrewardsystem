<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\MasterPoint;
use Illuminate\Http\Request;

class MasterPointController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $master_points = MasterPoint::query()
            ->select('id', 'PointDesc', 'PointApplyTo', 'Unit', 'Department', 'PointType', 'PointValue')
            ->get();

        $department = Department::select('name','id')->get();

        return inertia('Admin/MasterPoint/Index', [
            'master_points' => $master_points,
            'departments' => $department,
            'page_settings' => [
                'title' => 'Master Points',
                'subtitle' => 'Menampilkan semua data Master Points'
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
            'PointDesc' => 'required|string|max:255',
            'PointApplyTo' => 'required|string',
            'Unit' => 'required|string|max:255',
            'Department' => 'required|string|max:255',
            'PointType' => 'required|string|max:255',
            'PointValue' => 'required',
        ]);

        MasterPoint::create($request->all());

        return redirect()->back()->with('success', 'Master Point created successfully!');
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
    public function update(Request $request, MasterPoint $masterpoint)
    {
        dd($masterpoint);
         $request->validate([
            'PointDesc' => 'required|string|max:255',
            'PointApplyTo' => 'required|string',
            'Unit' => 'required|string|max:255',
            'Department' => 'required|string|max:255',
            'PointType' => 'required|string|max:255',
            'PointValue' => 'required',
        ]);

        $masterpoint->update($request->all());

        return redirect()->back()->with('success', 'Master Point updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasterPoint $masterpoint)
    {
         $masterpoint->delete();

        return redirect()->back()->with('success', 'Master Point deleted successfully!');
    }
}
