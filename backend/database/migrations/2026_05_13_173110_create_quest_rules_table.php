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
        Schema::create('quest_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('quest_id');
            $table->foreign('quest_id')->references('id')->on('quests')->onDelete('cascade');
            $table->string('rule');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quest_rules');
    }
};
