<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Supplier;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with demo accounts.
     */
    public function run(): void
    {
        // 1. Admin Account
        User::firstOrCreate(
            ['email' => 'admin@treadmesh.com'],
            [
                'name' => 'Treadmesh Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // 2. Buyer Account
        User::firstOrCreate(
            ['email' => 'buyer@treadmesh.com'],
            [
                'name' => 'Demo Buyer Corp',
                'password' => Hash::make('password123'),
                'role' => 'buyer',
                'is_active' => true,
            ]
        );

        // 3. Supplier Account & Profile
        $supplierUser = User::firstOrCreate(
            ['email' => 'supplier@treadmesh.com'],
            [
                'name' => 'Apex Industrial Supplies',
                'password' => Hash::make('password123'),
                'role' => 'supplier',
                'is_active' => true,
            ]
        );

        Supplier::firstOrCreate(
            ['user_id' => $supplierUser->id],
            [
                'company_name' => 'Apex Industrial Supplies LLC',
                'trade_license_number' => 'TL-2026-9901',
                'company_phone' => '+1-555-0192',
                'company_email' => 'supplier@treadmesh.com',
                'company_address' => '450 Commercial Boulevard, Suite 100',
                'city' => 'Chicago',
                'verification_status' => 'approved',
            ]
        );
    }
}

