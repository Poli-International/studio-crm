<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $staff = [
            [
                'name' => 'Marcus Rivera',
                'email' => 'marcus@studio.com',
                'role' => 'admin',
                'specialties' => json_encode(["Management", "Training"]),
                'commission_rate' => 0.00,
                'active' => 1
            ],
            [
                'name' => 'Yuki Tanaka',
                'email' => 'yuki@studio.com',
                'role' => 'artist',
                'specialties' => json_encode(["Neo-Japanese", "Realism", "Color"]),
                'commission_rate' => 55.00,
                'active' => 1
            ],
            [
                'name' => 'Sofia Petrov',
                'email' => 'sofia@studio.com',
                'role' => 'artist',
                'specialties' => json_encode(["Geometric", "Watercolor", "Dotwork"]),
                'commission_rate' => 50.00,
                'active' => 1
            ],
            [
                'name' => 'Jake Williams',
                'email' => 'jake@studio.com',
                'role' => 'artist',
                'specialties' => json_encode(["Celtic", "Traditional", "Piercings"]),
                'commission_rate' => 50.00,
                'active' => 1
            ],
            [
                'name' => 'Ana Martinez',
                'email' => 'ana@studio.com',
                'role' => 'manager',
                'specialties' => json_encode(["Operations", "Scheduling"]),
                'commission_rate' => 0.00,
                'active' => 1
            ],
            [
                'name' => 'Tom Bradley',
                'email' => 'tom@studio.com',
                'role' => 'artist',
                'specialties' => json_encode(["Blackwork", "Lettering"]),
                'commission_rate' => 45.00,
                'active' => 0
            ],
        ];

        foreach ($staff as $s) {
            Staff::create([
                'user_uuid' => (string) Str::uuid(),
                'name' => $s['name'],
                'email' => $s['email'],
                'password_hash' => Hash::make('password'),
                'role' => $s['role'],
                'specialties' => $s['specialties'],
                'commission_rate' => $s['commission_rate'],
                'active' => $s['active'],
            ]);
        }
    }
}
