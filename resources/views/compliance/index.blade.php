@extends('layouts.app')

@section('title', 'Compliance')

@section('content')
<div class="page-header">
    <div>
        <h1>Compliance & Secure Vault</h1>
        <p style="color:var(--text-muted)">Consent forms, age verification, and health standards</p>
    </div>
    <div style="display:flex; gap:1rem">
        <button class="btn btn-outline" onclick="document.getElementById('health-check-modal').style.display='flex'"><i data-lucide="shield"></i> Health Check</button>
        <button class="btn btn-primary" onclick="document.getElementById('new-waiver-modal').style.display='flex'"><i data-lucide="file-text"></i> New Waiver</button>
    </div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
    <!-- Digital Waivers -->
    <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem">
            <h2>Recent Digital Waivers</h2>
            <i data-lucide="check-square" style="color:var(--success)"></i>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Signed At</th>
                    <th>Doc</th>
                </tr>
            </thead>
            <tbody>
                @forelse($forms as $form)
                <tr>
                    <td><strong>{{ $form->client->name }}</strong></td>
                    <td>{{ ucfirst($form->form_type) }}</td>
                    <td>{{ $form->signed_at->format('M d, H:i') }}</td>
                    <td><i data-lucide="file-check" size="16"></i></td>
                </tr>
                @empty
                <tr><td colspan="4" style="text-align:center; color:var(--text-muted)">No digital forms found.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Technical Compliance -->
    <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem">
            <h2>Studio Compliance Logs</h2>
            <i data-lucide="activity" style="color:var(--primary)"></i>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Detail</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($complianceLogs as $log)
                <tr>
                    <td>{{ $log->log_date->format('M d') }}</td>
                    <td>{{ ucfirst($log->type) }}</td>
                    <td>{{ \Illuminate\Support\Str::limit($log->details['notes'] ?? 'System check', 20) }}</td>
                    <td><span style="color:var(--success)">Passed</span></td>
                </tr>
                @empty
                <tr><td colspan="4" style="text-align:center; color:var(--text-muted)">No specialized logs found.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem">
        <h2>Secure Document Vault</h2>
        <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;" onclick="document.getElementById('upload-doc-modal').style.display='flex'">Upload Document</button>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
        @forelse($documents as $doc)
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align:center;">
            <i data-lucide="file-text" size="32" style="color:var(--text-muted); margin-bottom: 0.5rem"></i>
            <div style="font-size: 0.875rem; font-weight: 600;">{{ $doc->description ?? 'Unnamed Doc' }}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">{{ ucfirst($doc->type) }}</div>
        </div>
        @empty
        <div style="grid-column: 1/-1; text-align:center; padding: 2rem; color:var(--text-muted);">
            Vault is currently empty. Upload identity scans or sterilization certificates.
        </div>
        @endforelse
    </div>
</div>
<!-- Modal: Health Check Log -->
<div id="health-check-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; align-items:center; justify-content:center;">
    <div class="card" style="width: 450px; position:relative;">
        <h2 style="margin-bottom:1.5rem">Studio Health Check</h2>
        <form action="{{ route('compliance.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">Practitioner</label>
                <select name="staff_id" class="form-control" required>
                    @foreach(\App\Models\Staff::where('active', 1)->get() as $staff)
                        <option value="{{ $staff->id }}">{{ $staff->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Checklist Type</label>
                <select name="type" class="form-control" required>
                    <option value="maintenance">Station Sanitization</option>
                    <option value="autoclave_log">Autoclave Log</option>
                    <option value="training">Personal Hygiene Check</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea name="notes" class="form-control" rows="3" placeholder="All standards met..."></textarea>
            </div>
            <div style="display:flex; gap:1rem; margin-top:2rem">
                <button type="submit" class="btn btn-primary" style="flex:1">Log Check</button>
                <button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('health-check-modal').style.display='none'">Cancel</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal: New Waiver -->
<div id="new-waiver-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; align-items:center; justify-content:center;">
    <div class="card" style="width: 450px; position:relative;">
        <h2 style="margin-bottom:1.5rem">New Waiver Submission</h2>
        <form action="{{ route('forms.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">Client</label>
                <select name="client_id" class="form-control" required>
                    @foreach(\App\Models\Client::orderBy('name')->get() as $client)
                        <option value="{{ $client->id }}">{{ $client->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Waiver Type</label>
                <select name="form_type" class="form-control" required>
                    <option value="consent">General Consent</option>
                    <option value="aftercare">Aftercare Acknowledgement</option>
                    <option value="waiver">Health Waiver</option>
                </select>
            </div>
            <div style="display:flex; gap:1rem; margin-top:2rem">
                <button type="submit" class="btn btn-primary" style="flex:1">Generate Waiver</button>
                <button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('new-waiver-modal').style.display='none'">Cancel</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal: Upload Document -->
<div id="upload-doc-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; align-items:center; justify-content:center;">
    <div class="card" style="width: 450px; position:relative;">
        <h2 style="margin-bottom:1.5rem">Upload to Vault</h2>
        <form action="{{ route('documents.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label class="form-label">Document Type</label>
                <select name="type" class="form-control" required>
                    <option value="id_scan">Identity Scan</option>
                    <option value="certificate">Sterilization Cert</option>
                    <option value="license">Practitioner License</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <input type="text" name="description" class="form-control" placeholder="ID Scan - Jane Doe" required>
            </div>
            <div class="form-group">
                <label class="form-label">File</label>
                <input type="file" name="file" class="form-control" required>
            </div>
            <div style="display:flex; gap:1rem; margin-top:2rem">
                <button type="submit" class="btn btn-primary" style="flex:1">Upload</button>
                <button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('upload-doc-modal').style.display='none'">Cancel</button>
            </div>
        </form>
    </div>
</div>
@endsection
