<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compliance extends Model
{
    use HasFactory;

    protected $table = 'compliance';
    public $timestamps = false;

    protected $fillable = [
        'staff_id',
        'type',
        'log_date',
        'details',
        'status',
        'verified_by',
    ];

    protected $casts = [
        'log_date' => 'date',
        'details' => 'json',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function verifier()
    {
        return $this->belongsTo(Staff::class, 'verified_by');
    }
}
