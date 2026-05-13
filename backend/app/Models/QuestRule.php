<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['quest_id', 'rule'])]
class QuestRule extends Model
{
    use HasUuids;

    public function quest()
    {
        return $this->belongsTo(Quest::class);
    }
}
