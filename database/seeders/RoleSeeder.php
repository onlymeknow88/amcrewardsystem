<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Administrator',
                'description' => 'Full system access with all permissions',
                'permissions' => [
                    'manage_users',
                    'manage_roles',
                    'manage_employees',
                    'manage_master_points',
                    'manage_prizes',
                    'manage_transaction_points',
                    'manage_claim_histories',
                    'view_leaderboard',
                    'view_reports',
                    'system_settings'
                ]
            ],
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Administrative access to most features',
                'permissions' => [
                    'manage_employees',
                    'manage_master_points',
                    'manage_prizes',
                    'manage_transaction_points',
                    'manage_claim_histories',
                    'view_leaderboard',
                    'view_reports'
                ]
            ]
        ];

        foreach ($roles as $roleData) {
            Role::create($roleData);
        }
    }
}
