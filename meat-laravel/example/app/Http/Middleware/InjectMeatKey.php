<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Luciano\MeatLaravel\Helpers\MeatHasher;

class InjectMeatKey
{
    public function handle(Request $request, Closure $next)
{
    // Define your sync payload — can be dynamic if needed
    $payload = ['field' => 'message'];

    // Generate the hash using your helper
    $key = MeatHasher::hash($payload);

    // Share the key with all views
    view()->share('key', $key);

    return $next($request);
}
}
