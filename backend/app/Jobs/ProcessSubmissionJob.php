<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Submission;

class ProcessSubmissionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $submission;

    public function __construct(Submission $submission)
    {
        $this->submission = $submission;
    }

    public function handle(): void
    {
        $this->submission->load('quest.rules');
        $quest = $this->submission->quest;
        $rulesArray = $quest->rules->pluck('rule')->toArray();

        try {
            $endpoint = "https://judge-service-campus-quest.vercel.app/api/evaluate";

            $response = Http::withoutVerifying()->post($endpoint, [
                'quest_title'       => $quest->title,
                'quest_description' => $quest->description,
                'rules'             => $rulesArray,
                'image_base64'      => $this->submission->image_base64,
            ]);

            if ($response->successful()) {
                $aiData = $response->json();
                
                $score = $aiData['score'] ?? 0;
                $feedback = $aiData['feedback'] ?? 'No feedback provided.';

                // Quality threshold: e.g., >= 50 passes
                $status = $score >= 50 ? 'graded' : 'rejected';
                $awardedPoints = $status === 'graded' ? (int) round(($score / 100) * $quest->max_points) : 0;

                DB::transaction(function () use ($status, $score, $awardedPoints, $feedback) {
                    $this->submission->update([
                        'status' => $status,
                        'score' => $score,
                        'awarded_points' => $awardedPoints,
                        'ai_feedback' => $feedback,
                    ]);

                    if ($awardedPoints > 0) {
                        $user = $this->submission->user;
                        $user->xp += $awardedPoints;
                        $user->total_points += $awardedPoints;
                        // Calculate level ups based on XP (e.g. 1000 XP per level)
                        $user->level = floor($user->xp / 1000) + 1;
                        $user->save();
                    }
                });
            } else {
                Log::error('Microservice API Error: ' . $response->body());
                $this->submission->update(['status' => 'rejected', 'ai_feedback' => 'System error during evaluation.']);
            }
        } catch (\Exception $e) {
            Log::error('Exception in ProcessSubmissionJob: ' . $e->getMessage());
            $this->submission->update(['status' => 'rejected', 'ai_feedback' => 'System error during evaluation.']);
        }
    }
}
