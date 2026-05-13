<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->string('emoji')->nullable();
            $table->string('color')->nullable();
            $table->timestamp('deadline')->nullable();
            $table->enum('visibility', ['public', 'private'])->default('public');
            $table->uuid('host_id');
            $table->foreign('host_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('max_points')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quests');
    }
};
