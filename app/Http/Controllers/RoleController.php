<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users')->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $availablePermissions = [
            'manage_users' => 'Manage Users',
            'manage_roles' => 'Manage Roles',
            'manage_employees' => 'Manage Employees',
            'manage_master_points' => 'Manage Master Points',
            'manage_prizes' => 'Manage Prizes',
            'manage_transaction_points' => 'Manage Transaction Points',
            'manage_claim_histories' => 'Manage Claim Histories',
            'view_leaderboard' => 'View Leaderboard',
            'view_reports' => 'View Reports',
            'view_own_points' => 'View Own Points',
            'system_settings' => 'System Settings'
        ];

        return Inertia::render('Roles/Create', [
            'availablePermissions' => $availablePermissions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:roles',
            'display_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        Role::create($request->all());

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        $role->load('users');

        return Inertia::render('Roles/Show', [
            'role' => $role
        ]);
    }

    public function edit(Role $role)
    {
        $availablePermissions = [
            'manage_users' => 'Manage Users',
            'manage_roles' => 'Manage Roles',
            'manage_employees' => 'Manage Employees',
            'manage_master_points' => 'Manage Master Points',
            'manage_prizes' => 'Manage Prizes',
            'manage_transaction_points' => 'Manage Transaction Points',
            'manage_claim_histories' => 'Manage Claim Histories',
            'view_leaderboard' => 'View Leaderboard',
            'view_reports' => 'View Reports',
            'view_own_points' => 'View Own Points',
            'system_settings' => 'System Settings'
        ];

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'availablePermissions' => $availablePermissions
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:roles,name,' . $role->id,
            'display_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        $role->update($request->all());

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        if ($role->users()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete role that has assigned users.']);
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
