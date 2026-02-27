<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('item_type', 50);
            $table->string('sku', 50)->nullable();
            $table->integer('quantity')->default(0);
            $table->integer('reorder_point')->default(5);
            $table->json('details')->nullable();
            $table->text('supplier_info')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
