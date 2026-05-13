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
        Schema::create('submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('quest_id');
            $table->uuid('user_id');
            $table->string('image_url');
            $table->enum('status', ['pending', 'graded', 'rejected'])->default('pending');
            $table->integer('score')->nullable(); // 0-100
            $table->integer('awarded_points')->nullable();
            $table->text('ai_feedback')->nullable();
            
            $table->foreign('quest_id')->references('id')->on('quests')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
