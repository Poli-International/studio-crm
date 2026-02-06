@extends('layouts.app')

@section('title', $client->name . ' - Profile')

@section('content')
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem">
    <div style="display:flex; align-items:center; gap:1rem">
        <a href="{{ route('clients.index') }}" class="btn btn-outline" style="padding:0.5rem"><i data-lucide="arrow-left"></i></a>
        <div>
            <h1>{{ $client->name }}</h1>
            <p style="color:var(--text-muted)">Client Profile</p>
        </div>
    </div>
    <div style="display:flex; gap:1rem">
        <button class="btn btn-outline" onclick="window.location.href='mailto:{{ $client->email }}'"><i data-lucide="mail"></i> Email</button>
        <button class="btn btn-primary" onclick="document.getElementById('new-appointment-modal').style.display='flex'">
            <i data-lucide="calendar"></i> Book New
        </button>
    </div>
</div>

<!-- Copy the appointment modal here for local context booking -->
<div id="new-appointment-modal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); align-items:center; justify-content:center; z-index:2000">
    <div class="card" style="width:100%; max-width:500px; padding:2rem">
        <h2 style="margin-bottom:1.5rem">Schedule Appointment</h2>
        <form action="{{ route('appointments.store') }}" method="POST">
            @csrf
            <!-- Hidden Client ID locked to this profile -->
            <input type="hidden" name="client_id" value="{{ $client->id }}">
            
            <div class="form-group">
                <label class="form-label">Client</label>
                <input type="text" class="form-control" value="{{ $client->name }}" disabled style="background:var(--bg); color:var(--text-muted)">
            </div>

            <div class="form-group">
                <label class="form-label">Service Type</label>
                <select name="service_type" class="form-control" required>
                    <option value="tattoo">Tattoo</option>
                    <option value="piercing">Piercing</option>
                    <option value="consultation">Consultation</option>
                    <option value="touchup">Touch-up</option>
                    <option value="removal">Removal</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Artist / Staff</label>
                <select name="staff_id" class="form-control" required>
                    @foreach($allStaff as $staff)
                        <option value="{{ $staff->id }}">{{ $staff->name }} ({{ ucfirst($staff->role) }})</option>
                    @endforeach
                </select>
            </div>

            <div class="grid" style="grid-template-columns: 2fr 1fr; gap:1rem">
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="datetime-local" name="datetime" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Duration (min)</label>
                    <input type="number" name="duration_minutes" class="form-control" value="60" min="15" step="15">
                </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:2rem">
                <button type="button" class="btn btn-outline" onclick="document.getElementById('new-appointment-modal').style.display='none'">Cancel</button>
                <button type="submit" class="btn btn-primary">Confirm Booking</button>
            </div>
        </form>
    </div>
</div>

<div class="grid" style="grid-template-columns: 300px 1fr; gap:1.5rem">
    <!-- Sidebar / Info Card -->
    <div style="display:flex; flex-direction:column; gap:1.5rem">
        <div class="card">
            <div style="text-align:center; padding-bottom:1.5rem; border-bottom:1px solid var(--border); margin-bottom:1.5rem">
                <div style="width:100px; height:100px; border-radius:50%; background:var(--primary); margin:0 auto 1rem; display:flex; align-items:center; justify-content:center; font-size:2.5rem; font-weight:700; color:white">
                    {{ substr($client->name, 0, 1) }}
                </div>
                <h2>{{ $client->name }}</h2>
                <p style="color:var(--text-muted)">{{ $client->profession ?? 'Client' }}</p>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:1rem">
                <div style="display:flex; align-items:center; gap:0.75rem">
                    <i data-lucide="mail" style="color:var(--text-muted); width:18px"></i>
                    <span style="font-size:0.9rem">{{ $client->email }}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem">
                    <i data-lucide="phone" style="color:var(--text-muted); width:18px"></i>
                    <span style="font-size:0.9rem">{{ $client->phone ?? 'No Phone' }}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem">
                    <i data-lucide="map-pin" style="color:var(--text-muted); width:18px"></i>
                    <span style="font-size:0.9rem">{{ $client->address ?? 'No Address' }}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem">
                    <i data-lucide="cake" style="color:var(--text-muted); width:18px"></i>
                    <span style="font-size:0.9rem">{{ $client->dob ? \Carbon\Carbon::parse($client->dob)->format('M d, Y') : 'No DOB' }}</span>
                </div>
            </div>
        </div>

        <!-- Medical / Alerts -->
        <div class="card" style="border-left: 4px solid var(--danger)">
            <h3 style="margin-bottom:1rem; color:var(--danger)">Medical Alerts</h3>
            @if($client->allergies)
                <div style="background:rgba(239, 68, 68, 0.1); color:var(--danger); padding:0.75rem; border-radius:8px; margin-bottom:1rem">
                    <strong>Allergies:</strong><br>
                    {{ $client->allergies }}
                </div>
            @else
                <p style="color:var(--text-muted); font-size:0.9rem">No known allergies.</p>
            @endif
            
            @if($client->medical_history)
                 <div style="margin-top:1rem; font-size:0.9rem; color:var(--text-muted)">
                    <strong>Notes:</strong><br>
                    {{ $client->medical_history }}
                </div>
            @endif
        </div>
    </div>

    <!-- Main Content -->
    <div style="display:flex; flex-direction:column; gap:1.5rem">
        <!-- Stats Row -->
        <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom:0">
            <div class="card stat-card" style="padding:1rem">
                <div class="stat-info">
                    <h3 style="font-size:0.8rem">Visits</h3>
                    <p style="font-size:1.2rem">{{ $client->appointments->count() }}</p>
                </div>
            </div>
            <div class="card stat-card" style="padding:1rem">
                <div class="stat-info">
                    <h3 style="font-size:0.8rem">Total Spent</h3>
                    <!-- Assuming we had a relation, for now placeholder -->
                    <p style="font-size:1.2rem">$0.00</p>
                </div>
            </div>
            <div class="card stat-card" style="padding:1rem">
                <div class="stat-info">
                    <h3 style="font-size:0.8rem">Last Visit</h3>
                    <p style="font-size:1.2rem">{{ $client->appointments->max('datetime') ? \Carbon\Carbon::parse($client->appointments->max('datetime'))->format('M d') : '-' }}</p>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="card">
            <h3 style="margin-bottom:1rem">Appointment History</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Service</th>
                        <th>Artist</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($client->appointments()->orderBy('datetime', 'desc')->get() as $apt)
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($apt->datetime)->format('M d, Y') }}</td>
                        <td>{{ ucfirst($apt->service_type) }}</td>
                        <td>{{ $apt->staff->name ?? 'Unknown' }}</td>
                        <td><span class="{{ $apt->status == 'completed' ? 'text-success' : 'text-muted' }}">{{ ucfirst($apt->status) }}</span></td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted)">No history yet.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
