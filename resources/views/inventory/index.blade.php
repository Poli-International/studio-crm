@extends('layouts.app')

@section('title', 'Inventory')

@section('content')
<div class="page-header">
    <div>
        <h1>Studio Inventory</h1>
        <p style="color:var(--text-muted)">Manage supplies, stock levels, and reorder points</p>
    </div>
    <div style="display:flex; gap:1rem">
        <button class="btn btn-outline"><i data-lucide="package"></i> Order Supplies</button>
        <button class="btn btn-primary" onclick="document.getElementById('add-inventory-modal').style.display='flex'">
            <i data-lucide="plus"></i> Add New Item
        </button>
    </div>
</div>

<div class="stats-grid">
    <div class="card stat-card" style="border-left: 4px solid var(--danger);">
        <div class="stat-icon bg-orange"><i data-lucide="alert-triangle"></i></div>
        <div class="stat-info">
            <h3>Low Stock Alerts</h3>
            <p>2 Items</p>
        </div>
    </div>
    <div class="card stat-card">
        <div class="stat-icon bg-blue"><i data-lucide="layers"></i></div>
        <div class="stat-info">
            <h3>Total SKUs</h3>
            <p>{{ $inventory->total() }}</p>
        </div>
    </div>
</div>

<div class="card">
    <table class="data-table">
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Type</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Reorder Point</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($inventory as $item)
            <tr>
                <td><strong>{{ $item->name }}</strong></td>
                <td>{{ ucfirst($item->item_type) }}</td>
                <td><code>{{ $item->sku }}</code></td>
                <td>{{ $item->quantity }}</td>
                <td>{{ $item->reorder_point }}</td>
                <td>
                    @if($item->quantity <= $item->reorder_point)
                        <span style="color:var(--danger); font-weight: 600;">Low Stock</span>
                    @else
                        <span style="color:var(--success);">In Stock</span>
                    @endif
                </td>
                <td>
                    <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;"><i data-lucide="edit-3" size="16"></i></button>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                    No inventory items found. Add supplies to start tracking.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
    <div style="margin-top: 1.5rem;">
        {{ $inventory->links() }}
    </div>
</div>

<!-- Modal: Add Inventory Item -->
<div id="add-inventory-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; align-items:center; justify-content:center;">
    <div class="card" style="width: 450px; position:relative;">
        <h2 style="margin-bottom:1.5rem">Add Inventory Item</h2>
        <form action="{{ route('inventory.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">Item Name</label>
                <input type="text" name="name" class="form-control" placeholder="Black Ink (Eternal)" required>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem">
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select name="item_type" class="form-control" required>
                        <option value="ink">Ink</option>
                        <option value="needle">Needles</option>
                        <option value="jewelry">Jewelry</option>
                        <option value="aftercare">Aftercare</option>
                        <option value="supply">General Supply</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">SKU</label>
                    <input type="text" name="sku" class="form-control" placeholder="INK-BLK-01">
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem">
                <div class="form-group">
                    <label class="form-label">Initial Quantity</label>
                    <input type="number" name="quantity" class="form-control" value="0" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Reorder Point</label>
                    <input type="number" name="reorder_point" class="form-control" value="5" required>
                </div>
            </div>
            <div style="display:flex; gap:1rem; margin-top:2rem">
                <button type="submit" class="btn btn-primary" style="flex:1">Add Item</button>
                <button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('add-inventory-modal').style.display='none'">Cancel</button>
            </div>
        </form>
    </div>
</div>
@endsection
