<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quest;
use App\Models\Submission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ProcessSubmissionJob;

class SubmissionController extends Controller
{
    public function index($id)
    {
        $quest = Quest::where(function($q) use ($id) {
            if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $id)) {
                $q->where('id', $id);
            }
            $q->orWhere('join_code', strtoupper($id));
        })->firstOrFail();

        $submissions = $quest->submissions()
            ->with('user:id,name,avatar_emoji')
            ->latest()
            ->take(12)
            ->get();
            
        return response()->json($submissions);
    }

    public function show(Submission $submission)
    {
        return response()->json($submission);
    }

    public function image(Submission $submission)
    {
        if (!$submission->image_base64) {
            abort(404);
        }

        // Handle both data URI and raw base64
        $data = $submission->image_base64;
        if (strpos($data, ',') !== false) {
            [$type, $data] = explode(',', $data);
            $type = str_replace(['data:', ';base64'], '', $type);
        } else {
            $type = 'image/jpeg';
        }

        return response(base64_decode($data))
            ->header('Content-Type', $type)
            ->header('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    }

    public function store(Request $request, $id)
    {
        $quest = Quest::where(function($q) use ($id) {
            if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $id)) {
                $q->where('id', $id);
            }
            $q->orWhere('join_code', strtoupper($id));
        })->firstOrFail();

        $request->validate([
            'image_base64' => 'required|string',
        ]);

        $user = Auth::user();

        // Check if user joined the quest
        if (!$quest->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'You must join the quest first'], 403);
        }

        $submission = $quest->submissions()->create([
            'user_id' => $user->id,
            'image_base64' => $request->image_base64,
            'status' => 'pending',
        ]);

        // Dispatch job to evaluate the submission using Gemma
        ProcessSubmissionJob::dispatch($submission);

        return response()->json([
            'message' => 'Submission received and is being processed',
            'submission' => $submission
        ], 201);
    }
}
