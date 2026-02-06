<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Studio CRM - Professional Studio Management | Poli International</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        :root {
            --primary: #3B82F6;
            --primary-dark: #2563EB;
            --background: #0F172A;
            --card: #1E293B;
            --text: #F8FAFC;
            --text-muted: #94A3B8;
            --border: #334155;
            --radius: 12px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            background: var(--background); 
            color: var(--text);
            line-height: 1.6;
        }

        .breadcrumb-nav {
            padding: 1.5rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
            font-size: 0.875rem;
        }
        .breadcrumb-nav a { color: var(--primary); text-decoration: none; }
        .breadcrumb-nav span { margin: 0 0.5rem; color: var(--text-muted); }

        header.hero {
            padding: 5rem 2rem;
            text-align: center;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-bottom: 1px solid var(--border);
        }

        .hero h1 { font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; color: white; }
        .hero p { font-size: 1.25rem; color: var(--text-muted); max-width: 800px; margin: 0 auto 2.5rem; }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            border-radius: var(--radius);
            font-weight: 700;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
        }
        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); }

        .container { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }

        .feature-card {
            background: var(--card);
            border: 1px solid var(--border);
            padding: 2rem;
            border-radius: var(--radius);
            transition: transform 0.3s;
        }
        .feature-card:hover { transform: translateY(-5px); border-color: var(--primary); }
        .feature-card i { color: var(--primary); margin-bottom: 1rem; }
        .feature-card h3 { margin-bottom: 1rem; font-size: 1.25rem; }
        .feature-card ul { list-style: none; color: var(--text-muted); font-size: 0.875rem; }
        .feature-card li { margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .feature-card li::before { content: "✓"; color: var(--primary); font-weight: bold; }

        .test-login-box {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid var(--primary);
            padding: 3rem;
            border-radius: 20px;
            text-align: center;
            margin-top: 4rem;
        }
        .test-login-box h2 { margin-bottom: 1rem; }
        .test-login-box p { margin-bottom: 2rem; color: var(--text-muted); }

        footer { text-align: center; padding: 4rem 2rem; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.875rem; }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2.25rem; }
        }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Studio CRM - Professional Studio Management",
      "headline": "Professional Studio Management CRM",
      "description": "A professional, All-in-One CRM system designed specifically for Tattoo and Piercing Studios. Secure, HIPAA-compliant, and completely free for the community.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "category": "Free"
      },
      "author": {
        "@type": "Organization",
        "name": "Poli International",
        "url": "https://poliinternational.com"
      },
      "featureList": "Client Management, Smart Scheduling, Financial Hub, Inventory Control, Compliance Vault",
      "screenshot": "https://poliinternational.com/wp-content/standalone-tools/studio-crm/screenshot.jpg", 
      "softwareHelp": "https://poliinternational.com/studio-crm/documentation/"
    }
    </script>
