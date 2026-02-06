<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * List documents for a client.
     */
    public function index(Request $request)
    {
        if (!$request->has('client_id')) {
            return response()->json(['error' => 'Client ID required'], 400);
        }

        $docs = Document::where('client_id', $request->client_id)
                        ->orderBy('uploaded_at', 'desc')
                        ->get();
                        
        return response()->json($docs);
    }

    /**
     * Upload a new document (Consent form, ID scan, etc).
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'type' => 'required|in:id_scan,medical_note,reference_image,other',
            'file' => 'required|file|max:10240', // 10MB
            'description' => 'nullable|string'
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('secure-docs/' . $request->client_id);

            $doc = Document::create([
                'client_id' => $request->client_id,
                'type' => $request->type,
                'file_path' => $path,
                'description' => $request->description
            ]);

            return response()->json($doc, 201);
        }

        return response()->json(['error' => 'No file provided'], 400);
    }

    /**
     * Download a document.
     */
    public function download($id)
    {
        $doc = Document::findOrFail($id);
        
        // Permission checks would go here

        if (Storage::exists($doc->file_path)) {
            return Storage::download($doc->file_path);
        }

        return response()->json(['error' => 'File not found'], 404);
    }
}
