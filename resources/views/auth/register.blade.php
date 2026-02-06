<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Join Studio CRM - Create Your Account | Poli International</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        :root {
            --primary: #3B82F6;
            --background: #0F172A;
            --card: rgba(30, 41, 59, 0.7);
            --text: #F8FAFC;
            --text-muted: #94A3B8;
            --border: rgba(255, 255, 255, 0.1);
            --radius: 16px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background: var(--background); 
            color: var(--text);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-image: 
                radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0, transparent 50%),
                radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0, transparent 50%);
        }

        .auth-card {
            background: var(--card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            padding: 3rem;
            border-radius: var(--radius);
            width: 100%;
            max-width: 480px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }
        .logo img { height: 40px; margin-bottom: 1rem; }
        .logo h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em; }

        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-muted); }
        .form-control {
            width: 100%;
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 0.75rem 1rem;
            color: white;
            font-family: inherit;
            transition: all 0.2s;
        }
        .form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }

        .btn {
            width: 100%;
            padding: 0.875rem;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .btn-primary { background: var(--primary); color: white; margin-top: 1rem; }
        .btn-primary:hover { background: #2563EB; transform: translateY(-1px); }

        .social-auth {
            margin-top: 2rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .btn-social {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: var(--text);
            font-size: 0.875rem;
            padding: 0.625rem;
        }
        .btn-social:hover { background: rgba(255, 255, 255, 0.1); }
        .btn-social img { width: 18px; height: 18px; }

        .divider {
            display: flex;
            align-items: center;
            margin: 2rem 0;
            color: var(--text-muted);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: var(--border); }
        .divider span { padding: 0 1rem; }

        .footer-text {
            text-align: center;
            margin-top: 2rem;
            font-size: 0.875rem;
            color: var(--text-muted);
        }
        .footer-text a { color: var(--primary); text-decoration: none; font-weight: 600; }
        
        .alert {
            padding: 1rem;
            border-radius: 8px;
            background: rgba(239, 68, 68, 0.1);
            color: #F87171;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Join Studio CRM",
      "description": "Create a free account for Studio CRM.",
      "url": "{{ route('register') }}"
    }
    </script>
</head>
<body>

    <div class="auth-card">
        <div class="logo">
            <img src="https://poliinternational.com/wp-content/standalone-tools/jewelry-size-visualizer/images/Poli-International-Co.webp" alt="Poli International">
            <h1>Create Studio Account</h1>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">Join the future of studio management</p>
        </div>

        @if($errors->any())
            <div class="alert">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('register.post') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">Full Name</label>
                <div style="position: relative;">
                    <i data-lucide="user" size="18" style="position: absolute; left: 12px; top: 12px; color: var(--text-muted);"></i>
                    <input type="text" name="name" class="form-control" style="padding-left: 2.5rem;" placeholder="John Doe" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Studio Email</label>
                <div style="position: relative;">
                    <i data-lucide="mail" size="18" style="position: absolute; left: 12px; top: 12px; color: var(--text-muted);"></i>
                    <input type="email" name="email" class="form-control" style="padding-left: 2.5rem;" placeholder="studio@example.com" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Password</label>
                <div style="position: relative;">
                    <i data-lucide="lock" size="18" style="position: absolute; left: 12px; top: 12px; color: var(--text-muted);"></i>
                    <input type="password" name="password" class="form-control" style="padding-left: 2.5rem;" placeholder="••••••••" required>
                </div>
            </div>

            <button type="submit" class="btn btn-primary">
                Create Account <i data-lucide="arrow-right" size="18"></i>
            </button>
        </form>

        <div class="divider">
            <span>Or continue with</span>
        </div>

        <div class="social-auth">
            <a href="{{ route('social.login', ['provider' => 'google']) }}" class="btn btn-social">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
                Google
            </a>
            <a href="{{ route('social.login', ['provider' => 'facebook']) }}" class="btn btn-social">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook">
                Facebook
            </a>
        </div>

        <p class="footer-text">
            Already have an account? <a href="{{ route('login') }}">Sign In</a>
        </p>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
