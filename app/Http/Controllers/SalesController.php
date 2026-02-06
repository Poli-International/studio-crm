<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Models\Financial;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesController extends Controller
{
    /**
     * Process a simple retail sale (Jewelry, Aftercare, etc).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'inventory_id' => 'required|exists:inventory,id',
            'quantity' => 'required|integer|min:1',
            'amount' => 'required|numeric',
            'method' => 'required|in:cash,card,transfer,other',
            'client_id' => 'nullable|exists:clients,id',
            'staff_id' => 'required|exists:staff,id',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $item = Inventory::findOrFail($validated['inventory_id']);

            // 1. Check stock
            if ($item->quantity < $validated['quantity']) {
                return response()->json([
                    'error' => 'Insufficient stock for this item',
                    'available' => $item->quantity
                ], 422);
            }

            // 2. Decrement Inventory
            $item->decrement('quantity', $validated['quantity']);

            // 3. Record Financial-Retail Transaction
            $sale = Financial::create([
                'client_id' => $validated['client_id'],
                'staff_id' => $validated['staff_id'],
                'type' => 'retail',
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'transaction_date' => Carbon::now(),
                'status' => 'completed',
                'notes' => "Retail Sale: {$item->name} (Qty: {$validated['quantity']}). " . ($validated['notes'] ?? ''),
            ]);

            return response()->json([
                'message' => 'Sale processed successfully',
                'sale' => $sale,
                'remaining_stock' => $item->quantity
            ], 201);
        });
    }

    /**
     * List retail sales history.
     */
    public function index()
    {
        $sales = Financial::where('type', 'retail')
            ->with(['client', 'staff'])
            ->orderBy('transaction_date', 'desc')
            ->paginate(30);

        return response()->json($sales);
    }
}
