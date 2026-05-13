<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['quest_id', 'user_id', 'image_url', 'image_base64', 'status', 'score', 'awarded_points', 'ai_feedback'])]
class Submission extends Model
{
    use HasUuids;

    protected $hidden = [
        'image_base64',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'awarded_points' => 'integer',
        ];
    }

    public function quest()
    {
        return $this->belongsTo(Quest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
