@extends('layouts.app')

@section('title', 'Settings')

@section('content')
<div class="page-header">
    <h1>Settings</h1>
</div>

<div class="card" style="max-width: 600px;">
    <h2 style="margin-bottom: 1.5rem;">Appearance</h2>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0,0,0,0.03); border-radius: 8px; border: 1px solid var(--border);">
        <div>
            <div style="font-weight: 600;">Theme Mode</div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">Switch between light and dark backgrounds</div>
        </div>
        <button class="btn btn-primary" onclick="toggleTheme()">
            <i data-lucide="moon"></i> / <i data-lucide="sun"></i> Toggle Theme
        </button>
    </div>
</div>

<div class="card" style="max-width: 600px;">
    <h2 style="margin-bottom: 1.5rem;">Studio Profile</h2>
    <form action="#" method="POST">
        @csrf
        <div class="form-group">
            <label class="form-label">Studio Name</label>
            <input type="text" class="form-control" value="Poli International Studio" disabled>
        </div>
        <div class="form-group">
            <label class="form-label">Contact Email</label>
            <input type="email" class="form-control" value="admin@poliinternational.com" disabled>
        </div>
        <button type="button" class="btn btn-outline" style="opacity: 0.5" disabled>Save Changes</button>
    </form>
</div>
@endsection
