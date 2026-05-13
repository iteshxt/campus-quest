<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['title', 'description', 'emoji', 'color', 'deadline', 'visibility', 'join_code', 'host_id', 'max_points'])]
class Quest extends Model
{
    use HasUuids;

    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
            'max_points' => 'integer',
        ];
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function rules()
    {
        return $this->hasMany(QuestRule::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'quest_participants', 'quest_id', 'user_id')->withPivot('joined_at');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
