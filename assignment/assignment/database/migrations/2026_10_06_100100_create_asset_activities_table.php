<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $table->string('status');
            $table->dateTime('started_at');
            $table->dateTime('ended_at');
            $table->integer('duration_minutes')->default(0);
            $table->decimal('distance_km', 8, 2)->default(0);
            $table->integer('messages_count')->default(0);
            $table->timestamps();

            $table->index(['asset_id', 'started_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_activities');
    }
};
