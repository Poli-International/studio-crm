<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Financial;
use Carbon\Carbon;

class FinancialController extends Controller
{
    /**
     * Get financial dashboard metrics.
     */
    public function dashboard()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $dailyRevenue = Financial::where('type', 'payment')
            ->whereDate('transaction_date', $today)
            ->sum('amount');
            
        $monthlyRevenue = Financial::where('type', 'payment')
            ->whereDate('transaction_date', '>=', $startOfMonth)
            ->sum('amount');

        $retailRevenue = Financial::where('type', 'retail')
            ->whereDate('transaction_date', '>=', $startOfMonth)
            ->sum('amount');

        return response()->json([
            'daily_revenue' => $dailyRevenue,
            'monthly_service_revenue' => $monthlyRevenue,
            'monthly_retail_revenue' => $retailRevenue,
            'total_monthly' => $monthlyRevenue + $retailRevenue,
            'last_updated' => Carbon::now()->toDateTimeString()
        ]);
    }

    /**
     * Store a new financial record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'service_id' => 'nullable|exists:services,id',
            'staff_id' => 'nullable|exists:staff,id',
            'amount' => 'required|numeric',
            'type' => 'required|in:deposit,payment,refund,expense',
            'method' => 'required|in:cash,card,transfer,other',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $financial = Financial::create($validated);
        return response()->json($financial, 201);
    }

    /**
     * List financial transactions with pagination and filters.
     */
    public function index(Request $request)
    {
        $query = Financial::with(['client', 'staff', 'service']);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('transaction_date', [$request->start_date, $request->end_date]);
        }

        return response()->json($query->orderBy('transaction_date', 'desc')->paginate(30));
    }
}
