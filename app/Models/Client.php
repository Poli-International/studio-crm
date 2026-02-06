<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Client extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'clients';

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'phone',
        'dob',
        'address',
        'profession',
        'website',
        'medical_history',
        'allergies',
        'photo_url',
        'notes',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'client_id');
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'client_id');
    }

    public function forms()
    {
        return $this->hasMany(Form::class, 'client_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'client_id');
    }
}
