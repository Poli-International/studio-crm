<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'name' => 'Sarah Mitchell',
                'email' => 'sarah.m@email.com',
                'phone' => '+1 555-0101',
                'profession' => 'Graphic Designer',
                'dob' => '1992-03-15',
                'address' => '42 Art Street, Brooklyn NY',
                'allergies' => 'Latex sensitivity',
                'medical_history' => 'Previous keloid scarring on left shoulder',
            ],
            [
                'name' => 'James Rodriguez',
                'email' => 'j.rodriguez@email.com',
                'phone' => '+1 555-0102',
                'profession' => 'Music Producer',
                'dob' => '1988-07-22',
                'address' => '15 Sound Ave, Austin TX',
                'allergies' => 'None known',
                'medical_history' => null,
            ],
            [
                'name' => 'Emma Thompson',
                'email' => 'emma.t@email.com',
                'phone' => '+1 555-0103',
                'profession' => 'Nurse',
                'dob' => '1995-11-08',
                'address' => '78 Health Blvd, Portland OR',
                'allergies' => 'Nickel allergy',
                'medical_history' => null,
            ],
            [
                'name' => 'Alex Chen',
                'email' => 'alex.chen@email.com',
                'phone' => '+1 555-0104',
                'profession' => 'Software Engineer',
                'dob' => '1990-01-30',
                'address' => '200 Tech Lane, Seattle WA',
                'allergies' => null,
                'medical_history' => 'Prone to keloids — test area first',
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria.s@email.com',
                'phone' => '+1 555-0105',
                'profession' => 'Photographer',
                'dob' => '1993-06-14',
                'address' => '33 Lens Rd, Miami FL',
                'allergies' => null,
                'medical_history' => null,
            ],
            [
                'name' => 'David Kim',
                'email' => 'david.k@email.com',
                'phone' => '+1 555-0106',
                'profession' => 'Chef',
                'dob' => '1987-12-03',
                'address' => '5 Kitchen St, Chicago IL',
                'allergies' => null,
                'medical_history' => null,
            ],
            [
                'name' => 'Lisa Johnson',
                'email' => 'lisa.j@email.com',
                'phone' => '+1 555-0107',
                'profession' => 'Teacher',
                'dob' => '1991-09-20',
                'address' => '12 School Dr, Denver CO',
                'allergies' => null,
                'medical_history' => null,
            ],
            [
                'name' => 'Ryan O'Brien',
                'email' => 'ryan.ob@email.com',
                'phone' => '+1 555-0108',
                'profession' => 'Electrician',
                'dob' => '1985-04-11',
                'address' => '88 Wire Ave, Boston MA',
                'allergies' => null,
                'medical_history' => 'Blood thinner medication',
            ],
        ];

        foreach ($clients as $c) {
            Client::create($c);
        }
    }
}
