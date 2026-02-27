<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Form;
use Carbon\Carbon;

class FormSeeder extends Seeder
{
    public function run(): void
    {
        $forms = [
            ['client_id' => 1, 'type' => 'consent'],
            ['client_id' => 2, 'type' => 'waiver'],
            ['client_id' => 3, 'type' => 'consent'],
            ['client_id' => 4, 'type' => 'aftercare'],
        ];

        foreach ($forms as $f) {
            Form::create([
                'client_id' => $f['client_id'],
                'form_type' => $f['type'],
                'data' => [],
                'signed_at' => Carbon::today()->subDays(rand(1, 15)),
            ]);
        }
    }
}
