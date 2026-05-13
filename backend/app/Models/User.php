<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['id', 'name', 'email', 'handle', 'avatar_emoji', 'level', 'xp', 'streak', 'total_points'])]
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The primary key type.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'level' => 'integer',
            'xp' => 'integer',
            'streak' => 'integer',
            'total_points' => 'integer',
        ];
    }

    public function questsHosted()
    {
        return $this->hasMany(Quest::class, 'host_id');
    }

    public function questsJoined()
    {
        return $this->belongsToMany(Quest::class, 'quest_participants', 'user_id', 'quest_id')->withPivot('joined_at');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
