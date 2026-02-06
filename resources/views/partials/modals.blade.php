@php
    $allClients = \App\Models\Client::orderBy('name')->get();
    $allStaff = \App\Models\Staff::where('active', 1)->get();
@endphp

<!-- Modal: New Appointment -->
<div id="new-appointment-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; align-items:center; justify-content:center;">
    <div class="card" style="width: 450px; position:relative;">
        <h2 style="margin-bottom:1.5rem">New Appointment</h2>
        <form action="{{ route('appointments.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">Client</label>
                <select name="client_id" class="form-control" required>
                    @foreach($allClients as $client)
                        <option value="{{ $client->id }}">{{ $client->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Artist/Practitioner</label>
                <select name="staff_id" class="form-control" required>
                    @foreach($allStaff as $staff)
                        <option value="{{ $staff->id }}">{{ $staff->name }}</option>
                    @endforeach
                </select>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem">
                <div class="form-group">
                    <label class="form-label">Service Type</label>
                    <select name="service_type" class="form-control" required>
                        <option value="tattoo">Tattoo</option>
                        <option value="piercing">Piercing</option>
                        <option value="consultation">Consultation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Duration (Min)</label>
                    <input type="number" name="duration_minutes" class="form-control" value="60" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Date & Time</label>
                <input type="datetime-local" name="datetime" class="form-control" required>
            </div>
            <div style="display:flex; gap:1rem; margin-top:2rem">
                <button type="submit" class="btn btn-primary" style="flex:1">Schedule</button>
                <button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('new-appointment-modal').style.display='none'">Cancel</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal: Add Client -->
<div id="add-client-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; align-items:center; justify-content:center;">
    <div class="card" style="width: 400px; position:relative;">
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
            <div style="display:flex; gap:1rem; margin-top:2rem">
                <button type="submit" class="btn btn-primary" style="flex:1">Save Client</button>
                <button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('add-client-modal').style.display='none'">Cancel</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal: Record Payment -->
<div id="record-payment-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; align-items:center; justify-content:center;">
    <div class="card" style="width: 400px; position:relative;">
        <h2 style="margin-bottom:1.5rem">Record Payment</h2>
        <form action="{{ route('financial.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">Select Client</label>
                <select name="client_id" class="form-control" required>
                    @foreach($allClients as $client)
                        <option value="{{ $client->id }}">{{ $client->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Amount ($)</label>
                <input type="number" name="amount" step="0.01" class="form-control" placeholder="150.00" required>
            </div>
            <div class="form-group">
                <label class="form-label">Payment Method</label>
                <select name="method" class="form-control">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                </select>
            </div>
            <div style="display:flex; gap:1rem; margin-top:2rem">
                <button type="submit" class="btn btn-primary" style="flex:1">Save Payment</button>
                <button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('record-payment-modal').style.display='none'">Cancel</button>
            </div>
        </form>
    </div>
</div>
