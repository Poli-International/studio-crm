<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\EmailQueue;
use App\Services\EmailEngine;

class ProcessEmailQueue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:process-queue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process the pending email queue';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pending = EmailQueue::where('status', 'pending')
            ->where('scheduled_for', '<=', now())
            ->get();

        $this->info("Found " . $pending->count() . " pending emails.");

        foreach ($pending as $item) {
            $this->info("Sending template '{$item->template_slug}' to client ID {$item->client_id}...");
            EmailEngine::sendEmail($item);
        }

        $this->info("Email queue processing complete.");
    }
}
