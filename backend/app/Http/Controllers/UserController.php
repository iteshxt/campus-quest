<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function me(Request $request)
    {
        $user = Auth::user();
        $user->loadCount(['questsHosted', 'questsJoined']);
        $user->load(['questsJoined' => function($q) {
            $q->withCount(['participants', 'submissions'])->with('host:id,name,avatar_emoji');
        }, 'questsHosted' => function($q) {
            $q->withCount(['participants', 'submissions'])->with('host:id,name,avatar_emoji');
        }]);
        
        return response()->json($user);
    }

    public function leaderboard()
    {
        $leaders = User::orderByDesc('total_points')
            ->orderByDesc('xp')
            ->take(50)
            ->get(['id', 'name', 'handle', 'avatar_emoji', 'level', 'total_points', 'streak']);
            
        return response()->json($leaders);
    }
}
