<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compliance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->nullable()->constrained('staff');
            $table->string('type', 50);
            $table->date('log_date');
            $table->json('details')->nullable();
            $table->string('status', 20)->default('pass');
            $table->foreignId('verified_by')->nullable()->constrained('staff');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compliance');
    }
};
