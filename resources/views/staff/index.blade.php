@extends('layouts.app')

@section('title', 'Team Management')

@section('content')
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem">
    <div>
        <h1>Team Management</h1>
        <p style="color:var(--text-muted)">Manage your studio's artists, piercers, and support staff.</p>
    </div>
    <button class="btn btn-primary" onclick="document.getElementById('add-staff-modal').style.display='flex'">
        <i data-lucide="user-plus"></i> Add Team Member
    </button>
</div>

<div class="stats-grid">
    <div class="card stat-card">
        <div class="stat-icon bg-blue"><i data-lucide="users"></i></div>
        <div class="stat-info">
            <h3>Total Staff</h3>
            <p>{{ $staffMembers->count() }}</p>
        </div>
    </div>
    <div class="card stat-card">
        <div class="stat-icon bg-green"><i data-lucide="star"></i></div>
        <div class="stat-info">
            <h3>Active Artists</h3>
            <p>{{ $staffMembers->where('role', 'artist')->where('active', 1)->count() }}</p>
        </div>
    </div>
    <div class="card stat-card">
        <div class="stat-icon bg-purple"><i data-lucide="shield"></i></div>
        <div class="stat-info">
            <h3>Admins/Managers</h3>
            <p>{{ $staffMembers->whereIn('role', ['admin', 'manager'])->count() }}</p>
        </div>
    </div>
</div>

<div class="card">
    <table class="data-table">
        <thead>
            <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Email</th>
                <th>Specialties</th>
                <th>Commission</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($staffMembers as $member)
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:0.75rem">
                        <div style="width:32px; height:32px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.75rem">
                            {{ strtoupper(substr($member->name, 0, 1)) }}
                        </div>
                        <strong>{{ $member->name }}</strong>
                    </div>
                </td>
                <td><span class="badge" style="background:rgba(59,130,246,0.1); color:var(--primary); padding:0.25rem 0.5rem; border-radius:4px; font-size:0.75rem">{{ ucfirst($member->role) }}</span></td>
                <td>{{ $member->email }}</td>
                <td>
                    @if($member->specialties)
                        @foreach(json_decode($member->specialties, true) ?: [] as $spec)
                            <span style="font-size:0.7rem; background:rgba(255,255,255,0.05); padding:0.1rem 0.3rem; border-radius:4px">{{ $spec }}</span>
                        @endforeach
                    @else
                        -
                    @endif
                </td>
                <td>{{ $member->commission_rate }}%</td>
                <td>
                    @if($member->active)
                        <span style="color:var(--success); font-size:0.75rem">● Active</span>
                    @else
                        <span style="color:var(--text-muted); font-size:0.75rem">○ Inactive</span>
                    @endif
                </td>
                <td>
                    <div style="display:flex; gap:0.5rem">
                        <button class="btn btn-outline" style="padding:0.25rem; font-size:0.75rem" title="Edit"><i data-lucide="edit-2" size="14"></i></button>
                        <button class="btn btn-outline" style="padding:0.25rem; font-size:0.75rem; color:var(--danger)" title="Deactivate"><i data-lucide="user-x" size="14"></i></button>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<!-- Add Staff Modal -->
<div id="add-staff-modal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); align-items:center; justify-content:center; z-index:2000">
    <div class="card" style="width:100%; max-width:500px; padding:2rem">
        <h2 style="margin-bottom:1.5rem">Add New Team Member</h2>
        <form action="{{ route('staff.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" name="name" class="form-control" placeholder="Artist Name" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="artist@studio.com" required>
            </div>
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap:1rem">
                <div class="form-group">
                    <label class="form-label">Role</label>
                    <select name="role" class="form-control" required>
                        <option value="artist">Artist</option>
                        <option value="manager">Manager</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Commission (%)</label>
                    <input type="number" name="commission_rate" class="form-control" value="50" step="0.01">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Specialties (Comma separated)</label>
                <input type="text" name="specialties" class="form-control" placeholder="Neo-traditional, Realism, Blackwork">
            </div>
            <div style="background:rgba(59,130,246,0.05); padding:1rem; border-radius:8px; margin-bottom:1.5rem">
                <p style="font-size:0.8rem; color:var(--primary)">
                    <i data-lucide="info" size="14"></i> A temporary password will be generated and sent to this email address.
                </p>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:1rem">
                <button type="button" class="btn btn-outline" onclick="document.getElementById('add-staff-modal').style.display='none'">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Account & Send Invite</button>
            </div>
        </form>
    </div>
</div>
@endsection
