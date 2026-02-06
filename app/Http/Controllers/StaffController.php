<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    public function index()
    {
        $staffMembers = Staff::orderBy('name')->get();
        return view('staff.index', compact('staffMembers'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:staff,email',
            'role' => 'required|in:admin,manager,artist,receptionist',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'specialties' => 'nullable|string',
        ]);

        // Generate a random temporary password
        $tempPassword = Str::random(10);
        
        $specialties = $request->specialties ? array_map('trim', explode(',', $request->specialties)) : [];

        $staff = Staff::create([
            'user_uuid' => (string) Str::uuid(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password_hash' => Hash::make($tempPassword),
            'role' => $validated['role'],
            'commission_rate' => $validated['commission_rate'] ?? 0,
            'specialties' => $specialties,
            'active' => true,
        ]);

        // In a real application, you would mail $tempPassword to the user here
        // Mail::to($staff->email)->send(new StaffWelcome($staff, $tempPassword));

        return redirect()->back()->with('success', "Team member created! Temporary password: " . $tempPassword);
    }
}
