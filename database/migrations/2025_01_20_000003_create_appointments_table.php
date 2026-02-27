<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('staff_id')->constrained('staff');
            $table->enum('service_type', ['tattoo', 'piercing', 'consultation', 'touchup', 'removal']);
            $table->dateTime('datetime');
            $table->integer('duration_minutes')->default(60);
            $table->decimal('deposit_amount', 10, 2)->default(0.00);
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled', 'noshow'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
