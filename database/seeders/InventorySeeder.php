<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Black Ink (Eternal)', 'item_type' => 'ink', 'sku' => 'INK-BLK-01', 'quantity' => 12, 'reorder_point' => 5],
            ['name' => 'Liner Needles 3RL', 'item_type' => 'needle', 'sku' => 'NDL-3RL-01', 'quantity' => 3, 'reorder_point' => 10],
            ['name' => 'Shader Needles 7M1', 'item_type' => 'needle', 'sku' => 'NDL-7M1-01', 'quantity' => 45, 'reorder_point' => 10],
            ['name' => 'Red Ink (Intenze)', 'item_type' => 'ink', 'sku' => 'INK-RED-01', 'quantity' => 8, 'reorder_point' => 5],
            ['name' => 'Blue Ink (Eternal)', 'item_type' => 'ink', 'sku' => 'INK-BLU-01', 'quantity' => 2, 'reorder_point' => 5],
            ['name' => 'Titanium Labret 16g', 'item_type' => 'jewelry', 'sku' => 'JWL-LAB-01', 'quantity' => 28, 'reorder_point' => 10],
            ['name' => 'Surgical Steel CBR 14g', 'item_type' => 'jewelry', 'sku' => 'JWL-CBR-01', 'quantity' => 15, 'reorder_point' => 8],
            ['name' => 'Aftercare Balm', 'item_type' => 'aftercare', 'sku' => 'AFC-BLM-01', 'quantity' => 34, 'reorder_point' => 15],
            ['name' => 'Nitrile Gloves (L)', 'item_type' => 'supply', 'sku' => 'SUP-GLV-01', 'quantity' => 200, 'reorder_point' => 50],
            ['name' => 'Stencil Paper', 'item_type' => 'supply', 'sku' => 'SUP-STP-01', 'quantity' => 85, 'reorder_point' => 20],
        ];

        foreach ($items as $i) {
            Inventory::create($i);
        }
    }
}
