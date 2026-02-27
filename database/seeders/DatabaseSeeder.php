<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            StaffSeeder::class,
            ClientSeeder::class,
            AppointmentSeeder::class,
            ServiceSeeder::class,
            FinancialSeeder::class,
            InventorySeeder::class,
            ComplianceSeeder::class,
            FormSeeder::class,
        ]);
    }
}
