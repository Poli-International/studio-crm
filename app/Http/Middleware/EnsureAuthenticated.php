<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAuthenticated
{
    public function handle(Request $request, Closure $next)
    {
        if (!session('authenticated')) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
