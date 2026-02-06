@extends('layouts.app')

@section('title', 'Services')

@section('content')
<div class="page-header">
    <div>
        <h1>Technical Service Logs</h1>
        <p style="color:var(--text-muted)">Detailed practitioner logs and session details</p>
    </div>
    <div style="display:flex; gap:1rem">
        <button class="btn btn-outline" onclick="window.location.reload()"><i data-lucide="refresh-cw"></i> Sync</button>
    </div>
</div>

<div class="card">
    <table class="data-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Artist</th>
                <th>Type</th>
                <th>Body Location</th>
                <th>Price</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($services as $service)
            <tr>
                <td>{{ $service->date_completed->format('M d, Y') }}</td>
                <td><strong>{{ $service->client->name }}</strong></td>
                <td>{{ $service->staff->name }}</td>
                <td>{{ ucfirst($service->type) }}</td>
                <td>{{ $service->body_location }}</td>
                <td>${{ number_format($service->price, 2) }}</td>
                <td>
                    <span style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.25rem 0.5rem; border-radius: 99px; font-size: 0.75rem;">
                        Completed
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                    No completed service logs found. Records appear here once a session is finalized.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
    <div style="margin-top: 1.5rem;">
        {{ $services->links() }}
    </div>
</div>

<div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
    <div class="card">
        <h3><i data-lucide="info" style="color:var(--primary); vertical-align: middle; margin-right: 0.5rem;"></i> Practitioner Note</h3>
        <p style="color:var(--text-muted); font-size: 0.875rem; margin-top: 1rem;">
            This section logs technical details including machine voltage, needle batches, and ink expiry used during sessions for insurance and compliance records.
        </p>
    </div>
    <div class="card">
        <h3><i data-lucide="camera" style="color:var(--secondary); vertical-align: middle; margin-right: 0.5rem;"></i> Photo Documentation</h3>
        <p style="color:var(--text-muted); font-size: 0.875rem; margin-top: 1rem;">
            Execution photos are securely stored and linked to each technical log for quality assurance.
        </p>
    </div>
</div>
@endsection
