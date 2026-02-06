<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Models\Financial;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OnlineStoreIntegrationController extends Controller
{
    /**
     * Handle incoming webhook from Online Store (e.g. WooCommerce).
     * This automatically syncs online sales with local CRM inventory.
     */
    public function handleWebhook(Request $request)
    {
        // Simple security check - you can set an INTEGRATION_KEY in your .env
        $key = $request->header('X-Integration-Key');
        if ($key !== config('app.integration_key')) {
            return response()->json(['error' => 'Unauthorized integration'], 401);
        }

        $data = $request->all();
        
        // Expected data: external_order_id, sku, quantity, total_amount
        $orderId = $data['order_id'] ?? null;
        $sku = $data['sku'] ?? null;
        $quantity = $data['quantity'] ?? 1;
        $amount = $data['total'] ?? 0;

        if (!$sku || !$orderId) {
            return response()->json(['error' => 'Missing required order data'], 400);
        }

        return DB::transaction(function () use ($orderId, $sku, $quantity, $amount) {
            $item = Inventory::where('sku', $sku)->first();

            if (!$item) {
                Log::warning("Online order received for unknown SKU: {$sku}");
                return response()->json(['error' => 'SKU not found in CRM inventory'], 404);
            }

            // 1. Deduct Stock
            $item->decrement('quantity', $quantity);

            // 2. Record Financial Transaction (Marked as Online)
            Financial::create([
                'type' => 'retail',
                'source' => 'online',
                'external_order_id' => $orderId,
                'amount' => $amount,
                'method' => 'other', // Online payment handled externally
                'transaction_date' => now(),
                'status' => 'completed',
                'notes' => "Automatic sync from Online Shop. Item: {$item->name}",
            ]);

            return response()->json(['status' => 'success', 'message' => 'Inventory and sales synced']);
        });
    }
}
