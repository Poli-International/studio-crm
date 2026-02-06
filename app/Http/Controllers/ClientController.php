<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Service;
use App\Models\Form;

class ClientController extends Controller
{
    /**
     * Display a listing of clients.
     */
    public function index(Request $request)
    {
        $query = Client::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:clients',
            'phone' => 'nullable|string',
            'dob' => 'nullable|date',
        ]);

        $client = Client::create($validated);
        return response()->json($client, 201);
    }

    /**
     * Display the specified client.
     */
    public function show($id)
    {
        $client = Client::with(['appointments', 'services'])->findOrFail($id);
        
        // Decrypt medical info if authorized
        // In Laravel we would use a Cast or middleware, but keeping original logic as placeholder
        // if ($client->medical_history) {
        //     $client->medical_history = decrypt($client->medical_history);
        // }
        
        return response()->json($client);
    }

    /**
     * Update the specified client.
     */
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:100',
            'email' => 'email|unique:clients,email,'.$id,
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'phone' => 'nullable|string',
            'dob' => 'nullable|date',
        ]);

        // Encrypt medical info before saving
        // if(isset($validated['medical_history'])) {
        //     $validated['medical_history'] = encrypt($validated['medical_history']);
        // }

        $client->update($validated);
        return response()->json($client);
    }

    /**
     * Get client history (services, appointments).
     */
    public function history($id)
    {
        $history = Service::where('client_id', $id)
                          ->with('staff')
                          ->orderBy('date_completed', 'desc')
                          ->get();
                          
        return response()->json($history);
    }

    public function forms($id)
    {
        $forms = Form::where('client_id', $id)->orderBy('signed_at', 'desc')->get();
        return response()->json($forms);
    }
}
