<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['quest_id', 'user_id', 'joined_at'])]
class QuestParticipant extends Pivot
{
    protected $table = 'quest_participants';
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
        ];
    }
}
