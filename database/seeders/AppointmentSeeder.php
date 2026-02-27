<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $appts = [
            ['client_id' => 1, 'staff_id' => 2, 'type' => 'tattoo', 'status' => 'completed', 'days' => -10, 'time' => '10:00:00'],
            ['client_id' => 2, 'staff_id' => 3, 'type' => 'piercing', 'status' => 'completed', 'days' => -5, 'time' => '14:30:00'],
            ['client_id' => 3, 'staff_id' => 4, 'type' => 'consultation', 'status' => 'completed', 'days' => -2, 'time' => '11:00:00'],
            ['client_id' => 4, 'staff_id' => 2, 'type' => 'tattoo', 'status' => 'confirmed', 'days' => 0, 'time' => '10:00:00'],
            ['client_id' => 5, 'staff_id' => 3, 'type' => 'tattoo', 'status' => 'confirmed', 'days' => 0, 'time' => '13:00:00'],
            ['client_id' => 6, 'staff_id' => 4, 'type' => 'piercing', 'status' => 'pending', 'days' => 1, 'time' => '09:00:00'],
            ['client_id' => 7, 'staff_id' => 2, 'type' => 'touchup', 'status' => 'confirmed', 'days' => 2, 'time' => '15:00:00'],
            ['client_id' => 8, 'staff_id' => 3, 'type' => 'tattoo', 'status' => 'pending', 'days' => 3, 'time' => '11:00:00'],
            ['client_id' => 1, 'staff_id' => 2, 'type' => 'touchup', 'status' => 'confirmed', 'days' => 30, 'time' => '10:00:00'],
            ['client_id' => 2, 'staff_id' => 4, 'type' => 'removal', 'status' => 'pending', 'days' => 45, 'time' => '14:00:00'],
        ];

        foreach ($appts as $a) {
            Appointment::create([
                'client_id' => $a['client_id'],
                'staff_id' => $a['staff_id'],
                'service_type' => $a['type'],
                'datetime' => Carbon::today()->addDays($a['days'])->setTimeFromTimeString($a['time']),
                'duration_minutes' => 60,
                'status' => $a['status'],
            ]);
        }
    }
}
