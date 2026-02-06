<?php

namespace App\Services;

use App\Models\Service;
use App\Models\EmailQueue;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailEngine
{
    /**
     * Schedule all follow-up emails for a new service.
     */
    public static function scheduleFollowUps(Service $service)
    {
        $date = Carbon::parse($service->date_completed);
        $client = $service->client;

        if ($service->type === 'tattoo') {
            self::addToQueue($client->id, $service->id, 'tattoo-welcome', $date->copy()->addHours(2));
            self::addToQueue($client->id, $service->id, 'tattoo-checkin-3d', $date->copy()->addDays(3));
            self::addToQueue($client->id, $service->id, 'tattoo-aftercare-7d', $date->copy()->addDays(7));
            self::addToQueue($client->id, $service->id, 'tattoo-touchup-reminder', $date->copy()->addMonths(6));
        }
        
        if ($service->type === 'piercing') {
            self::addToQueue($client->id, $service->id, 'piercing-fresh', $date->copy()->addHours(2));
            self::addToQueue($client->id, $service->id, 'piercing-checkup', $date->copy()->addWeeks(2));
        }
    }

    /**
     * Add a single email to the queue.
     */
    private static function addToQueue($clientId, $serviceId, $templateSlug, $scheduledFor)
    {
        EmailQueue::create([
            'client_id' => $clientId,
            'service_id' => $serviceId,
            'template_slug' => $templateSlug,
            'scheduled_for' => $scheduledFor,
            'status' => 'pending'
        ]);
    }

    /**
     * Send an email (called by the queue processor).
     */
    public static function sendEmail(EmailQueue $queueItem)
    {
        try {
            $client = $queueItem->client;
            $html = self::renderTemplate($queueItem);
            
            // In Laravel, we use Mail::send or Mail::html
            Mail::html($html, function ($message) use ($client, $queueItem) {
                $message->to($client->email)
                    ->subject(self::getSubject($queueItem->template_slug));
            });
            
            $queueItem->update(['status' => 'sent', 'sent_at' => now()]);
            Log::info("Sent email '{$queueItem->template_slug}' to {$client->email}");
            return true;
        } catch (\Exception $e) {
            $queueItem->update(['status' => 'failed', 'error_log' => $e->getMessage()]);
            Log::error("Failed to send email '{$queueItem->template_slug}' to {$client->email}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Render the email HTML by replacing placeholders.
     */
    private static function renderTemplate(EmailQueue $queueItem)
    {
        $templatePath = resource_path("views/emails/{$queueItem->template_slug}.html");
        $basePath = resource_path("views/emails/base.html");
        
        if (!file_exists($templatePath) || !file_exists($basePath)) {
            throw new \Exception("Template not found: {$queueItem->template_slug}");
        }

        $base = file_get_contents($basePath);
        $content = file_get_contents($templatePath);

        // Merge content into base
        $html = str_replace('{{CONTENT}}', $content, $base);

        // Replace global variables
        $html = str_replace('{{STUDIO_NAME}}', config('app.name', 'Poli Tattoo Studio'), $html);
        $html = str_replace('{{YEAR}}', date('Y'), $html);
        
        // Replace client variables
        $html = str_replace('{{CLIENT_NAME}}', $queueItem->client->name, $html);
        
        return $html;
    }

    /**
     * Get subject line based on template slug.
     */
    private static function getSubject($slug)
    {
        $subjects = [
            'tattoo-welcome' => 'Welcome to Poli Tattoo Studio!',
            'tattoo-checkin-3d' => 'How is your new tattoo doing?',
            'tattoo-aftercare-7d' => 'Important: Tattoo Aftercare Update',
            'tattoo-touchup-reminder' => 'Time for your tattoo touch-up?',
            'piercing-fresh' => 'Your New Piercing: Aftercare Instructions',
            'piercing-checkup' => 'Piercing Check-up Reminder',
        ];
        
        return $subjects[$slug] ?? 'Update from Poli Tattoo Studio';
    }
}
