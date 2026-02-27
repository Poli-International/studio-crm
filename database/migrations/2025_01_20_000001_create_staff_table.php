<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('user_uuid', 36);
            $table->string('name', 100);
            $table->string('email', 100)->unique();
            $table->string('password_hash', 255);
            $table->enum('role', ['admin', 'manager', 'artist', 'receptionist'])->default('artist');
            $table->text('specialties')->nullable();
            $table->decimal('commission_rate', 5, 2)->default(0.00);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
