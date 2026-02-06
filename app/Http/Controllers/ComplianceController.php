<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Compliance;
use Illuminate\Support\Facades\Validator;

class ComplianceController extends Controller
{
    /**
     * Get all compliance logs, optionally filtered by type.
     */
    public function index(Request $request)
    {
        $query = Compliance::with('staff')->orderBy('log_date', 'desc');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Store a new compliance record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:autoclave_log,spore_test,maintenance,training,incident',
            'log_date' => 'required|date',
            'details' => 'required|array', // JSON
            'status' => 'required|in:pass,fail,needs_review',
            'staff_id' => 'required|exists:staff,id'
        ]);

        // Auto-check logic: If spore test fails, alert admin
        if ($validated['type'] === 'spore_test' && $validated['status'] === 'fail') {
            // Trigger emergency contact logic
        }

        $record = Compliance::create($validated);
        return response()->json($record, 201);
    }

    /**
     * Get statistics for the dashboard.
     */
    public function stats()
    {
        $total = Compliance::count();
        $failed = Compliance::where('status', 'fail')->count();
        $lastSporeTest = Compliance::where('type', 'spore_test')->latest('log_date')->first();

        return response()->json([
            'total_logs' => $total,
            'failed_logs' => $failed,
            'last_spore_test' => $lastSporeTest ? $lastSporeTest->log_date : 'Never',
            'compliance_rate' => $total > 0 ? round((($total - $failed) / $total) * 100) . '%' : '100%'
        ]);
    }
}
