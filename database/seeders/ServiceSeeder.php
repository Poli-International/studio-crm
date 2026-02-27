<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use Carbon\Carbon;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'client_id' => 1, 'staff_id' => 2, 'appointment_id' => 1,
                'type' => 'tattoo', 'body_location' => 'Left Forearm',
                'machine_tools' => 'Bishop Wand Packer, 4.2mm stroke',
                'materials_used' => 'Eternal Ink Black, 3RL, 7M1',
                'price' => 450.00, 'days' => -10
            ],
            [
                'client_id' => 2, 'staff_id' => 3, 'appointment_id' => 2,
                'type' => 'piercing', 'body_location' => 'Right Ear (Lobe)',
                'machine_tools' => '14g Piercing Needle',
                'materials_used' => 'Titanium Labret 16g',
                'price' => 85.00, 'days' => -5
            ],
            [
                'client_id' => 3, 'staff_id' => 4, 'appointment_id' => 3,
                'type' => 'consultation', 'body_location' => 'Full Back',
                'machine_tools' => 'Digital Sketch',
                'materials_used' => 'Consultation Forms',
                'price' => 0.00, 'days' => -2
            ],
            [
                'client_id' => 4, 'staff_id' => 2, 'appointment_id' => null,
                'type' => 'tattoo', 'body_location' => 'Upper Back',
                'machine_tools' => 'Cheyenne Sol Nova',
                'materials_used' => 'Dynamic Black, 5RL',
                'price' => 680.00, 'days' => -15
            ],
            [
                'client_id' => 5, 'staff_id' => 3, 'appointment_id' => null,
                'type' => 'tattoo', 'body_location' => 'Ankle',
                'machine_tools' => 'FK Irons Spektra Flux',
                'materials_used' => 'Intenze Red, 3RL',
                'price' => 320.00, 'days' => -20
            ],
            [
                'client_id' => 6, 'staff_id' => 4, 'appointment_id' => null,
                'type' => 'piercing', 'body_location' => 'Nose',
                'machine_tools' => '18g Needle',
                'materials_used' => 'Titanium Nostril Screw',
                'price' => 65.00, 'days' => -25
            ],
            [
                'client_id' => 7, 'staff_id' => 2, 'appointment_id' => null,
                'type' => 'touchup', 'body_location' => 'Wrist',
                'machine_tools' => 'Bishop Wand',
                'materials_used' => 'Eternal Ink Black',
                'price' => 50.00, 'days' => -30
            ],
            [
                'client_id' => 8, 'staff_id' => 3, 'appointment_id' => null,
                'type' => 'tattoo', 'body_location' => 'Shoulder',
                'machine_tools' => 'Cheyenne Sol Terra',
                'materials_used' => 'Silverback Graywash Set',
                'price' => 540.00, 'days' => -35
            ],
        ];

        foreach ($services as $s) {
            Service::create([
                'client_id' => $s['client_id'],
                'staff_id' => $s['staff_id'],
                'appointment_id' => $s['appointment_id'],
                'type' => $s['type'],
                'body_location' => $s['body_location'],
                'machine_tools' => $s['machine_tools'],
                'materials_used' => $s['materials_used'],
                'price' => $s['price'],
                'date_completed' => Carbon::today()->addDays($s['days']),
            ]);
        }
    }
}
