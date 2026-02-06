@extends('layouts.app')

@section('title', 'Schedule')

@section('content')
<div class="page-header">
    <h1>Studio Schedule</h1>
    <div style="display:flex; gap:1rem">
        <button class="btn btn-outline"><i data-lucide="filter"></i> Filter</button>
        <button class="btn btn-primary" onclick="document.getElementById('new-appointment-modal').style.display='flex'">
            <i data-lucide="plus"></i> New Appointment
        </button>
    </div>
</div>

<div class="card">
    <table class="data-table">
        <thead>
            <tr>
                <th>Date/Time</th>
                <th>Client</th>
                <th>Artist</th>
                <th>Service</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($appointments as $apt)
            <tr>
                <td>{{ $apt->datetime->format('M d, Y - h:i A') }}</td>
                <td>{{ $apt->client->name }}</td>
                <td>{{ $apt->staff->name }}</td>
                <td>{{ ucfirst($apt->service_type) }}</td>
                <td>
                    <span style="padding: 0.25rem 0.5rem; border-radius: 99px; font-size: 0.75rem; background: rgba(16, 185, 129, 0.1); color: var(--success);">
                        {{ ucfirst($apt->status) }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                    No appointments scheduled. Click "New Appointment" to start.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
    
    <div style="margin-top: 1.5rem;">
        {{ $appointments->links() }}
    </div>
</div>
@endsection
