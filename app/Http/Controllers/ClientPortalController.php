<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Document;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ClientPortalController extends Controller
{
    /**
     * Client Registration for the Portal.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:clients',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string',
            'profession' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $client = Client::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password_hash' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
            'profession' => $validated['profession'],
            'address' => $validated['address'],
        ]);

        $token = $client->createToken('client_portal_token')->plainTextToken;

        return response()->json([
            'message' => 'Client account created',
            'token' => $token,
            'client' => $client
        ], 201);
    }

    /**
     * Get the client's own profile and history.
     */
    public function me(Request $request)
    {
        $client = $request->user();
        return response()->json(
            $client->load(['appointments', 'services', 'forms', 'documents'])
        );
    }

    /**
     * Allow client to upload a design reference or enquiry.
     */
    public function uploadDesign(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480', // 20MB Max
            'description' => 'nullable|string'
        ]);

        $client = $request->user();
        
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('client-uploads/' . $client->id, 'public');

            $doc = Document::create([
                'client_id' => $client->id,
                'type' => 'design_reference',
                'file_path' => $path,
                'description' => $request->description,
                'uploaded_by_client' => true
            ]);

            return response()->json($doc, 201);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
