<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} - @yield('title')</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        :root {
            --primary: #3B82F6;
            --primary-dark: #2563EB;
            --secondary: #8B5CF6;
            --success: #10B981;
            --warning: #F59E0B;
            --danger: #EF4444;
            --background: #0F172A;
            --sidebar: #1E293B;
            --card: #1E293B;
            --text: #F8FAFC;
            --text-muted: #94A3B8;
            --border: #334155;
            --input-bg: #0F172A;
            --radius: 12px;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        body.light-mode {
            --background: #F8FAFC;
            --sidebar: #FFFFFF;
            --card: #FFFFFF;
            --text: #0F172A;
            --text-muted: #64748B;
            --border: #E2E8F0;
            --input-bg: #FFFFFF;
            --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            background: var(--background); 
            color: var(--text);
            display: flex;
            min-height: 100vh;
            transition: background 0.3s, color 0.3s;
        }

        /* Sidebar */
        .sidebar {
            width: 260px;
            background: var(--sidebar);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            z-index: 100;
            transition: background 0.3s;
        }

        .sidebar-header {
            padding: 2rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            border-bottom: 1px solid var(--border);
        }

        .sidebar-nav {
            flex: 1;
            padding: 1.5rem 1rem;
            overflow-y: auto;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: var(--text-muted);
            text-decoration: none;
            border-radius: var(--radius);
            margin-bottom: 0.5rem;
            transition: all 0.2s;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .nav-item:hover, .nav-item.active {
            background: rgba(59, 130, 246, 0.1);
            color: var(--primary);
        }

        .sidebar-footer {
            padding: 1rem;
            border-top: 1px solid var(--border);
        }

        /* Main Content */
        .main-content {
            margin-left: 260px;
            flex: 1;
            padding: 2rem;
            max-width: calc(100% - 260px);
        }

        .page-header {
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .page-header h1 { font-size: 1.875rem; font-weight: 700; }

        /* Components */
        .card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: var(--shadow);
            transition: background 0.3s, border 0.3s;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.625rem 1.25rem;
            border-radius: var(--radius);
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
            text-decoration: none;
            font-size: 0.875rem;
        }

        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: var(--primary-dark); }
        .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
        .btn-outline:hover { background: rgba(0,0,0,0.05); }
        body:not(.light-mode) .btn-outline:hover { background: rgba(255,255,255,0.05); }

        .form-group { margin-bottom: 1rem; }
        .form-label { display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.875rem; }
        .form-control {
            width: 100%;
            padding: 0.75rem;
            background: var(--input-bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--text);
            outline: none;
            transition: background 0.3s, border 0.3s;
        }
        .form-control:focus { border-color: var(--primary); }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card { display: flex; align-items: center; gap: 1rem; }
        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .bg-blue { background: #3B82F6; }
        .bg-green { background: #10B981; }
        .bg-purple { background: #8B5CF6; }
        .bg-orange { background: #F59E0B; }

        .stat-info h3 { font-size: 0.875rem; color: var(--text-muted); }
        .stat-info p { font-size: 1.5rem; font-weight: 700; }

        /* Tables */
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 1rem; color: var(--text-muted); font-weight: 600; border-bottom: 1px solid var(--border); }
        .data-table td { padding: 1rem; border-bottom: 1px solid var(--border); }

        /* Modal / Alerts */
        .alert { padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem; }
        .alert-success { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid var(--success); }

        @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%); width: 0; }
            .main-content { margin-left: 0; max-width: 100%; }
        }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Studio CRM - @yield('title')",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "browserRequirements": "Requires JavaScript. Optimized for Chrome, Safari, Firefox, Edge.",
      "url": "{{ url()->current() }}",
      "author": {
        "@type": "Organization",
        "name": "Poli International"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "{{ route('clients.index') }}?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
</head>
<body>
    <aside class="sidebar">
        <div class="sidebar-header">
            Studio CRM
        </div>
        <nav class="sidebar-nav">
            <a href="{{ route('dashboard') }}" class="nav-item {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                <i data-lucide="layout-dashboard"></i> Dashboard
            </a>
            <a href="{{ route('clients.index') }}" class="nav-item {{ request()->routeIs('clients.*') ? 'active' : '' }}">
                <i data-lucide="users"></i> Clients
            </a>
            <a href="{{ route('appointments.index') }}" class="nav-item {{ request()->routeIs('appointments.*') ? 'active' : '' }}">
                <i data-lucide="calendar"></i> Schedule
            </a>
            <a href="{{ route('services.index') }}" class="nav-item {{ request()->routeIs('services.*') ? 'active' : '' }}">
                <i data-lucide="scissors"></i> Services
            </a>
            <a href="{{ route('financial.index') }}" class="nav-item {{ request()->routeIs('financial.*') ? 'active' : '' }}">
                <i data-lucide="dollar-sign"></i> Financial
            </a>
            <a href="{{ route('inventory.index') }}" class="nav-item {{ request()->routeIs('inventory.*') ? 'active' : '' }}">
                <i data-lucide="package"></i> Inventory
            </a>
            <a href="{{ route('compliance.index') }}" class="nav-item {{ request()->routeIs('compliance.*') ? 'active' : '' }}">
                <i data-lucide="shield-check"></i> Compliance
            </a>
            <a href="{{ route('gallery.index') }}" class="nav-item {{ request()->routeIs('gallery.*') ? 'active' : '' }}">
                <i data-lucide="image"></i> Gallery
            </a>
            <a href="{{ route('documentation.index') }}" class="nav-item {{ request()->routeIs('documentation.*') ? 'active' : '' }}">
                <i data-lucide="book-open"></i> Documentation
            </a>
            @if(in_array(session('user_role'), ['admin', 'manager']))
            <a href="{{ route('staff.index') }}" class="nav-item {{ request()->routeIs('staff.*') ? 'active' : '' }}">
                <i data-lucide="users"></i> Team Management
            </a>
            @endif
        </nav>
        <div class="sidebar-footer">
            <a href="{{ route('settings.index') }}" class="nav-item {{ request()->routeIs('settings.*') ? 'active' : '' }}">
                <i data-lucide="settings"></i> Settings
            </a>
            <a href="{{ route('logout') }}" class="nav-item">
                <i data-lucide="log-out"></i> Logout
            </a>
        </div>
    </aside>

    <main class="main-content">
        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        @yield('content')
    </main>

    @include('partials.modals')

    <script>
        // Theme Management
        const body = document.body;
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        if (currentTheme === 'light') {
            body.classList.add('light-mode');
        }

        window.toggleTheme = function() {
            body.classList.toggle('light-mode');
            const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
        }

        lucide.createIcons();
    </script>
</body>
</html>
