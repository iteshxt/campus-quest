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
        Schema::create('quest_participants', function (Blueprint $table) {
            $table->uuid('quest_id');
            $table->uuid('user_id');
            $table->timestamp('joined_at')->useCurrent();
            
            $table->foreign('quest_id')->references('id')->on('quests')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->primary(['quest_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quest_participants');
    }
};
