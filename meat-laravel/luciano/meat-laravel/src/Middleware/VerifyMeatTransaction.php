<?php

namespace Luciano\MeatLaravel\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class VerifyMeatTransaction
{
    public function handle(Request $request, Closure $next)
    {
        $payload = $request->input('data') ?? [];
        $clientHash = $request->header('X-Meat-Hash');
        $secret = env('MEAT_SECRET', 'default_secret');

        // Server-side hash
        $serverHash = hash_hmac('sha256', json_encode($payload), $secret);

        if (!hash_equals($clientHash, $serverHash)) {
            throw new HttpException(403, 'MEAT payload hash verification failed.');
        }

        return $next($request);
    }
}
