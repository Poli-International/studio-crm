<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicePhoto extends Model
{
    use HasFactory;

    protected $table = 'service_photos';

    // Disable updated_at as it's not in the original schema
    const UPDATED_AT = null;

    protected $fillable = [
        'service_id',
        'client_id',
        'photo_path',
        'stage',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}
