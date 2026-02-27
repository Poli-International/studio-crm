<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('clients');
            $table->enum('type', ['id_scan', 'design_reference', 'msds', 'autoclave_log', 'certificate', 'license', 'other']);
            $table->string('file_path', 255);
            $table->string('description', 255)->nullable();
            $table->boolean('uploaded_by_client')->default(false);
            $table->timestamp('uploaded_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
