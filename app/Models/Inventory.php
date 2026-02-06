<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'item_type',
        'sku',
        'quantity',
        'reorder_point',
        'details',
        'supplier_info',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'reorder_point' => 'integer',
        'details' => 'json',
    ];
}
