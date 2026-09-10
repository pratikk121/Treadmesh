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

        $supplier = Supplier::firstOrCreate(
            ['user_id' => $supplierUser->id],
            [
                'company_name' => 'Apex Industrial Supplies LLC',
                'trade_license_number' => 'TL-2026-9901',
                'company_phone' => '+1-555-0192',
                'company_email' => 'supplier@treadmesh.com',
                'company_address' => '450 Commercial Boulevard, Suite 100',
                'city' => 'Chicago',
                'verification_status' => 'verified',
            ]
        );

        // 4. Demo Products for Marketplace
        $products = [
            [
                'name' => 'DDR5 Server Memory Module 64GB',
                'description' => 'High-speed 64GB DDR5 ECC Registered DIMM server memory module designed for enterprise data centers and heavy compute virtualization workloads.',
                'category' => 'Electronics',
                'base_price' => 280.00,
                'minimum_order_quantity' => 5,
                'unit' => 'piece',
                'stock_quantity' => 1500,
                'status' => 'approved',
            ],
            [
                'name' => 'Industrial Flanged Gate Valve 4-Inch',
                'description' => 'Cast steel class 150 flanged gate valve engineered for petrochemical, water treatment, and heavy process piping infrastructure.',
                'category' => 'Industrial Hardware',
                'base_price' => 345.50,
                'minimum_order_quantity' => 2,
                'unit' => 'piece',
                'stock_quantity' => 450,
                'status' => 'approved',
            ],
            [
                'name' => 'High-Precision CNC Angular Contact Bearings',
                'description' => 'Ultra-precision ABEC-7 angular contact spindle ball bearings for CNC milling machines and automated industrial rotary axes.',
                'category' => 'Machinery',
                'base_price' => 88.00,
                'minimum_order_quantity' => 10,
                'unit' => 'piece',
                'stock_quantity' => 2200,
                'status' => 'approved',
            ],
            [
                'name' => 'Enterprise Managed 48-Port PoE+ Gigabit Switch',
                'description' => 'Layer 3 enterprise network switch with 48 PoE+ gigabit ports, 4x 10G SFP+ uplinks, and redundant power architecture.',
                'category' => 'Networking',
                'base_price' => 750.00,
                'minimum_order_quantity' => 1,
                'unit' => 'piece',
                'stock_quantity' => 180,
                'status' => 'approved',
            ],
            [
                'name' => 'Industrial Heavy-Duty Polyurethane Conveyor Belt',
                'description' => 'Food and pharma grade oil-resistant polyurethane conveyor belting with high tensile synthetic cord for automated sorting systems.',
                'category' => 'Manufacturing',
                'base_price' => 45.00,
                'minimum_order_quantity' => 25,
                'unit' => 'meter',
                'stock_quantity' => 5000,
                'status' => 'approved',
            ],
            [
                'name' => 'Certified Commercial Safety Helmets (Box of 20)',
                'description' => 'ANSI Z89.1 certified Type 1 Class E safety helmets equipped with 6-point ratchet suspension for construction and industrial sites.',
                'category' => 'Safety Equipment',
                'base_price' => 195.00,
                'minimum_order_quantity' => 2,
                'unit' => 'box',
                'stock_quantity' => 600,
                'status' => 'approved',
            ],
        ];

        foreach ($products as $p) {
            \App\Models\Product::firstOrCreate(
                [
                    'supplier_id' => $supplier->id,
                    'name' => $p['name'],
                ],
                array_merge($p, [
                    'slug' => \Illuminate\Support\Str::slug($p['name']),
                ])
            );
        }
    }
}

