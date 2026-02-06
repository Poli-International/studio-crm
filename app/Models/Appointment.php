<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';
    public $timestamps = false;

    protected $fillable = [
        'client_id',
        'staff_id',
        'service_type',
        'datetime',
        'duration_minutes',
        'deposit_amount',
        'status',
        'notes',
        'google_event_id',
    ];

    protected $casts = [
        'datetime' => 'datetime',
        'duration_minutes' => 'integer',
        'deposit_amount' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function service()
    {
        return $this->hasOne(Service::class, 'appointment_id');
    }
}
