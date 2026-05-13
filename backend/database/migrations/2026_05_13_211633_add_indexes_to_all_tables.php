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
        Schema::table('quests', function (Blueprint $table) {
            $table->index('host_id');
            $table->index('visibility');
            $table->index('join_code');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->index('quest_id');
            $table->index('user_id');
            $table->index('status');
        });

        Schema::table('quest_participants', function (Blueprint $table) {
            $table->index('quest_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('all_tables', function (Blueprint $table) {
            //
        });
    }
};
