<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;

class InventoryController extends Controller
{
    /**
     * List all inventory items.
     */
    public function index()
    {
        return response()->json(Inventory::all());
    }

    /**
     * Store a new inventory item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'item_type' => 'required|in:needle,ink,jewelry,supply,equipment',
            'sku' => 'nullable|string|unique:inventory',
            'quantity' => 'required|integer|min:0',
            'reorder_point' => 'required|integer|min:1',
            'details' => 'nullable|array',
            'supplier_info' => 'nullable|string',
        ]);
        
        return response()->json(Inventory::create($validated), 201);
    }
    
    /**
     * Get items that are at or below their reorder point.
     */
    public function lowStockAlerts()
    {
        $lowStock = Inventory::whereColumn('quantity', '<=', 'reorder_point')->get();
        return response()->json($lowStock);
    }
    
    /**
     * Quickly restock an item.
     */
    public function restock(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        
        $item = Inventory::findOrFail($id);
        $item->increment('quantity', $request->quantity);
        
        return response()->json($item);
    }

    /**
     * Update an inventory item.
     */
    public function update(Request $request, $id)
    {
        $item = Inventory::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
            'quantity' => 'integer|min:0',
            'reorder_point' => 'integer|min:1',
            'details' => 'nullable|array',
        ]);

        $item->update($validated);
        return response()->json($item);
    }
}
