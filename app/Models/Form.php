<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $table = 'forms';
    public $timestamps = false;

    protected $fillable = [
        'client_id',
        'template_id',
        'form_type',
        'data',
        'signature_data',
        'signed_at',
        'pdf_path',
    ];

    protected $casts = [
        'data' => 'json',
        'signed_at' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}
