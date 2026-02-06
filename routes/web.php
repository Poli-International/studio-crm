<?php

use Illuminate\Support\Facades\Route;
use App\Models\Client;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\GalleryController;
use App\Models\Appointment;
use App\Models\Financial;
use App\Models\Staff;
use App\Models\Service;
use App\Models\Inventory;
use App\Models\Form;
use App\Models\Compliance;
use App\Models\Document;
use Illuminate\Http\Request;
use Carbon\Carbon;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Main Dashboard (Requires pseudo-auth)
Route::get('/', function () {
    if (!session('authenticated')) {
        return view('landing');
    }

    // Auto-repair session for users from old demo versions or social login glitches
    if (!session('user_role')) {
        $userId = session('user_id');
        $staff = $userId ? Staff::find($userId) : null;
        
        // Default to manager for demo/admin access if role missing
        session(['user_role' => $staff ? $staff->role : 'manager']);
    }

    $today = Carbon::today();
    
    $stats = [
        'appointmentsToday' => Appointment::whereDate('datetime', $today)->count(),
        'revenueToday' => Financial::whereDate('transaction_date', $today)->where('type', 'payment')->sum('amount'),
        'activeClients' => Client::count(),
    ];

    $appointments = Appointment::with('client')
        ->whereDate('datetime', '>=', $today)
        ->orderBy('datetime')
        ->limit(10)
        ->get();

    $allClients = Client::orderBy('name')->get();
    $allStaff = Staff::where('active', 1)->get();

    return view('dashboard.index', compact('stats', 'appointments', 'allClients', 'allStaff'));
})->name('dashboard');

// Auth Routes
Route::get('/login', function () {
    if (session('authenticated')) return redirect()->route('dashboard');
    return view('auth.login');
})->name('login');

Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');
    $staff = Staff::where('email', $credentials['email'])->first();

    if ($staff && Hash::check($credentials['password'], $staff->password_hash)) {
        session([
            'authenticated' => true, 
            'user_id' => $staff->id, 
            'user_name' => $staff->name,
            'user_role' => $staff->role
        ]);
        return redirect()->route('dashboard');
    }

    return redirect()->back()->with('error', 'Invalid credentials. Please try again or Join for Free.');
})->name('login.post');

Route::get('/register', function () {
    if (session('authenticated')) return redirect()->route('dashboard');
    return view('auth.register');
})->name('register');

Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:staff,email',
        'password' => 'required|string|min:6',
    ]);

    $staff = Staff::create([
        'user_uuid' => (string) Str::uuid(),
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password_hash' => Hash::make($validated['password']),
        'role' => 'manager',
        'active' => true,
    ]);

    session([
        'authenticated' => true, 
        'user_id' => $staff->id, 
        'user_name' => $staff->name,
        'user_role' => $staff->role
    ]);
    return redirect()->route('dashboard');
})->name('register.post');

Route::get('/logout', function () {
    session()->flush();
    return redirect()->route('dashboard');
})->name('logout');

// Staff Management Routes
Route::get('/team', [StaffController::class, 'index'])->name('staff.index');
Route::post('/team', [StaffController::class, 'store'])->name('staff.store');

// Studio Gallery Routes
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');
Route::post('/gallery', [GalleryController::class, 'store'])->name('gallery.store');

// Social Auth Routes
Route::get('/auth/{provider}', function ($provider) {
    if (!in_array($provider, ['google', 'facebook'])) abort(404);
    
    // In a real production environment with Socialite installed:
    // return Socialite::driver($provider)->redirect();
    
    // For now, we simulate the redirect to demonstrate the flow
    return redirect()->route('auth.callback', ['provider' => $provider]);
})->name('social.login');

Route::get('/auth/{provider}/callback', function ($provider) {
    if (!in_array($provider, ['google', 'facebook'])) abort(404);

    // This is where we would handle the user data from Google/Facebook
    // and log them in or create a new account.
    
    // Simulating a successful social login for the demo:
    $dummyEmail = "social-" . $provider . "@example.com";
    $staff = Staff::firstOrCreate(
        ['email' => $dummyEmail],
        [
            'user_uuid' => (string) Str::uuid(),
            'name' => ucfirst($provider) . " User",
            'password_hash' => Hash::make(Str::random(16)),
            'role' => 'manager',
            'active' => true,
        ]
    );

    session([
        'authenticated' => true, 
        'user_id' => $staff->id, 
        'user_name' => $staff->name,
        'user_role' => $staff->role
    ]);
    return redirect()->route('dashboard');
})->name('auth.callback');

// Appointment Routes
Route::get('/appointments', function () {
    $appointments = Appointment::with(['client', 'staff'])
        ->orderBy('datetime', 'desc')
        ->paginate(20);
    return view('appointments.index', compact('appointments'));
})->name('appointments.index');

Route::post('/appointments', function (Request $request) {
    $validated = $request->validate([
        'client_id' => 'required|exists:clients,id',
        'staff_id' => 'required|exists:staff,id',
        'service_type' => 'required|string',
        'datetime' => 'required|date',
        'duration_minutes' => 'required|integer|min:15',
    ]);

    Appointment::create($validated);

    return redirect()->back()->with('success', 'Appointment scheduled successfully!');
})->name('appointments.store');

