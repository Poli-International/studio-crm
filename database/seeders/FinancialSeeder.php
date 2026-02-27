<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Financial;
use App\Models\Service;
use Carbon\Carbon;

class FinancialSeeder extends Seeder
{
    public function run(): void
    {
        $services = Service::all();
        
        foreach ($services as $s) {
            if ($s->price > 0) {
                Financial::create([
                    'client_id' => $s->client_id,
                    'service_id' => $s->id,
                    'staff_id' => $s->staff_id,
                    'type' => 'payment',
                    'amount' => $s->price,
                    'method' => ($s->id % 2 == 0) ? 'card' : 'cash',
                    'source' => 'in-studio',
                    'transaction_date' => $s->date_completed,
                    'status' => 'completed',
                ]);
            }
        }
    }
}
