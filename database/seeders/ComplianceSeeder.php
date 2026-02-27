<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compliance;
use Carbon\Carbon;

class ComplianceSeeder extends Seeder
{
    public function run(): void
    {
        $logs = [
            ['staff_id' => 1, 'type' => 'Maintenance', 'details' => ['notes' => 'Station sanitization and deep clean']],
            ['staff_id' => 5, 'type' => 'autoclave_log', 'details' => ['notes' => 'Weekly autoclave test cycle complete']],
            ['staff_id' => 1, 'type' => 'Training', 'details' => ['notes' => 'Personal hygiene checklist reviewed']],
            ['staff_id' => 5, 'type' => 'Maintenance', 'details' => ['notes' => 'Equipment inspection and maintenance']],
        ];

        foreach ($logs as $l) {
            Compliance::create([
                'staff_id' => $l['staff_id'],
                'type' => $l['type'],
                'log_date' => Carbon::today()->subDays(rand(1, 10)),
                'details' => $l['details'],
                'status' => 'pass',
            ]);
        }
    }
}
