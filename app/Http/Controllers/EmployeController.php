<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Employe;
use Illuminate\Http\Request;

class EmployeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $employes = Employe::query()
            ->select('id', 'EmpName', 'Company', 'JobTitle')
            ->orderBy('created_at', 'desc')
            ->get();

        // return $employes;

        return inertia('Admin/Employe/Index', [
            'employes' => $employes,
            'page_settings' => [
                'title' => 'Employe',
                'subtitle' => 'Menampilkan semua data Employe'
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
            'EmpName' => 'required|string|max:255',
            'Company' => 'required|string',
            'JobTitle' => 'required|string|max:255',
        ]);

        Employe::create($request->all());

        return redirect()->back()->with('success', 'Employee created successfully!');
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
    public function update(Request $request, Employe $employe)
    {
        $request->validate([
            'EmpName' => 'required|string|max:255',
            'Company' => 'required|string',
            'JobTitle' => 'required|string|max:255',
        ]);

        $employe->update($request->all());

        return redirect()->back()->with('success', 'Employee updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employe $employe)
    {
        $employe->delete();

        return redirect()->back()->with('success', 'Employee deleted successfully!');
    }
}
