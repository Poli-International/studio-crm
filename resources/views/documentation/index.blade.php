@extends('layouts.app')

@section('title', 'Documentation')

@section('content')
<div class="page-header">
    <div>
        <h1>📚 Documentation & Help</h1>
        <p style="color:var(--text-muted)">Everything you need to master your Studio CRM</p>
    </div>
</div>

<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
    <div class="card">
        <h2 style="margin-bottom: 1.5rem; color: var(--primary);">🎯 System Overview</h2>
        <p style="line-height: 1.6; margin-bottom: 1rem;">
            The Studio CRM is built to streamline tattoo and piercing studio operations. It handles everything from client intake and health waivers to financial reporting and technical session logging.
        </p>

        <h3 style="margin-bottom: 1rem; margin-top: 2rem;">⚡ Key Modules</h3>
        <ul style="list-style: none; display: grid; gap: 1rem;">
            <li style="background: rgba(var(--primary), 0.05); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                <strong>Client Management:</strong> Securely store client history, medical notes, and photo galleries.
            </li>
            <li style="background: rgba(var(--success), 0.05); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--success);">
                <strong>Financial Tracking:</strong> Track every deposit and payment. Export data for tax season.
            </li>
            <li style="background: rgba(var(--secondary), 0.05); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--secondary);">
                <strong>Compliance Vault:</strong> HIPAA-compliant storage for digital waivers and identity scans.
            </li>
        </ul>

        <h3 style="margin-bottom: 1rem; margin-top: 2rem;">📖 User Guide</h3>
        <div style="background: var(--background); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border);">
            <ol style="margin-left: 1.5rem; display: grid; gap: 0.75rem;">
                <li><strong>Setup Your Artists:</strong> Add your team in the Staff settings to enable scheduling.</li>
                <li><strong>Intake Process:</strong> Have clients sign digital waivers on a tablet before their session.</li>
                <li><strong>Technical Logs:</strong> Use the Services tab to log needle batches and machine settings for every session.</li>
                <li><strong>Finalize Payments:</strong> Record payments on the dashboard to sync with your records.</li>
            </ol>
        </div>
    </div>

    <div>
        <div class="card" style="border-top: 5px solid var(--primary);">
            <h3 style="margin-bottom: 1.5rem;"><i data-lucide="download"></i> Download Resources</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <a href="{{ route('download.resource', ['filename' => 'README.txt']) }}" class="btn btn-outline" style="justify-content: flex-start;">
                    <i data-lucide="file-text"></i> Download README
                </a>
                <a href="{{ route('download.resource', ['filename' => 'Documentation.txt']) }}" class="btn btn-outline" style="justify-content: flex-start;">
                    <i data-lucide="book"></i> Full Documentation (TXT)
                </a>
                <a href="{{ route('download.resource', ['filename' => 'UserGuide.txt']) }}" class="btn btn-outline" style="justify-content: flex-start;">
                    <i data-lucide="help-circle"></i> User Guide (TXT)
                </a>
                <button onclick="window.print()" class="btn btn-primary" style="justify-content: flex-start; margin-top: 0.5rem;">
                    <i data-lucide="printer"></i> Print this Page to PDF
                </button>
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 1rem;">❓ Need Help?</h3>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                Can't find what you're looking for? Our support team is available for technical assistance.
            </p>
            <a href="mailto:support@poliinternational.com" class="btn btn-outline" style="width: 100%;">
                <i data-lucide="mail"></i> Contact Support
            </a>
        </div>
    </div>
</div>

<div class="card" style="margin-top: 2rem;">
    <h3 style="margin-bottom: 1.5rem;">🔗 Quick Links</h3>
    <div style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); display: grid; gap: 1rem;">
        <a href="https://poliinternational.com/tattoo-price-estimator-documentation/" target="_blank" class="btn btn-outline">
            Tattoo Estimator Docs
        </a>
        <a href="https://poliinternational.com/tools/" target="_blank" class="btn btn-outline">
            All Studio Tools
        </a>
        <a href="https://poliinternational.com/contact-us/" target="_blank" class="btn btn-outline">
            Request Feature
        </a>
    </div>
</div>
@endsection
