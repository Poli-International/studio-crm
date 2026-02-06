<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServicePhoto;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Store a newly completed service record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'staff_id' => 'required|exists:staff,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'type' => 'required|in:tattoo,piercing,touchup,removal',
            'body_location' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'details' => 'nullable|array', // JSON input
            'date_completed' => 'required|date'
        ]);
        
        $service = Service::create($validated);
        
        // Trigger automated follow-up scheduling using internal service logic
        // if (class_exists('App\Services\EmailEngine')) {
        //     \App\Services\EmailEngine::scheduleFollowUps($service);
        // }

        return response()->json($service, 201);
    }

    /**
     * Get a specific service with photos.
     */
    public function show($id)
    {
        $service = Service::with(['photos', 'client', 'staff'])->findOrFail($id);
        return response()->json($service);
    }

    /**
     * Upload photos for a service.
     */
    public function uploadPhoto(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|max:10240', // 10MB max
            'stage' => 'required|in:before,stencil,fresh,healing,healed'
        ]);

        $service = Service::findOrFail($id);
        
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('service-photos/' . $service->client_id, 'public');
            
            $photo = ServicePhoto::create([
                'service_id' => $id,
                'client_id' => $service->client_id,
                'photo_path' => $path,
                'stage' => $request->stage
            ]);
            
            return response()->json($photo, 201);
        }
        
        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
