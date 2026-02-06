@extends('layouts.app')

@section('title', 'Financial')

@section('content')
<div class="page-header">
    <div>
        <h1>Financial Performance</h1>
        <p style="color:var(--text-muted)">Revenue tracking and studio transaction history</p>
    </div>
    <div style="display:flex; gap:1rem">
        <button class="btn btn-primary" onclick="document.getElementById('record-payment-modal').style.display='flex'">
            <i data-lucide="plus"></i> Record New Payment
        </button>
    </div>
</div>

<!-- Financial Summary Cards -->
<div class="stats-grid">
    <div class="card stat-card">
        <div class="stat-icon bg-green"><i data-lucide="trending-up"></i></div>
        <div class="stat-info">
            <h3>Total Revenue</h3>
            <p>${{ number_format($stats['totalRevenue'], 2) }}</p>
        </div>
    </div>
    <div class="card stat-card">
        <div class="stat-icon bg-blue"><i data-lucide="credit-card"></i></div>
        <div class="stat-info">
            <h3>Average Transaction</h3>
            <p>${{ number_format($stats['avgTransaction'], 2) }}</p>
        </div>
    </div>
    <div class="card stat-card" style="border-color: rgba(16, 185, 129, 0.3)">
        <div class="stat-icon bg-purple"><i data-lucide="activity"></i></div>
        <div class="stat-info">
            <h3>Net Growth</h3>
            <p>+12.4%</p>
        </div>
    </div>
</div>

<div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem">
        <h2>Transaction History</h2>
        <div style="display:flex; gap:0.5rem">
            <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;" onclick="exportFinancialCSV()">Export CSV</button>
            <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;" onclick="window.print()">Print Report</button>
        </div>
    </div>

    <script>
        function exportFinancialCSV() {
            let csv = 'Date,Client,Method,Status,Amount\n';
            const rows = document.querySelectorAll('.data-table tbody tr');
            
            rows.forEach(row => {
                if(row.cells.length < 5) return;
                const date = row.cells[0].innerText;
                const client = row.cells[1].innerText;
                const method = row.cells[2].innerText;
                const status = row.cells[3].innerText;
                const amount = row.cells[4].innerText.replace('$', '').replace(',', '');
                csv += `"${date}","${client}","${method}","${status}","${amount}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', 'financial_report.csv');
            a.click();
        }
    </script>
    
    <table class="data-table">
        <thead>
            <tr>
                <th>Transaction Date</th>
                <th>Client</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $tx)
            <tr>
                <td>{{ $tx->transaction_date ? $tx->transaction_date->format('M d, Y') : 'N/A' }}</td>
                <td><strong>{{ $tx->client ? $tx->client->name : 'Walk-in Client' }}</strong></td>
                <td>{{ ucfirst($tx->method) }}</td>
                <td>
                    <span style="color:var(--success); font-weight: 500;">
                        <i data-lucide="check-circle" size="14" style="vertical-align: middle;"></i> {{ ucfirst($tx->status) }}
                    </span>
                </td>
                <td style="font-weight: 700; color: var(--text);">${{ number_format($tx->amount, 2) }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                    No transaction records found.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
    
    <div style="margin-top: 1.5rem;">
        {{ $transactions->links() }}
    </div>
</div>
@endsection