</head>
<body>

    <!-- Member Portal Header -->
    <div style="background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); sticky: top; position: fixed; width: 100%; z-index: 1000; padding: 0.75rem 2rem;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <a href="https://poliinternational.com/" style="text-decoration: none; color: var(--text); font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <img src="https://poliinternational.com/wp-content/standalone-tools/jewelry-size-visualizer/images/Poli-International-Co.webp" alt="Poli International" style="height: 30px;">
                    <span style="border-left: 1px solid var(--border); padding-left: 0.75rem; margin-left: 0.25rem;">Studio Hub</span>
                </a>
            </div>
            <div style="display: flex; gap: 1rem;">
                <a href="{{ route('login') }}" class="btn" style="padding: 0.5rem 1.25rem; font-size: 0.875rem; background: transparent; border: 1px solid var(--border); color: var(--text);">Sign In</a>
                <a href="{{ route('register') }}" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.875rem;">Join for Free</a>
            </div>
        </div>
    </div>

    <div style="height: 60px;"></div>

    <nav class="breadcrumb-nav">
        <a href="https://poliinternational.com/">Home</a>
        <span>›</span>
        <a href="https://poliinternational.com/tools/">Tools</a>
        <span>›</span>
        <a href="#">Studio Management</a>
        <span>›</span>
        <strong style="color:white">Studio CRM</strong>
    </nav>

    <header class="hero">
        <h1>Professional Studio Management</h1>
        <p>A professional, All-in-One CRM system designed specifically for Tattoo and Piercing Studios. Secure, HIPAA-compliant, and completely free for the community.</p>
        <div style="display:flex; gap:1.5rem; justify-content:center; flex-wrap:wrap">
            <a href="{{ route('login') }}" class="btn btn-primary">
                <i data-lucide="play"></i> Launch Demo Version
            </a>
            <a href="{{ route('download.resource', ['filename' => 'studio-crm-community-edition.zip']) }}" class="btn" style="background: var(--card); color: white; border: 1px solid var(--primary);">
                <i data-lucide="download-cloud"></i> Download Community Package
            </a>
        </div>
    </header>

    <div class="container">
        <!-- Advantages Section -->
        <div style="margin-bottom: 6rem; background: var(--card); padding: 4rem; border-radius: 24px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
            <div style="text-align: center; margin-bottom: 3rem;">
                <h2 style="font-size: 2.25rem; margin-bottom: 1rem;">Why Register with Poli International?</h2>
                <p style="color: var(--text-muted);">Joining our community unlocks exclusive benefits for your studio.</p>
            </div>
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                <div style="text-align: center; padding: 1rem;">
                    <div style="background: rgba(59, 130, 246, 0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                        <i data-lucide="cloud-lightning" style="color: var(--primary);"></i>
                    </div>
                    <h4>Cloud Sync</h4>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem;">Sync your settings and client intake forms across all your studio devices automatically.</p>
                </div>
                <div style="text-align: center; padding: 1rem;">
                    <div style="background: rgba(16, 185, 129, 0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                        <i data-lucide="unlock" style="color: #10B981;"></i>
                    </div>
                    <h4>Premium Tools</h4>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem;">Get early access to our most advanced technical tools and experimental studio features.</p>
                </div>
                <div style="text-align: center; padding: 1rem;">
                    <div style="background: rgba(139, 92, 246, 0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                        <i data-lucide="award" style="color: #8B5CF6;"></i>
                    </div>
                    <h4>Verified Status</h4>
                    <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem;">Carry the "Poli Verified Studio" badge on your website to show technical excellence.</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 3rem;">
                <a href="{{ route('register') }}" class="btn btn-primary" style="padding: 1rem 3rem;">Create Your Free Account</a>
            </div>
        </div>

        <div style="text-align:center; margin-bottom:4rem">
            <h2 style="font-size:2rem; margin-bottom:1rem">What's Inside the CRM</h2>
            <p style="color:var(--text-muted)">10 powerful modules integrated into a single high-performance dashboard.</p>
        </div>

        <div class="grid">
            <div class="feature-card">
                <i data-lucide="users" size="32"></i>
                <h3>Client Management</h3>
                <ul>
                    <li>Encrypted medical history</li>
                    <li>Full service records</li>
                    <li>Digital photo vault</li>
                </ul>
            </div>
            <div class="feature-card">
                <i data-lucide="calendar" size="32"></i>
                <h3>Smart Scheduling</h3>
                <ul>
                    <li>Visual booking calendar</li>
                    <li>Google Calendar sync</li>
                    <li>Automated reminders</li>
                </ul>
            </div>
            <div class="feature-card">
                <i data-lucide="shield-check" size="32"></i>
                <h3>Compliance Vault</h3>
                <ul>
                    <li>Digital consent waivers</li>
                    <li>Autoclave & spore logs</li>
                    <li>Health standards tracking</li>
                </ul>
            </div>
            <div class="feature-card">
                <i data-lucide="trending-up" size="32"></i>
                <h3>Financial Hub</h3>
                <ul>
                    <li>Revenue & expense tracking</li>
                    <li>Artist commission tools</li>
                    <li>One-click CSV exports</li>
                </ul>
            </div>
            <div class="feature-card">
                <i data-lucide="package" size="32"></i>
                <h3>Inventory Control</h3>
                <ul>
                    <li>Real-time stock tracking</li>
                    <li>Low-stock smart alerts</li>
                    <li>Supplier management</li>
                </ul>
            </div>
            <div class="feature-card">
                <i data-lucide="mail" size="32"></i>
                <h3>Email Automation</h3>
                <ul>
                    <li>Automated aftercare emails</li>
                    <li>Touch-up reminders</li>
                    <li>Welcome sequences</li>
                </ul>
            </div>
        </div>

        <div class="test-login-box">
            <i data-lucide="key" size="48" style="color:var(--primary); margin-bottom:1.5rem"></i>
            <h2>How to Test the Demo</h2>
            <p>You can explore the full power of the CRM right now. No registration required for the demo. Simply click the button below to log in as a <strong>Manager</strong> and see live data for scheduling, financials, and inventory.</p>
            <a href="{{ route('login') }}" class="btn btn-primary" style="padding: 1.25rem 3rem;">
                <i data-lucide="log-in"></i> Start Testing Now
            </a>
        </div>
    </div>

    <footer>
        <p>&copy; 2026 Poli International Studio CRM. Professional Community Edition.</p>
    </footer>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
