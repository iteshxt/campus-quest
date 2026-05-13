<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\JWK;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SupabaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Unauthorized - Token not provided'], 401);
        }

        try {
            $secret = env('SUPABASE_JWT_SECRET');
            
            if (empty($secret)) {
                throw new \Exception('SUPABASE_JWT_SECRET is not set in backend/.env');
            }

            // Peek at the algorithm in the header
            $tks = explode('.', $token);
            if (count($tks) !== 3) {
                throw new \Exception('Invalid token format');
            }
            
            $headerJson = base64_decode($tks[0]);
            $header = json_decode($headerJson);
            $alg = $header->alg ?? 'HS256';

            $decoded = null;

            if ($alg === 'ES256') {
                $jwks = env('SUPABASE_JWKS');
                if (!empty($jwks)) {
                    $keys = JWK::parseKeySet(json_decode($jwks, true));
                    $decoded = JWT::decode($token, $keys);
                } else {
                    $publicKey = env('SUPABASE_PUBLIC_KEY');
                    if (empty($publicKey)) {
                        throw new \Exception('ES256 detected but neither SUPABASE_JWKS nor SUPABASE_PUBLIC_KEY is set in backend/.env');
                    }
                    $decoded = JWT::decode($token, new Key($publicKey, 'ES256'));
                }
            } else {
                try {
                    $decoded = JWT::decode($token, new Key($secret, $alg));
                } catch (\Exception $e) {
                    if (str_contains($e->getMessage(), 'key') || str_contains($e->getMessage(), 'algorithm')) {
                        $decoded = JWT::decode($token, new Key(base64_decode(strtr($secret, '-_', '+/')), $alg));
                    } else {
                        throw $e;
                    }
                }
            }

            $userId = $decoded->sub;

            // Find or create the user
            $user = User::where('id', $userId)->first();
            
            if (!$user) {
                $adjectives = ['Silent', 'Swift', 'Bold', 'Golden', 'Mystic', 'Daring', 'Wild', 'Epic', 'Alpha'];
                $nouns = ['Koala', 'Falcon', 'Scout', 'Hunter', 'Seeker', 'Ranger', 'Knight', 'Pathfinder', 'Legend'];
                
                $generatedName = $adjectives[array_rand($adjectives)] . ' ' . $nouns[array_rand($nouns)];
                $cleanHandle = strtolower($nouns[array_rand($nouns)]) . '_' . substr($userId, 0, 4);

                $user = User::create([
                    'id' => $userId,
                    'name' => $decoded->user_metadata->full_name ?? $generatedName,
                    'email' => $decoded->email ?? null,
                    'handle' => '@' . ($decoded->user_metadata->user_name ?? $cleanHandle),
                    'avatar_emoji' => '🐨',
                    'level' => 1,
                    'xp' => 0,
                    'streak' => 0,
                    'total_points' => 0,
                ]);
            }

            Auth::login($user);

            return $next($request);

        } catch (\Exception $e) {
            Log::error('Supabase Auth Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Unauthorized - Invalid token',
                'details' => $e->getMessage()
            ], 401);
        }
    }
}