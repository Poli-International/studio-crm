<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('clients');
            $table->foreignId('service_id')->nullable()->constrained('services');
            $table->foreignId('staff_id')->nullable()->constrained('staff');
            $table->enum('type', ['payment', 'refund', 'expense', 'deposit']);
            $table->decimal('amount', 10, 2);
            $table->string('method', 50)->nullable();
            $table->string('source', 50)->nullable();
            $table->string('external_order_id', 255)->nullable();
            $table->dateTime('transaction_date');
            $table->string('status', 20)->default('completed');
            $table->text('notes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial');
    }
};
