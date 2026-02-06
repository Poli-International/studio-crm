@extends('layouts.app')

@section('title', 'Clients')

@section('content')
<div class="page-header">
    <div>
        <h1>Clients</h1>
        <p style="color: var(--text-muted)">Manage your studio client base</p>
    </div>
    <button class="btn btn-primary" onclick="document.getElementById('add-client-modal').style.display='block'">
        <i data-lucide="plus"></i> Add Client
    </button>
</div>

<div class="card">
    <table class="data-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Profession</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($clients as $client)
                <tr>
                    <td style="font-weight: 600;">{{ $client->name }}</td>
                    <td>{{ $client->email }}</td>
                    <td>{{ $client->phone ?? 'N/A' }}</td>
                    <td>{{ $client->profession ?? 'Not Set' }}</td>
                    <td>
                        <a href="{{ route('clients.show', $client->id) }}" class="btn btn-outline" style="padding: 0.5rem;" title="View Profile">
                            <i data-lucide="eye"></i>
                        </a>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                        No clients found. Click "Add Client" to get started.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

<!-- Add Client Modal (Same as Dashboard for consistency) -->
<div id="add-client-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000;">
    <div class="card" style="width: 400px; position:relative; top:50%; left:50%; transform:translate(-50%, -50%);">
        <h2 style="margin-bottom:1.5rem">Add New Client</h2>
        <form action="{{ route('clients.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" name="name" class="form-control" placeholder="John Doe" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="john@example.com" required>
            </div>
            <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="text" name="phone" class="form-control" placeholder="+1 234 567 890">
            </div>
            <div class="form-group">
                <label class="form-label">Profession</label>
                <input type="text" name="profession" class="form-control" placeholder="e.g. Graphic Designer">
            </div>
            <div style="display:flex; gap:1rem; margin-top:2rem">
                <button type="submit" class="btn btn-primary" style="flex:1">Save Client</button>
                <button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('add-client-modal').style.display='none'">Cancel</button>
            </div>
        </form>
    </div>
</div>
@endsection
