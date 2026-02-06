<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $table = 'services';
    public $timestamps = false;

    protected $fillable = [
        'client_id',
        'staff_id',
        'appointment_id',
        'type',
        'body_location',
        'machine_tools',
        'materials_used',
        'practitioner_notes',
        'price',
        'execution_photo_url',
        'date_completed',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'date_completed' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function photos()
    {
        return $this->hasMany(ServicePhoto::class, 'service_id');
    }
}
