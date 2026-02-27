<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!in_array(session('user_role'), $roles)) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
