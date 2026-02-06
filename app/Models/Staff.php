<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Staff extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'staff';

    protected $fillable = [
        'user_uuid',
        'name',
        'email',
        'password_hash',
        'role',
        'specialties',
        'commission_rate',
        'active',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        'specialties' => 'array',
        'commission_rate' => 'decimal:2',
        'active' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'staff_id');
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'staff_id');
    }

    public function financialTransactions()
    {
        return $this->hasMany(Financial::class, 'staff_id');
    }

    public function complianceLogs()
    {
        return $this->hasMany(Compliance::class, 'staff_id');
    }
}
