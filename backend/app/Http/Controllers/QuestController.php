<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quest;
use App\Models\QuestRule;
use Illuminate\Support\Facades\Auth;

class QuestController extends Controller
{
    public function index(Request $request)
    {
        $query = Quest::with(['host:id,name,avatar_emoji'])->withCount(['participants', 'submissions']);
        
        if ($request->has('join_code')) {
            $query->where('join_code', strtoupper($request->join_code));
        } elseif ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where(function($sq) use ($search) {
                    $sq->where('visibility', 'public')
                       ->where(function($ssq) use ($search) {
                           $ssq->where('title', 'like', "%{$search}%")
                               ->orWhere('description', 'like', "%{$search}%");
                       });
                })->orWhere('join_code', strtoupper($search));
            });
        } elseif ($request->has('visibility')) {
            $query->where('visibility', $request->visibility);
        } else {
            $query->where('visibility', 'public');
        }

        $quests = $query->latest()->get();
        return response()->json($quests);
    }

    public function show($id)
    {
        $quest = Quest::where(function($q) use ($id) {
            // Only search by ID if it's a valid UUID format to avoid Postgres errors
            if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $id)) {
                $q->where('id', $id);
            }
            $q->orWhere('join_code', strtoupper($id));
        })->firstOrFail();

        $quest->load(['host:id,name,avatar_emoji', 'rules']);
        $quest->participants_count = $quest->participants()->count();
        $quest->submissions_count = $quest->submissions()->count();
        $quest->is_joined = Auth::check() ? $quest->participants()->where('user_id', Auth::id())->exists() : false;

        return response()->json($quest);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'emoji' => 'nullable|string',
            'color' => 'nullable|string',
            'deadline' => 'nullable|date',
            'visibility' => 'in:public,private',
            'max_points' => 'integer|min:0',
            'rules' => 'required|array|min:1',
            'rules.*' => 'string|max:255'
        ]);

        $quest = Auth::user()->questsHosted()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'emoji' => $validated['emoji'],
            'color' => $validated['color'],
            'deadline' => $validated['deadline'] ?? null,
            'visibility' => $validated['visibility'] ?? 'public',
            'join_code' => strtoupper(bin2hex(random_bytes(3))), // 6 chars
            'max_points' => $validated['max_points'] ?? 100,
        ]);

        foreach ($validated['rules'] as $ruleText) {
            $quest->rules()->create(['rule' => $ruleText]);
        }

        return response()->json($quest->load('rules'), 201);
    }

    public function join($id)
    {
        $quest = Quest::where(function($q) use ($id) {
            if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $id)) {
                $q->where('id', $id);
            }
            $q->orWhere('join_code', strtoupper($id));
        })->firstOrFail();

        $user = Auth::user();
        
        if ($quest->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Already joined this quest'], 400);
        }

        $quest->participants()->attach($user->id);

        return response()->json(['message' => 'Successfully joined quest']);
    }
}