// Client Routes
Route::get('/clients', function () {
    $clients = Client::orderBy('name')->paginate(20);
    return view('clients.index', compact('clients'));
})->name('clients.index');

Route::post('/clients', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:clients,email',
        'phone' => 'nullable|string|max:20',
        'profession' => 'nullable|string|max:100',
    ]);

    Client::create($validated);

    return redirect()->back()->with('success', 'Client added successfully!');
})->name('clients.store');

Route::get('/clients/{client}', function (Client $client) {
    $allStaff = Staff::where('active', 1)->orderBy('name')->get();
    return view('clients.show', compact('client', 'allStaff'));
})->name('clients.show');

// Services Routes
Route::get('/services', function () {
    $services = Service::with(['client', 'staff'])
        ->orderBy('date_completed', 'desc')
        ->paginate(20);
    return view('services.index', compact('services'));
})->name('services.index');

// Financial Routes
Route::get('/financial', function () {
    $transactions = Financial::with('client')
        ->orderBy('transaction_date', 'desc')
        ->paginate(20);

    $stats = [
        'totalRevenue' => Financial::where('type', 'payment')->sum('amount'),
        'avgTransaction' => Financial::where('type', 'payment')->avg('amount') ?? 0,
    ];

    return view('financial.index', compact('transactions', 'stats'));
})->name('financial.index');

Route::post('/financial', function (Request $request) {
    $validated = $request->validate([
        'client_id' => 'required|exists:clients,id',
        'amount' => 'required|numeric|min:0',
        'method' => 'required|string',
    ]);

    $staff = Staff::first();

    Financial::create([
        'client_id' => $validated['client_id'],
        'staff_id' => $staff ? $staff->id : 1,
        'type' => 'payment',
        'amount' => $validated['amount'],
        'method' => $validated['method'],
        'transaction_date' => now(),
        'status' => 'completed',
        'source' => 'in-studio'
    ]);

    return redirect()->back()->with('success', 'Payment recorded successfully!');
})->name('financial.store');

// Inventory Routes
Route::get('/inventory', function () {
    $inventory = Inventory::orderBy('name')->paginate(20);
    return view('inventory.index', compact('inventory'));
})->name('inventory.index');

Route::post('/inventory', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'item_type' => 'required|string',
        'sku' => 'nullable|string|max:50',
        'quantity' => 'required|integer|min:0',
        'reorder_point' => 'required|integer|min:0',
    ]);

    Inventory::create($validated);

    return redirect()->back()->with('success', 'Item added to inventory!');
})->name('inventory.store');

// Compliance Routes
Route::get('/compliance', function () {
    $forms = Form::with('client')->orderBy('signed_at', 'desc')->paginate(10);
    $complianceLogs = Compliance::with('staff')->orderBy('log_date', 'desc')->get();
    $documents = Document::orderBy('uploaded_at', 'desc')->get();
    
    return view('compliance.index', compact('forms', 'complianceLogs', 'documents'));
})->name('compliance.index');

Route::post('/compliance', function (Request $request) {
    $validated = $request->validate([
        'staff_id' => 'required|exists:staff,id',
        'type' => 'required|string',
        'notes' => 'nullable|string',
    ]);

    Compliance::create([
        'staff_id' => $validated['staff_id'],
        'type' => $validated['type'],
        'log_date' => now(),
        'details' => ['notes' => $validated['notes']],
        'status' => 'pass',
    ]);

    return redirect()->back()->with('success', 'Compliance log added successfully!');
})->name('compliance.store');

Route::post('/forms', function (Request $request) {
    $validated = $request->validate([
        'client_id' => 'required|exists:clients,id',
        'form_type' => 'required|string',
    ]);

    Form::create([
        'client_id' => $validated['client_id'],
        'form_type' => $validated['form_type'],
        'data' => [],
        'signed_at' => now(),
    ]);

    return redirect()->back()->with('success', 'Waiver generated successfully!');
})->name('forms.store');

Route::post('/documents', function (Request $request) {
    $validated = $request->validate([
        'type' => 'required|string',
        'description' => 'required|string|max:255',
        'file' => 'required|file|max:5120', // 5MB limit
    ]);

    $path = $request->file('file')->store('vault', 'public');

    Document::create([
        'type' => $validated['type'],
        'description' => $validated['description'],
        'file_path' => $path,
        'uploaded_at' => now(),
    ]);

    return redirect()->back()->with('success', 'Document uploaded to vault!');
})->name('documents.store');

// Settings Route
Route::get('/settings', function () {
    return view('settings.index');
})->name('settings.index');

// Documentation Route
Route::get('/documentation', function () {
    return view('documentation.index');
})->name('documentation.index');

// Secure File Download Route
Route::get('/download-resource/{filename}', function ($filename) {
    // Correcting extensions if requested as PDF but stored as TXT for compatibility
    $actualFilename = str_replace('.pdf', '.txt', $filename);
    $path = public_path('downloads/' . $actualFilename);
    
    if (!file_exists($path)) {
        abort(404, "File not found: " . $filename);
    }
    
    return response()->download($path, $filename, [
        'Content-Type' => 'text/plain',
    ]);
})->name('download.resource');

Route::get('/v1', function () {
    return file_get_contents(public_path('index.html'));
});
