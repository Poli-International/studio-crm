@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="page-header">
    <h1>Dashboard</h1>
    <div class="text-muted">{{ date('F d, Y') }}</div>
</div>

<div class="stats-grid">
    <div class="card stat-card">
        <div class="stat-icon bg-blue"><i data-lucide="calendar"></i></div>
        <div class="stat-info">
            <h3>Appointments Today</h3>
            <p>{{ $stats['appointmentsToday'] }}</p>
        </div>
    </div>
    <div class="card stat-card">
        <div class="stat-icon bg-green"><i data-lucide="dollar-sign"></i></div>
        <div class="stat-info">
            <h3>Revenue Today</h3>
            <p>${{ number_format($stats['revenueToday'], 2) }}</p>
        </div>
    </div>
    <div class="card stat-card">
        <div class="stat-icon bg-purple"><i data-lucide="users"></i></div>
        <div class="stat-info">
            <h3>Active Clients</h3>
            <p>{{ $stats['activeClients'] }}</p>
        </div>
    </div>
    <div class="card stat-card">
        <div class="stat-icon bg-orange"><i data-lucide="alert-circle"></i></div>
        <div class="stat-info">
            <h3>Pending Alerts</h3>
            <p>0</p>
        </div>
    </div>
</div>

<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
    <!-- Recent Schedule -->
    <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem">
            <h2>Upcoming Schedule</h2>
            <a href="{{ route('appointments.index') }}" class="btn btn-outline" style="padding: 0.25rem 0.75rem">View All</a>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($appointments as $apt)
                    <tr>
                        <td>{{ $apt->datetime->format('M d, h:i A') }}</td>
                        <td>{{ $apt->client->name }}</td>
                        <td>{{ ucfirst($apt->service_type) }}</td>
                        <td>
                            <span style="padding: 0.25rem 0.5rem; border-radius: 99px; font-size: 0.75rem; background: rgba(16, 185, 129, 0.1); color: var(--success);">
                                {{ ucfirst($apt->status) }}
                            </span>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" style="text-align: center; color: var(--text-muted);">No appointments found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Quick Actions -->
    <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Quick Actions</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <button class="btn btn-primary" onclick="document.getElementById('new-appointment-modal').style.display='flex'">
                <i data-lucide="calendar-plus"></i> New Appointment
            </button>
            <button class="btn btn-primary" onclick="document.getElementById('add-client-modal').style.display='flex'">
                <i data-lucide="user-plus"></i> Add Client
            </button>
            <button class="btn btn-outline" onclick="document.getElementById('record-payment-modal').style.display='flex'">
                <i data-lucide="credit-card"></i> Record Payment
            </button>
        </div>
    </div>

    <!-- Team Overview (Admin Only) -->
    @if(in_array(session('user_role'), ['admin', 'manager']))
    <div class="card" style="grid-column: span 2; margin-top: 1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem">
            <h2>Studio Team Overview</h2>
            <a href="{{ route('staff.index') }}" class="btn btn-outline" style="padding: 0.25rem 0.75rem">Manage Team</a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            @foreach($allStaff->take(4) as $staff)
            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px; border: 1px solid var(--border);">
                <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem">
                    <div style="width:32px; height:32px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.75rem">
                        {{ strtoupper(substr($staff->name, 0, 1)) }}
                    </div>
                    <strong>{{ $staff->name }}</strong>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                    <div style="display:flex; justify-content:space-between">
                        <span>Role:</span> <span>{{ ucfirst($staff->role) }}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between">
                        <span>Appointments Today:</span> <span>{{ $staff->appointments->where('datetime', '>=', date('Y-m-d 00:00:00'))->count() }}</span>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Documentation & Resources -->
    <div class="card" style="margin-top: 1.5rem;">
        <h2 style="margin-bottom: 1.5rem;">📜 Resources</h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <a href="{{ route('download.resource', ['filename' => 'README.txt']) }}" class="btn btn-outline" style="justify-content: flex-start; font-size: 0.75rem; padding: 0.5rem 1rem;">
                <i data-lucide="file-text" size="16"></i> README
            </a>
            <a href="{{ route('download.resource', ['filename' => 'Documentation.txt']) }}" class="btn btn-outline" style="justify-content: flex-start; font-size: 0.75rem; padding: 0.5rem 1rem;">
                <i data-lucide="book" size="16"></i> Documentation
            </a>
            <a href="{{ route('download.resource', ['filename' => 'UserGuide.txt']) }}" class="btn btn-outline" style="justify-content: flex-start; font-size: 0.75rem; padding: 0.5rem 1rem;">
                <i data-lucide="help-circle" size="16"></i> User Guide
            </a>
        </div>
    </div>
</div>
@endsection
