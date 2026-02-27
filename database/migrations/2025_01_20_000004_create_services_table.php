<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('staff_id')->constrained('staff');
            $table->foreignId('appointment_id')->nullable()->constrained('appointments');
            $table->enum('type', ['tattoo', 'piercing', 'touchup', 'removal']);
            $table->string('body_location', 100);
            $table->text('machine_tools')->nullable();
            $table->text('materials_used')->nullable();
            $table->text('practitioner_notes')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('execution_photo_url', 255)->nullable();
            $table->dateTime('date_completed');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
